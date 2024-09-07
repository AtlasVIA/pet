import fs from 'fs';
import { task } from "hardhat/config";
import chainsConfig from "@vialabs-io/contracts/config/chains";
import networks from "../networks";

task("configure", "")
	.addOptionalParam("signer", "Custom signer (private key)")
	.addOptionalParam("provider", "Custom provider RPC url")
	.setAction(async (args, hre:any) => {
		const ethers = hre.ethers;
		const [deployer] = await ethers.getSigners();

		let signer = deployer;
		if (args.signer) signer = new ethers.Wallet(args.signer, new ethers.providers.JsonRpcProvider(args.provider));
		
		let addresses = [];
		let chainids = [];
		let confirmations=[];
		for(let x=0; x < networks.length; x++) {
			const petNFT = require(process.cwd()+"/deployments/"+networks[x]+"/PetNFT.json");
			const chainId = fs.readFileSync(process.cwd()+"/deployments/"+networks[x]+"/.chainId").toString();
			addresses.push(petNFT.address);
			chainids.push(chainId);
			confirmations.push(1);
		}
	
		console.log('setting remote contract addresses .. CLT message address:', chainsConfig[hre.network.config.chainId].message);
		const petNFT = await ethers.getContract("PetNFT");
		await (await petNFT.configureClient(chainsConfig[hre.network.config.chainId].message, chainids, addresses, confirmations)).wait();
	});
