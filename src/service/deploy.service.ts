"use strict"
import axios from 'axios';
import { ethers } from "ethers";
import FormData from 'form-data';
import fs from 'fs';
import web3 from "web3";
import ABI from "../../smart_contract/artifacts/abi.json"
import { CONTRACT_ADDRESS, JWT, POLYGON_GAS_STATION, WALLET_PRIVATE_KEY, NODE_URL } from "../../config/default";
import Web3 from 'web3';

const deployNFT = async (coursesArray: any, mediaObj: any, isImage: Boolean) => {

    // Store the Image on IPFS and return the hash.

    let mediaHash: any;
    try {
        let result = await pinImage(mediaObj);
        mediaHash = "ipfs://" + result.IpfsHash;
        console.log('Image IPFS Hash', mediaHash);
    } catch (err) {
        console.error(err)
    }

    // Create MetaData and Store on IPFS and return hash.

    let metadataHash = [];
    const userMetaData = await createMetaDta(coursesArray, mediaHash, isImage);
    console.log('User MetaData', userMetaData);

    try {
        for (let i = 0; i < userMetaData.length; i += 1) {
            let _data = await pinMetadata(userMetaData[i]);
            metadataHash.push("ipfs://" + _data.IpfsHash);
        }
        console.log('Metadata IPFS Hash', metadataHash);
    } catch (err) {
        console.error(err);
    }

    // Call Contract Function createMultiNFT and return the response.

    let usersAddress = [];
    for (let i = 0; i < coursesArray.length; i += 1) {
        let userInfo = coursesArray[i];
        usersAddress.push(userInfo.walletAddress);
    }
    console.log('List Of Users Address', usersAddress);

    const provider = new ethers.providers.JsonRpcProvider(NODE_URL);
    const signer = new ethers.Wallet(WALLET_PRIVATE_KEY, provider);
    const nftContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    const nonce = await provider.getTransactionCount(signer.address);
    const estimateGas = await fetch(POLYGON_GAS_STATION).then((response) => response.json());
    const maxPriorityFeePerGas = web3.utils.toWei(Math.ceil(estimateGas.fast.maxPriorityFee).toString(), 'gwei');

    const estimateMaxFeePerGas = estimateGas.estimatedBaseFee + estimateGas.fast.maxPriorityFee;
    const maxFeePerGas = web3.utils.toWei(Math.ceil(estimateMaxFeePerGas).toString(), 'gwei');

    let transaction;
    try {
        transaction = await nftContract.createMultiNFT(usersAddress, metadataHash, {
            from: signer.address,
            maxPriorityFeePerGas,
            gasLimit: 2000000,
            maxFeePerGas,
            nonce,
        });
        await transaction.wait();
    } catch (err) {
        console.error(err);
    }

    console.log(transaction);

    if (transaction && transaction.hash) return true

    return false;
}

const createMetaDta = async (_data: any, mediaHash: string, isImage: Boolean) => {

    let userMetaData = [];
    let metaData;
    for (let i = 0; i < _data.length; i += 1) {
        let attributes = [];

        const title = { "title": "Asset Metadata" };
        const name = { "name": _data[i].nftName };
        const description = { "description": "Zedta Achievement NFT on course completion" };
        const media = isImage ? { "image": mediaHash } : { "animation_url": mediaHash };
        attributes.push(
            {
                "trait_type": "Batch",
                "value": _data[i].batchNo
            },
            {
                "trait_type": "User",
                "value": _data[i].projectUserId
            },
            {
                "trait_type": "Project",
                "value": _data[i].projectName
            },
            {
                "trait_type": "Level",
                "value": _data[i].courseLevel
            },
            {
                "display_type": "date",
                "trait_type": "Start Date",
                "value": _data[i].startDate
            },
            {
                "display_type": "date",
                "trait_type": "End Date",
                "value": _data[i].endDate
            })

        if (_data[i].expiryDate != null) {
            attributes.push({
                "display_type": "date",
                "trait_type": "Validity",
                "value": _data[i].expiryDate
            })
        } else {
            attributes.push({
                "trait_type": "Validity",
                "value": "LifeTime"
            })
        }
        const attribute = { "attributes": attributes };
        metaData = Object.assign(title, name, description, media, attribute);
        userMetaData.push(metaData);
    }
    return userMetaData;
}

const pinMetadata = async (_data: any) => {
    const data = JSON.stringify({
        "pinataOptions": {
            "cidVersion": 0
        },
        "pinataMetadata": {
            "name": _data.name,
        },
        "pinataContent": _data,
    });

    const config = {
        method: 'post',
        url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': JWT,
        },
        data: data
    };

    const res = await axios(config);
    return res.data;
}

const pinImage = async (_data: any) => {
    const data = new FormData();
    data.append('file', fs.createReadStream(_data.path));
    data.append('pinataOptions', '{"cidVersion": 0}');

    const config = {
        method: 'post',
        url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
        headers: {
            'Authorization': JWT,
            ...data.getHeaders()
        },
        data: data
    };

    const res = await axios(config);
    return res.data;
}

export = deployNFT;