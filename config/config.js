require('dotenv').config();
const ABI = require('../artifacts/contracts/CFN.sol/CFN.json').abi;

const config = {
    network: process.env.NETWORK,
    privateKey: process.env.PRIVATE_KEY,
    contract_ABI: ABI,
    contract_Address: '0xe46b4e1B6bD43d409e917032b2b79a410ab2fddA', //_Matic
    // contract_Address: '0xBB4829C6262020be844608f63440E1A78ECb3440', //_Sepolia
    // contract_Address: '0x44789aBd962b538d85501c574e6F780a9b2F6337' //_Scroll
}

module.exports = config;