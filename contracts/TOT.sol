// SPDX-License-Identifier: MIT
// TOT (Test Only Token) Contract
// Copyright (c) 2022 JacobLinCool
pragma solidity ^0.8.0;

import { Strings, ERC721Enumerable, ERC721 } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { SafeMath } from "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract TOT is ERC721Enumerable, Ownable {
    // Apply Advanced Usage
    using SafeMath for uint256;
    using Strings for uint256;

    // Constant Settings
    string public constant TOKEN_NAME = "Test Only Token";
    string public constant TOKEN_SYMBOL = "TOT";
    string public constant BASE_URL = "ipfs://bafybeigdctq2jmfsyclgtr6oedbkdgkhj2ct3fa26tv7mjiiftlbumohre/";
    string public constant BASE_EXT = ".json";
    uint256 public constant TOTAL_SUPPLY = 3000;
    uint256 public constant TOKEN_COST = 0.001 ether;
    uint256 public constant ONCE_MINT_MAX = 30;

    // Changable States
    bool public paused = false;
    uint256 internal nonce = 0;
    uint256[TOTAL_SUPPLY] internal indices;

    constructor() ERC721(TOKEN_NAME, TOKEN_SYMBOL) {}

    function randomIndex() internal returns (uint256) {
        uint256 total = TOTAL_SUPPLY - totalSupply(); // totalSupply(): from ERC721Enumerable
        // generate random uint in range from 0 to (total - 1)
        uint256 idx = uint256(keccak256(abi.encodePacked(nonce, msg.sender, block.difficulty, block.timestamp))) %
            total;
        uint256 value = 0;
        if (indices[idx] != 0) {
            value = indices[idx];
        } else {
            value = idx;
        }

        if (indices[total - 1] == 0) {
            indices[idx] = total - 1;
        } else {
            indices[idx] = indices[total - 1];
        }
        nonce++;
        // 1 ~ TOTAL_SUPPLY
        return value.add(1);
    }

    // Mint TOT!
    function mint(uint256 amount) public payable {
        require(!paused, "Minting is paused");
        require(amount > 0, "Amount must be greater than 0");
        require(
            amount <= ONCE_MINT_MAX,
            string(abi.encodePacked("Amount must be less than or equal to ", ONCE_MINT_MAX.toString()))
        );
        require(
            totalSupply() + amount <= TOTAL_SUPPLY,
            string(abi.encodePacked("Sorry, now we only have ", (TOTAL_SUPPLY - totalSupply()).toString(), " TOT left"))
        );

        require(
            msg.value >= TOKEN_COST * amount,
            string(
                abi.encodePacked(
                    "Price of ",
                    amount.toString(),
                    " TOT is ",
                    ((TOKEN_COST * amount) / 1e12).toString(),
                    " szabos, only paid ",
                    ((msg.value / 1e12)).toString()
                )
            )
        );

        for (uint256 i = 1; i <= amount; i++) {
            _safeMint(msg.sender, randomIndex());
        }
    }

    function getWallet(address owner) public view returns (uint256[] memory) {
        uint256 owner_token_count = balanceOf(owner);
        uint256[] memory tokens = new uint256[](owner_token_count);
        for (uint256 i; i < owner_token_count; i++) {
            tokens[i] = tokenOfOwnerByIndex(owner, i);
        }
        return tokens;
    }

    function tokenURI(uint256 token_id) public view virtual override returns (string memory) {
        require(_exists(token_id), "ERC721Metadata: URI query for nonexistent token");

        return string(abi.encodePacked(BASE_URL, token_id.toString(), BASE_EXT));
    }

    function pause(bool state) public onlyOwner {
        paused = state;
    }

    function withdraw() public payable onlyOwner {
        (bool os, ) = payable(owner()).call{ value: address(this).balance }("");
        require(os);
    }
}
