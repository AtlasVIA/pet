import { task } from "hardhat/config";

task("remove-shelter-manager", "Remove Shelter Manager")
	.addParam("shelterId", "Shelter ID")
	.addParam("owner", "Owner address")
	.addOptionalParam("signer", "Custom signer (private key)")
	.addOptionalParam("provider", "Custom provider RPC url")
	.setAction(async (args, hre:any) => {
		const ethers = hre.ethers;
		const [deployer] = await ethers.getSigners();

		let signer = deployer;
		if (args.signer) signer = new ethers.Wallet(args.signer, new ethers.providers.JsonRpcProvider(args.provider));
		
		const petNFT = await ethers.getContract("AdoptAPet");

		await (await petNFT.removeShelterManager(
			args.shelterId,
			args.manager
		)).wait();

		console.log("Shelter manager removed successfully");
	});
