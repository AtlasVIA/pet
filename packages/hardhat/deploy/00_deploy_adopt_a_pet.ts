import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

const deployAdoptAPet: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("AdoptAPet", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });
};

export default deployAdoptAPet;

deployAdoptAPet.tags = ["AdoptAPet"];

