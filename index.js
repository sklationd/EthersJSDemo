let provider = null;
let wallet = null;
let walletAddress = null;

const load = async function () {
  await loadProvider();
  await loadWallet();
};

const loadProvider = async function () {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
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

const refreshBalance = async function () {
  if (!provider || !walletAddress) {
    await load();
  }
  const balance = await provider.getBalance(walletAddress);
  const balanceDiv = document.getElementById("eth-balance");
  balanceDiv.innerText = balance / ethers.constants.WeiPerEther + " ETH";
};

const connectButton = document.getElementById("connect-button");
connectButton.addEventListener("click", load);
const refreshBalanceButton = document.getElementById("refresh-balance-button");
refreshBalanceButton.addEventListener("click", refreshBalance);

document.addEventListener("DOMContentLoaded", async function () {
  await load();
  await refreshBalance();
});
