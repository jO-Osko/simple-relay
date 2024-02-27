import "@nomicfoundation/hardhat-verify";
import hardhat, { artifacts, ethers } from 'hardhat';
const RelayGateway = artifacts.require('RelayGateway');


async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    let tokensCoston = [
        '0x7977957C48849e1f3A4Dc16bEEE9b9097a1d2271',
        '0xDf3E9fd1B69bc77e8bC4470E5690939082095f38',
        '0x01589CFEcd705dD654Db3Fa587aAB028cF252c3C',
        '0x10616a06B247Fc7eEE51dCA2b671878d18d036F1',
        '0x0FE38f8e2866a782a93aA950f7792A7a9Db8E3Bf',
        '0xA4331B3c6AEaE2C4828772b0Fa1E5848a1Ed433F',
        '0xEAc497403A613F0083DA9aA183838e2f27435C0c',
        '0x3F35402c436BB61dE85206E68bA0F30c239068b6',
        '0x2D49066303f6fFa88027Caa5c6F41Bd71109f4dB',
        '0x013F8ccB524E65DcDF5eD76a9678cf665e02cd4A'
    ]

    let tokensSepolia = [
        '0xfE59201C767a9E6DDEc1fBe5D978DC41Ef8b5210',
        '0xa23296c562Fa47dbd47998ca28Eb32Ebd46006CF',
        '0x3Eaa2fA1b7dE17CC5bc130D63A73396914d4b8Fd',
        '0xC20f5542c8D3Cf035AB06d85818F0138edd6F684',
        '0x66bE4C58Bba3bAa5e2D36Ff1937E996A13d36B0e',
        '0xaBFEF12033F86d718A11C6E4e4FC2F54e2e48249',
        '0x0c59c66a8394963B6195B0B53d936e8e560a4d85',
        '0xB3E53bcE724162cc062be9EDEAC200c3C685172a',
        '0xF51220a5fD85fbDB60556aA2ae0bB14cdD7A30Ed',
        '0xD6974a36512e04c4B9DC5FEc35bD0DE9f9909DC8'
    ]// TODO

    if (hardhat.network.name === 'sepolia') {
        let tmp = tokensCoston
        tokensCoston = tokensSepolia
        tokensSepolia = tmp
    }

    const relayer = await RelayGateway.new(deployer.address, hardhat.network.name === 'coston');
    console.log("Relayer address: ", relayer.address)
    for (let i = 0; i < tokensCoston.length; i++) {
        await relayer.addTokenPair(tokensCoston[i], tokensSepolia[i]);
    }

}
main().then(() => process.exit(0))