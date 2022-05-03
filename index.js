import { ERC20ABI } from "./abi/ERC20.js";
import { Address } from "./address/address.js";

let provider = null;
let wallet = null;
let walletAddress = null;

const load = async function () {
  await loadProvider();
  await loadWallet();
};

const loadProvider = async function () {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
  } else {
    alert("Please install metamask");
  }
};

const loadWallet = async function () {
  if (provider) {
    wallet = provider.getSigner();
    walletAddress = await wallet.getAddress();
  }
};

const refreshNetworkName = async function () {
  const network = await provider.getNetwork();
  const currentNetwork = document.getElementById("current-network");
  currentNetwork.innerText = "Current Network: " + network.name;
};

const refreshETHBalance = async function () {
  if (!provider || !walletAddress) {
    await load();
  }
  const balance = await provider.getBalance(walletAddress);
  const balanceDiv = document.getElementById("eth-balance");
  balanceDiv.innerText = balance / ethers.constants.WeiPerEther + " ETH";
};

const refreshWETHBalance = async function () {
  if (!provider || !walletAddress) {
    await load();
  }

  const abi = ERC20ABI;
  const tokenAddress = Address.rinkeby.weth; // TODO check chainId and network name
  const tokenContract = new ethers.Contract(tokenAddress, abi, provider);
  const balance = await tokenContract.balanceOf(walletAddress);
  const balanceDiv = document.getElementById("weth-balance");
  balanceDiv.innerText = balance / ethers.constants.WeiPerEther + " WETH";
};

const connectButton = document.getElementById("connect-button");
connectButton.addEventListener("click", load);

const refreshETHBalanceButton = document.getElementById(
  "refresh-eth-balance-button"
);
refreshETHBalanceButton.addEventListener("click", refreshETHBalance);

const refreshWETHBalanceButton = document.getElementById(
  "refresh-weth-balance-button"
);
refreshWETHBalanceButton.addEventListener("click", refreshWETHBalance);

document.addEventListener("DOMContentLoaded", async function () {
  await load();
  await refreshNetworkName();
  await refreshETHBalance();
  await refreshWETHBalance();
});
