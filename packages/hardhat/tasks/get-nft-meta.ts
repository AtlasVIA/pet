import { task } from "hardhat/config";

task("get-nft-meta", "Metadata")
    .addParam("nftId", "")
	.addOptionalParam("signer", "Custom signer (private key)")
	.addOptionalParam("provider", "Custom provider RPC url")
	.setAction(async (args, hre:any) => {
		const ethers = hre.ethers;
		const [deployer] = await ethers.getSigners();

		let signer = deployer;
		if (args.signer) signer = new ethers.Wallet(args.signer, new ethers.providers.JsonRpcProvider(args.provider));
		

		const petNFT = await ethers.getContract("AdoptAPet");
		const metadata = await petNFT.tokenURI(args.nftId);

		console.log(metadata);
	});
