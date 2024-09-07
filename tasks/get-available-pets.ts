import { task } from "hardhat/config";

task("get-available-pets", "Get Available Pets")
	.addOptionalParam("signer", "Custom signer (private key)")
	.addOptionalParam("provider", "Custom provider RPC url")
	.setAction(async (args, hre:any) => {
		const ethers = hre.ethers;
		const [deployer] = await ethers.getSigners();

		let signer = deployer;
		if (args.signer) signer = new ethers.Wallet(args.signer, new ethers.providers.JsonRpcProvider(args.provider));
		
		const petNFT = await ethers.getContract("PetNFT");

		const availablePets = await petNFT.getAvailablePets();


		for (let i = 0; i < availablePets.length; i++) {
			const pet = await petNFT.getPet(availablePets[i]);
			console.log("Pet ID: ", availablePets[i]);
			console.log(pet);
		}		

	});