import "@nomicfoundation/hardhat-verify";
import hardhat, { ethers } from 'hardhat';
import { COSTON_COUNTER, COSTON_RELAY, SEPOLIA_COUNTER, SEPOLIA_RELAY } from "../lib/constants";
import { requestVerification } from "../lib/utils";
import { ERC20MintableContract, ERC20MintableInstance, RelayGatewayContract, RelayGatewayInstance } from "../typechain-types";
const SimpleCounter = artifacts.require('SimpleCounter');
const RelayGateway: RelayGatewayContract = artifacts.require('RelayGateway');
const ERC20Mintable: ERC20MintableContract = artifacts.require('ERC20Mintable');

import CounterAbi from "../artifacts/contracts/SimpleCounter.sol/SimpleCounter.json";

async function main() {

    if (hardhat.network.name !== 'coston') {
        return console.error('This script should be run on the coston network');
    }

    const [deployer] = await ethers.getSigners();

    // Ne delat novega relayera, uporabi tega, ki je že deployan na chainu
    // Razen če je ta ne dela, potem enkrat narediš novega in popraviš naslov

    const relayer: RelayGatewayInstance = await RelayGateway.at(COSTON_RELAY);
    const token0: ERC20MintableInstance = await ERC20Mintable.at(await relayer.availableTokens(0)); // availableTokens je v resnici funkcija

    await token0.transfer(relayer.address, 1000)

    const tx = await relayer.executeRelay({
        uid: 0,
        relayInitiator: deployer.address, // irrelevant
        relayTarget: deployer.address, // pošljemo sebi nazaj
        additionalCalldata: "0x",
        sourceToken: token0.address, // zdele nepomembno, drgač pa klic na relay.TokenPAirs[token0.address]
        targetToken: token0.address,
        amount: 1000,
        executionResult: 0,
        relayDataHash: "0x" + "0".repeat(64),
    });

    console.log(tx)

}



async function main2() {
    const [deployer] = await ethers.getSigners();
    console.log(deployer);
    console.log(hardhat.network);

    if (hardhat.network.name !== 'coston') {
        return console.error('This script should be run on the coston network');
    }



    // Ne delat novega relayera, uporabi tega, ki je že deployan na chainu
    // Razen če je ta ne dela, potem enkrat narediš novega in popraviš naslov

    const relayer: RelayGatewayInstance = await RelayGateway.at(COSTON_RELAY);
    const token0: ERC20MintableInstance = await ERC20Mintable.at(await relayer.availableTokens(0)); // availableTokens je v resnici funkcija


    await token0.transfer(relayer.address, 1000)

    // Zdej pa nardiomo counter (v resnici bi ga vzeli nekje iz chaina) in delali vsakil na novo
    // const counterContract = await SimpleCounter.new();
    const counterContract = await SimpleCounter.at(COSTON_COUNTER);

    // Zato, da lahko to gledamo v explorerju, ta [] so construktor arguemnti za counterContract
    await requestVerification(counterContract.address, [])
    console.log("Counter contract deployed at: ", counterContract.address)
    console.log("Counter counter", (await counterContract.getCounter()).toString()) // Ker je counter public bi delolo tudi spodnje




    // // Pripravimo calldata
    let iface = new ethers.Interface(
        CounterAbi.abi
    )
    const calldata = iface.encodeFunctionData('setCounter', [2222, token0.address, 12, deployer.address]);
    console.log("Counter counter", (await counterContract.counter()).toString())


    const tx = await relayer.executeRelay({
        uid: 0,
        relayInitiator: deployer.address, // irrelevant
        relayTarget: counterContract.address, // pošljemo na counter
        additionalCalldata: calldata,
        sourceToken: token0.address, // zdele nepomembno, drgač pa klic na relay.TokenPAirs[token0.address]
        targetToken: token0.address,
        amount: 1000,
        executionResult: 0,
        relayDataHash: "0x" + "0".repeat(64),
    });

    console.log(tx)
    console.log("Counter counter", (await counterContract.counter()).toString())

    // // Preden bo to vse delalo moramo nakazat nekaj tokena na ta contract (ker ga nima nič) - to bo delal tisti relayer vmes
}

async function main3() {
    const [deployer] = await ethers.getSigners();

    if (hardhat.network.name !== 'sepolia') {
        return console.error('This script should be run on the sepolia network');
    }



    // Ne delat novega relayera, uporabi tega, ki je že deployan na chainu
    // Razen če je ta ne dela, potem enkrat narediš novega in popraviš naslov
    const relayer: RelayGatewayInstance = await RelayGateway.at(SEPOLIA_RELAY);
    const token0: ERC20MintableInstance = await ERC20Mintable.at(await relayer.availableTokens(0)); // availableTokens je v resnici funkcija


    await token0.transfer(relayer.address, 1000)


    // Zdej pa nardiomo counter (v resnici bi ga vzeli nekje iz chaina) in delali vsakil na novo
    // const counterContract = await SimpleCounter.new();
    const counterContract = await SimpleCounter.at(SEPOLIA_COUNTER);

    // Zato, da lahko to gledamo v explorerju, ta [] so construktor arguemnti za counterContract
    // await requestVerification(counterContract.address, [])
    console.log("Counter contract deployed at: ", counterContract.address)
    console.log("Counter counter", (await counterContract.getCounter()).toString()) // Ker je counter public bi delolo tudi spodnje


    hardhat.network.name = 'coston';
    console.log(hardhat.network.name);
    const relayer1: RelayGatewayInstance = await RelayGateway.at(COSTON_RELAY);
    const token1: ERC20MintableInstance = await ERC20Mintable.at(await relayer1.availableTokens(0));
    console.log(token1.address);

    // // Pripravimo calldata
    // let iface = new ethers.Interface(
    //     CounterAbi.abi
    // )
    // const calldata = iface.encodeFunctionData('setCounter', [5000, token0.address, 12, deployer.address]);
    // console.log("Calldata: ", calldata)


    // const tx = await relayer.executeRelay({
    //     uid: 0,
    //     relayInitiator: deployer.address, // irrelevant
    //     relayTarget: counterContract.address, // pošljemo na counter
    //     additionalCalldata: calldata,
    //     sourceToken: token0.address, // zdele nepomembno, drgač pa klic na relay.TokenPAirs[token0.address]
    //     targetToken: token0.address,
    //     amount: 1000,
    //     executionResult: 0,
    //     relayDataHash: "0x" + "0".repeat(64),
    // });

    // console.log(tx)
    // console.log("Counter counter", (await counterContract.counter()).toString())

    // // Preden bo to vse delalo moramo nakazat nekaj tokena na ta contract (ker ga nima nič) - to bo delal tisti relayer vmes
}


main3().then(() => process.exit(0))