// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.16;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Zedta is Ownable, ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter tokenId;

    event Attest(address indexed receiver, uint256 indexed tokenId);
    event Revoke(address indexed owner, uint256 indexed tokenId);

    constructor(string memory _name, string memory _symbol)
        ERC721(_name, _symbol)

    function burn(uint256 _tokenId) external returns (uint256) {
        _burn(_tokenId);
        return _tokenId;
    }

    function attest(address to, uint256 _tokenId)
        public
        onlyOwner
        returns (uint256)
    {
        _mint(to, _tokenId);
        return _tokenId;
    }

    function setURI(uint256 _tokenId, string memory _uri)
        public
        onlyOwner
        returns (uint256)
    {
        _setTokenURI(_tokenId, _uri);
        return _tokenId;
    }

    function createMultiNFT(
        address[] calldata _addresses,
        string[] calldata _uriList
    ) external onlyOwner {
        require(_addresses.length == _uriList.length, "length doesn't match");

        uint256 newTokenId;

        for (uint256 i = 0; i < _addresses.length; i++) {
            if (_addresses[i] == address(0)) continue;

            newTokenId = tokenId.current();

            attest(_addresses[i], newTokenId); // Create New NFT
            setURI(newTokenId, _uriList[i]); // Set URI to the NFT

            tokenId.increment();
        }
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 _tokenId
    ) internal virtual override(ERC721) {
        require(
            from == address(0) || to == address(0),
            " Token Is SoulBounded"
        );

        super._beforeTokenTransfer(from, to, _tokenId);
    }

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 _tokenId
    ) internal virtual override(ERC721) {
        if (from == address(0)) emit Attest(to, _tokenId);
        else if (to == address(0)) emit Revoke(from, _tokenId);

        super._afterTokenTransfer(from, to, _tokenId);
    }
}
