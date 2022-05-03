let provider = null;
let signer = null;
let wallet = null;

const load = async function () {
  // METAMASK
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    wallet = await signer.getAddress();
    console.log("load provider, signer, wallet doen");
  } else {
    alert("Please install metamask");
  }
};

const refreshBalance = async function () {
  if (!provider || !wallet) {
    await load();
  }
  const balance = await provider.getBalance(wallet);
  const balanceDiv = document.getElementById("eth-balance");
  balanceDiv.innerText = balance / ethers.constants.WeiPerEther + " ETH";
  console.log("Refresh Clicked");
};

const connectButton = document.getElementById("connect-button");
connectButton.addEventListener("click", load);
const refreshBalanceButton = document.getElementById("refresh-balance-button");
refreshBalanceButton.addEventListener("click", refreshBalance);

document.addEventListener("DOMContentLoaded", async function () {
  await load();
  await refreshBalance();
});
