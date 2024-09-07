import { task } from "hardhat/config";

task("bridge-pet", "Bridge Pet")
	.addParam("dest", "")
	.addParam("recipient", "")
	.addParam("nftId", "")
	.addOptionalParam("signer", "Custom signer (private key)")
	.addOptionalParam("provider", "Custom provider RPC url")
	.setAction(async (args, hre:any) => {
		const ethers = hre.ethers;
		const [deployer] = await ethers.getSigners();

		let signer = deployer;
		if (args.signer) signer = new ethers.Wallet(args.signer, new ethers.providers.JsonRpcProvider(args.provider));
		
		const petNFT = await ethers.getContract("PetNFT");
		await (await petNFT.bridge(
			args.dest,
			args.recipient,
			args.nftId
		)).wait();

		console.log("Pet bridged successfully");
	});
