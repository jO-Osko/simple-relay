import "@nomicfoundation/hardhat-verify";
import { artifacts, ethers } from 'hardhat';
const ERC20Mintable = artifacts.require('ERC20Mintable');


async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const addresses = []

    for (let i = 0; i < 10; i++) {
        const args: any[] = [`USDT-${i}`, `USDT-${i}`]
        const simpleToken = await ERC20Mintable.new(...args);
        addresses.push(simpleToken.address)
        const tx = await simpleToken.mint(deployer.address, `${5 * 10 ** 18}`)

        // try {
        //     const result = await run("verify:verify", {
        //         address: simpleToken.address,
        //         constructorArguments: args,
        //     })

        //     console.log(result)
        // } catch (e: any) {
        //     console.log(e.message)
        // }
    }

    console.log("Addresses: ", addresses)

}
main().then(() => process.exit(0))