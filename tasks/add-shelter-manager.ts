import { task } from "hardhat/config";

task("add-shelter-manager", "Add Shelter Manager")
	.addParam("shelterId", "Shelter ID")
	.addParam("manager", "Manager address")
	.addOptionalParam("signer", "Custom signer (private key)")
	.addOptionalParam("provider", "Custom provider RPC url")
	.setAction(async (args, hre:any) => {
		const ethers = hre.ethers;
		const [deployer] = await ethers.getSigners();

		let signer = deployer;
		if (args.signer) signer = new ethers.Wallet(args.signer, new ethers.providers.JsonRpcProvider(args.provider));
		
		const petNFT = await ethers.getContract("PetNFT");

		await (await petNFT.addShelterManager(
			args.shelterId,
			args.manager
		)).wait();

		console.log("Shelter manager added successfully");
	});
