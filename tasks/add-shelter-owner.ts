import { task } from "hardhat/config";

task("add-shelter-owner", "Add Shelter Owner")
	.addParam("shelterId", "Shelter ID")
	.addParam("owner", "Owner address")
	.addOptionalParam("signer", "Custom signer (private key)")
	.addOptionalParam("provider", "Custom provider RPC url")
	.setAction(async (args, hre:any) => {
		const ethers = hre.ethers;
		const [deployer] = await ethers.getSigners();

		let signer = deployer;
		if (args.signer) signer = new ethers.Wallet(args.signer, new ethers.providers.JsonRpcProvider(args.provider));
		
		const petNFT = await ethers.getContract("PetNFT");

		await (await petNFT.addShelterOwner(
			args.shelterId,
			args.owner
		)).wait();

		console.log("Shelter owner added successfully");
	});
