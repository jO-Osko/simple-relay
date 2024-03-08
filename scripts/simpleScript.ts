import "@nomicfoundation/hardhat-verify";
import hardhat, { ethers } from 'hardhat';
import { COSTON_RELAY } from "../lib/constants";
import { ERC20MintableContract, ERC20MintableInstance, RelayGatewayContract, RelayGatewayInstance } from "../typechain-types";
const SimpleCounter = artifacts.require('SimpleCounter');
const RelayGateway: RelayGatewayContract = artifacts.require('RelayGateway');
const ERC20Mintable: ERC20MintableContract = artifacts.require('ERC20Mintable');

import CounterAbi from "../artifacts/contracts/SimpleCounter.sol/SimpleCounter.json";

async function simpleTokenTransfer() {

    if (hardhat.network.name !== 'coston') {
        return console.error('This script should be run on the coston network');
    }

    const [deployer] = await ethers.getSigners();
    const relayer: RelayGatewayInstance = await RelayGateway.at(COSTON_RELAY);
    const token0: ERC20MintableInstance = await ERC20Mintable.at(await relayer.availableTokens(0)); // availableTokens je v resnici funkcija

    await token0.approve(relayer.address, 1234)

    const tx = await relayer.requestRelay(
        deployer.address,
        "0x",
        token0.address,
        1234
    )

    console.log(tx.tx)
}

async function simpleCalldataTransfer() {
    const [deployer] = await ethers.getSigners();

    if (hardhat.network.name !== 'coston') {
        return console.error('This script should be run on the coston network');
    }

    const relayer: RelayGatewayInstance = await RelayGateway.at(COSTON_RELAY);
    const token0: ERC20MintableInstance = await ERC20Mintable.at(await relayer.availableTokens(0)); // availableTokens je v resnici funkcija


    await token0.approve(relayer.address, 1234)

    let iface = new ethers.Interface(
        CounterAbi.abi
    )
    const calldata = iface.encodeFunctionData('setCounter', [2222, token0.address, 12, deployer.address]);

    const tx = await relayer.requestRelay(
        await relayer.tokenPair(token0.address),
        calldata,
        token0.address,
        1234
    )
    console.log(tx.tx)
}


simpleTokenTransfer().then(() => process.exit(0))
simpleCalldataTransfer().then(() => process.exit(0))