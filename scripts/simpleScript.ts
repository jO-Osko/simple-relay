import "@nomicfoundation/hardhat-verify";
import hardhat, { ethers } from 'hardhat';
const SimpleCounter = artifacts.require('SimpleCounter');
const RelayGateway = artifacts.require('RelayGateway');

async function main() {

    const [deployer] = await ethers.getSigners();


    console.log("Deploying contracts with the account:", deployer.address);

    const counterContract = await SimpleCounter.new();
    await counterContract.setCounter(42);
    const val = await counterContract.getCounter();

    console.log("the set value is: ", val.toNumber());
    console.log("this works");

    // ostal pri 'kako vzeti dan contract in z njim klicati counterContract?'

    const tokenCoston = '0x7977957C48849e1f3A4Dc16bEEE9b9097a1d2271';
    const tokenSepolia = '0xfE59201C767a9E6DDEc1fBe5D978DC41Ef8b5210';
    const relayer = await RelayGateway.new(deployer.address, hardhat.network.name === 'coston');
    await relayer.addTokenPair(tokenCoston, tokenSepolia);
    console.log("can i see this mapping? ", relayer.tokenMap);


}
main().then(() => process.exit(0))