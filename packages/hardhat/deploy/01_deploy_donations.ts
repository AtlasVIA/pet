import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";
import { contractAddresses, Chain } from "../../nextjs/utils/scaffold-eth/chains";

const deployDonations: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Get the current network
  const network = await hre.ethers.provider.getNetwork();
  const chainId = network.chainId;
  
  // Get the USDC address for the current network
  const usdcAddress = contractAddresses[chainId as Chain]?.usdc;
  const protoCCTPaddress = contractAddresses[chainId as Chain]?.protocctp;

  if (!usdcAddress) {
    console.warn(`No USDC address found for chain ID ${chainId}. Using a dummy address.`);
  }

  await deploy("Donations", {
    from: deployer,
    args: [
      "0xDFeE3b001cD13E06D5c7A28597763E46AcFE32D9", // AAP-TREASURY
      84532, // TODO: hardcoded to base testnet for now .. this is where we want the USDC to end up
      usdcAddress || "0x0000000000000000000000000000000000000000", // Use USDC address or zero address if not found
      protoCCTPaddress || "0x0000000000000000000000000000000000000000", // protoCCTPGateway address
    ],
    log: true,
    autoMine: true,
  });
};

export default deployDonations;

deployDonations.tags = ["Donations"];
