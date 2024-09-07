import { task } from "hardhat/config";

task("listen-pet", "Listen Pet")
	.addParam("nftId", "")
	.addParam("message", "")
	.addOptionalParam("signer", "Custom signer (private key)")
	.addOptionalParam("provider", "Custom provider RPC url")
	.setAction(async (args, hre:any) => {
		const ethers = hre.ethers;
		const [deployer] = await ethers.getSigners();

		let signer = deployer;
		if (args.signer) signer = new ethers.Wallet(args.signer, new ethers.providers.JsonRpcProvider(args.provider));
		
		const petNFT = await ethers.getContract("PetNFT");
		const message = await petNFT.getLastMessage(args.nftId);

		console.log("Last message from pet: ", message);
	});
