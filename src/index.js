import { ERC20ABI } from "./abi/ERC20.js";
import { Address } from "./address/address.js";

const metamaskProvider = await detectEthereumProvider();

if (metamaskProvider) {
  startApp(metamaskProvider); // Initialize your app
} else {
  alert("Please install MetaMask!");
}

async function startApp(metamaskProvider) {
  if (metamaskProvider !== window.ethereum) {
    console.error("Do you have multiple wallets installed?");
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  ///// GET CURRENT NETWORK /////
  const network = await provider.getNetwork();
  ethereum.on("chainChanged", handleChainChanged);
  function handleChainChanged() {
    window.location.reload();
  }

  ///// GET CURRENT ACCOUNT /////
  let accountList = await provider.listAccounts();
  let currentAccount = accountList.length > 0 ? accountList[0] : null;

  ethereum.on("accountsChanged", handleAccountsChanged);

  async function connect() {
    try {
      await provider.send("eth_requestAccounts", []);
    } catch (e) {
      console.log("CATCH!");
      console.error(e);
    }
  }

  function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      // TODO REQUEST: MetaMask is locked or the user has not connected any accounts
      console.log("Please unlock/connect to MetaMask.");
    } else if (accounts[0] !== currentAccount) {
      currentAccount = accounts[0];
      console.log("Connected to: ", currentAccount);
      // window.location.reload();
    }
    window.location.reload();
  }

  ///// UPDATE VIEW /////

  // Network Name
  const currentNetwork = document.getElementById("current-network");
  currentNetwork.innerText = "Current Network: " + network.name;

  // Wallet Address
  const currentWalletAddress = document.getElementById(
    "current-wallet-address"
  );
  currentWalletAddress.innerText =
    "Current Wallet Address: " +
    (currentAccount ? currentAccount : "Not Connected");

  const connectButton = document.getElementById("connect-button");
  connectButton.addEventListener("click", connect);

  if (currentAccount) {
    const balance = await provider.getBalance(currentAccount);
    const balanceDiv = document.getElementById("eth-balance");
    balanceDiv.innerText =
      parseFloat(balance / ethers.constants.WeiPerEther).toFixed(4) + " ETH";
  } else {
    const balanceDiv = document.getElementById("eth-balance");
    balanceDiv.innerText = "NOT CONNECTED";
  }

  if (currentAccount && Address[network.name]) {
    const abi = ERC20ABI;
    const tokenAddress = Address[network.name].weth; // TODO check chainId and network name
    const tokenContract = new ethers.Contract(tokenAddress, abi, provider);
    const balance = await tokenContract.balanceOf(currentAccount);
    const balanceDiv = document.getElementById("weth-balance");
    balanceDiv.innerText =
      parseFloat(balance / ethers.constants.WeiPerEther).toFixed(4) + " WETH";
  } else {
    const balanceDiv = document.getElementById("weth-balance");
    balanceDiv.innerText = "NOT CONNECTED";
  }
}
