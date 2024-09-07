import { task } from "hardhat/config";

task("get-shelters", "Get Shelters")
	.addOptionalParam("signer", "Custom signer (private key)")
	.addOptionalParam("provider", "Custom provider RPC url")
	.setAction(async (args, hre:any) => {
		const ethers = hre.ethers;
		const [deployer] = await ethers.getSigners();

		let signer = deployer;
		if (args.signer) signer = new ethers.Wallet(args.signer, new ethers.providers.JsonRpcProvider(args.provider));
		
		const petNFT = await ethers.getContract("AdoptAPet");

		const allShelters = await petNFT.getAllShelters();

		for (let i = 0; i < allShelters.length; i++) {
			const shelter = await petNFT.getShelter(allShelters[i]);
			console.log("Shelter ID: ", allShelters[i]);
			console.log(shelter);
		}

		

	});
