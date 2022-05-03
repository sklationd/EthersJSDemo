import { ERC20ABI } from "./abi/ERC20.js";
import { Address } from "./address/address.js";

export const updateView = async function (provider, network, currentAccount) {
  updateNetworkName(network);
  updateWalletAddress(currentAccount);
  updateCurrentETHBalance(provider, currentAccount);
  updateCurrentWETHBalance(provider, network, currentAccount);
};

function updateNetworkName(network) {
  // Network Name
  const currentNetwork = document.getElementById("current-network");
  currentNetwork.innerText = "Current Network: " + network.name;
}

function updateWalletAddress(currentAccount) {
  // Wallet Address
  const currentWalletAddress = document.getElementById(
    "current-wallet-address"
  );
  currentWalletAddress.innerText =
    "Current Wallet Address: " +
    (currentAccount ? currentAccount : "Not Connected");
}

async function updateCurrentETHBalance(provider, currentAccount) {
  if (currentAccount) {
    let balance = 0;
    try {
      balance = await provider.getBalance(currentAccount);
    } catch (error) {
      console.log(
        error.message,
        `Failed to get ETH balance of ${currentAccount}`
      );
    }
    const balanceDiv = document.getElementById("eth-balance");
    balanceDiv.innerText =
      parseFloat(balance / ethers.constants.WeiPerEther).toFixed(4) + " ETH";
  } else {
    const balanceDiv = document.getElementById("eth-balance");
    balanceDiv.innerText = "NOT CONNECTED";
  }
}

async function updateCurrentWETHBalance(provider, network, currentAccount) {
  if (currentAccount && Address[network.name]) {
    const abi = ERC20ABI;
    const tokenAddress = Address[network.name].weth; // TODO check chainId and network name
    const tokenContract = new ethers.Contract(tokenAddress, abi, provider);
    let balance = 0;
    try {
      balance = await tokenContract.balanceOf(currentAccount);
    } catch (error) {
      console.log(
        error.message,
        `Failed to get WETH balance of ${currentAccount}`
      );
    }
    const balanceDiv = document.getElementById("weth-balance");
    balanceDiv.innerText =
      parseFloat(balance / ethers.constants.WeiPerEther).toFixed(4) + " WETH";
  } else {
    const balanceDiv = document.getElementById("weth-balance");
    balanceDiv.innerText = "NOT CONNECTED";
  }
}
