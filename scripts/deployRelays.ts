import "@nomicfoundation/hardhat-verify";
import hardhat, { artifacts, ethers } from 'hardhat';
import { COSTON_TOKENS, SEPOLIA_TOKENS } from "../lib/constants";
import { requestVerification, sleep } from "../lib/utils";
const RelayGateway = artifacts.require('RelayGateway');


async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    let tokensCoston = COSTON_TOKENS

    let tokensSepolia = SEPOLIA_TOKENS

    if (hardhat.network.name === 'sepolia') {
        let tmp = tokensCoston
        tokensCoston = tokensSepolia
        tokensSepolia = tmp
    }

    const args = [deployer.address, hardhat.network.name === 'coston']
    const relayer = await RelayGateway.new(...args);
    await requestVerification(relayer.address, args);
    console.log("Relayer address: ", relayer.address)
    for (let i = 0; i < tokensCoston.length; i++) {

        await relayer.addTokenPair(tokensCoston[i], tokensSepolia[i]);
        await sleep(1)
    }

}
main().then(() => process.exit(0))