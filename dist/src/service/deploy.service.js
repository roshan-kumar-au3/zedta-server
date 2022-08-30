"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const axios_1 = __importDefault(require("axios"));
const ethers_1 = require("ethers");
const form_data_1 = __importDefault(require("form-data"));
const fs_1 = __importDefault(require("fs"));
const web3_1 = __importDefault(require("web3"));
const abi_json_1 = __importDefault(require("../../smart_contract/artifacts/abi.json"));
const default_1 = require("../../config/default");
const deployNFT = (coursesArray, mediaObj, isImage) => __awaiter(void 0, void 0, void 0, function* () {
    // Store the Image on IPFS and return the hash.
    let mediaHash;
    try {
        let result = yield pinImage(mediaObj);
        mediaHash = "ipfs://" + result.IpfsHash;
        console.log('Image IPFS Hash', mediaHash);
    }
    catch (err) {
        console.error(err);
    }
    // Create MetaData and Store on IPFS and return hash.
    let metadataHash = [];
    const userMetaData = yield createMetaDta(coursesArray, mediaHash, isImage);
    console.log('User MetaData', userMetaData);
    try {
        for (let i = 0; i < userMetaData.length; i += 1) {
            let _data = yield pinMetadata(userMetaData[i]);
            metadataHash.push("ipfs://" + _data.IpfsHash);
        }
        console.log('Metadata IPFS Hash', metadataHash);
    }
    catch (err) {
        console.error(err);
    }
    // Call Contract Function createMultiNFT and return the response.
    let usersAddress = [];
    for (let i = 0; i < coursesArray.length; i += 1) {
        let userInfo = coursesArray[i];
        usersAddress.push(userInfo.walletAddress);
    }
    console.log('List Of Users Address', usersAddress);
    const provider = new ethers_1.ethers.providers.JsonRpcProvider(default_1.NODE_URL);
    const signer = new ethers_1.ethers.Wallet(default_1.WALLET_PRIVATE_KEY, provider);
    const nftContract = new ethers_1.ethers.Contract(default_1.CONTRACT_ADDRESS, abi_json_1.default, signer);
    const nonce = yield provider.getTransactionCount(signer.address);
    const estimateGas = yield fetch(default_1.POLYGON_GAS_STATION).then((response) => response.json());
    const maxPriorityFeePerGas = web3_1.default.utils.toWei(Math.ceil(estimateGas.fast.maxPriorityFee).toString(), 'gwei');
    const estimateMaxFeePerGas = estimateGas.estimatedBaseFee + estimateGas.fast.maxPriorityFee;
    const maxFeePerGas = web3_1.default.utils.toWei(Math.ceil(estimateMaxFeePerGas).toString(), 'gwei');
    let transaction;
    try {
        transaction = yield nftContract.createMultiNFT(usersAddress, metadataHash, {
            from: signer.address,
            maxPriorityFeePerGas,
            gasLimit: 2000000,
            maxFeePerGas,
            nonce,
        });
        yield transaction.wait();
    }
    catch (err) {
        console.error(err);
    }
    console.log(transaction);
    if (transaction && transaction.hash)
        return true;
    return false;
});
const createMetaDta = (_data, mediaHash, isImage) => __awaiter(void 0, void 0, void 0, function* () {
    let userMetaData = [];
    let metaData;
    for (let i = 0; i < _data.length; i += 1) {
        let attributes = [];
        const title = { "title": "Asset Metadata" };
        const name = { "name": _data[i].nftName };
        const description = { "description": "Zedta Achievement NFT on course completion" };
        const media = isImage ? { "image": mediaHash } : { "animation_url": mediaHash };
        attributes.push({
            "trait_type": "Batch",
            "value": _data[i].batchNo
        }, {
            "trait_type": "User",
            "value": _data[i].projectUserId
        }, {
            "trait_type": "Project",
            "value": _data[i].projectName
        }, {
            "trait_type": "Level",
            "value": _data[i].courseLevel
        }, {
            "display_type": "date",
            "trait_type": "Start Date",
            "value": _data[i].startDate
        }, {
            "display_type": "date",
            "trait_type": "End Date",
            "value": _data[i].endDate
        });
        if (_data[i].expiryDate != null) {
            attributes.push({
                "display_type": "date",
                "trait_type": "Validity",
                "value": _data[i].expiryDate
            });
        }
        else {
            attributes.push({
                "trait_type": "Validity",
                "value": "LifeTime"
            });
        }
        const attribute = { "attributes": attributes };
        metaData = Object.assign(title, name, description, media, attribute);
        userMetaData.push(metaData);
    }
    return userMetaData;
});
const pinMetadata = (_data) => __awaiter(void 0, void 0, void 0, function* () {
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
            'Authorization': default_1.JWT,
        },
        data: data
    };
    const res = yield (0, axios_1.default)(config);
    return res.data;
});
const pinImage = (_data) => __awaiter(void 0, void 0, void 0, function* () {
    const data = new form_data_1.default();
    data.append('file', fs_1.default.createReadStream(_data.path));
    data.append('pinataOptions', '{"cidVersion": 0}');
    const config = {
        method: 'post',
        url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
        headers: Object.assign({ 'Authorization': default_1.JWT }, data.getHeaders()),
        data: data
    };
    const res = yield (0, axios_1.default)(config);
    return res.data;
});
module.exports = deployNFT;
//# sourceMappingURL=deploy.service.js.map