import { task } from "hardhat/config";

task("add-pet", "")
	.addOptionalParam("signer", "Custom signer (private key)")
	.addOptionalParam("provider", "Custom provider RPC url")
	.setAction(async (args, hre:any) => {
		const ethers = hre.ethers;
		const [deployer] = await ethers.getSigners();

		let signer = deployer;
		if (args.signer) signer = new ethers.Wallet(args.signer, new ethers.providers.JsonRpcProvider(args.provider));
		

		const petNFT = await ethers.getContract("PetNFT");

		await (await petNFT.addShelter(
			
		)).wait();
		
		
		function addShelter(uint _nftId, string memory _name, string memory _location, string memory _website, string memory _email, string memory _phone) external onlyOwner {

	});
