import { task } from "hardhat/config";

task("add-pet", "Add Pet")
  .addParam("name", "Pet name")
  .addParam("image", "Pet image")
  .addParam("personality", "Pet personality")
  .addParam("shelterId", "Shelter ID")
  .addOptionalParam("signer", "Custom signer (private key)")
  .addOptionalParam("provider", "Custom provider RPC url")
  .setAction(async (args, hre: any) => {
    const ethers = hre.ethers;

    const petNFT = await ethers.getContract("AdoptAPet");

    await (await petNFT.addPet(args.shelterId, args.name, args.image, args.personality)).wait();

    console.log("Pet added successfully");
  });
