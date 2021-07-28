#!/usr/bin/env node
const { ethers } = require('ethers')
const { readFileSync } = require('fs')

const provider = new ethers.providers.InfuraProvider('homestead', process.env.INFURA_ID)

const erc721EnumerableAbi = [
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function balanceOf(address owner) view returns (uint256)"
]

const contract = new ethers.Contract('0xfbb6684ebd6093989740e8ef3e7d57cf3813e5a4', erc721EnumerableAbi, provider)

async function getTokenOwner(tokenId) {
  return contract.ownerOf(tokenId)
}

async function getTokenBalance(address) {
  return contract.balanceOf(address)
}

const file = readFileSync(process.argv[2])

file.toString().split('\n').forEach((address) => {
  if (!address || address === '') { return }
  getTokenBalance(address).then((balance) => {
    if (balance.toNumber() === 0) {
      console.log(`${address} has no tokens`)
    }
  }).catch((e) => {
    console.log(`${address} had a problem: ${e}`)
  })
})
