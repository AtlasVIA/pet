import { task } from "hardhat/config";

task("adopt-pet", "Adopt Pet")
	.addParam("nftId", "")
	.addOptionalParam("signer", "Custom signer (private key)")
	.addOptionalParam("provider", "Custom provider RPC url")
	.setAction(async (args, hre:any) => {
		const ethers = hre.ethers;
		const [deployer] = await ethers.getSigners();

		let signer = deployer;
		if (args.signer) signer = new ethers.Wallet(args.signer, new ethers.providers.JsonRpcProvider(args.provider));
		
		const petNFT = await ethers.getContract("AdoptAPet");
		await (await petNFT.adoptPet(
			args.nftId
		)).wait();

		console.log("Pet adopted successfully!");
	});
