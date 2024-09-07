import { task } from "hardhat/config";

task("add-shelter", "Add Shelter")
    .addParam("name", "Shelter name")
	.addParam("location", "Shelter location")
	.addParam("website", "Shelter website")
	.addParam("email", "Shelter email")
	.addOptionalParam("signer", "Custom signer (private key)")
	.addOptionalParam("provider", "Custom provider RPC url")
	.setAction(async (args, hre:any) => {
		const ethers = hre.ethers;
		const [deployer] = await ethers.getSigners();

		let signer = deployer;
		if (args.signer) signer = new ethers.Wallet(args.signer, new ethers.providers.JsonRpcProvider(args.provider));
		
		const petNFT = await ethers.getContract("AdoptAPet");

		await (await petNFT.addShelter(
			args.name,
			args.location,
			args.website,
			args.email
		)).wait();

		console.log("Shelter added successfully");
	});
