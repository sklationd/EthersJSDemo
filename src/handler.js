import { ERC20ABI } from "./abi/ERC20.js";
import { Address } from "./address/address.js";
export const registerHandler = function (provider, network, currentAccount) {
  registerConnectButtonHandler(provider);
  registerETHRefreshHandler(provider, currentAccount);
  registerERC20RefreshHandler(provider, network, currentAccount, "WETH");
  registerERC20RefreshHandler(provider, network, currentAccount, "FAU");
};

const registerConnectButtonHandler = function (provider) {
  const connectButton = document.getElementById("connect-button");
  connectButton.addEventListener("click", async function () {
    try {
      await provider.send("eth_requestAccounts", []);
    } catch (e) {
      console.log("CATCH!");
      console.error(e);
    }
  });
};

const registerETHRefreshHandler = function (provider, currentAccount) {
  const loadButton = document.getElementById(`refresh-eth-balance-button`);
  loadButton.addEventListener("click", async function () {
    console.log("Update ETH Balance");
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
  });
};

const registerERC20RefreshHandler = function (
  provider,
  network,
  currentAccount,
  ERC20Name
) {
  let lowerCaseName = ERC20Name.toLowerCase();
  let upperCaseName = ERC20Name.toUpperCase();
  const loadButton = document.getElementById(
    `refresh-${lowerCaseName}-balance-button`
  );
  loadButton.addEventListener("click", async function () {
    console.log(`Update ${upperCaseName} Balance`);
    const abi = ERC20ABI;
    const tokenAddress = Address[network.name][lowerCaseName]; // TODO check chainId and network name
    const tokenContract = new ethers.Contract(tokenAddress, abi, provider);
    let balance = 0;
    try {
      balance = await tokenContract.balanceOf(currentAccount);
    } catch (error) {
      console.log(
        error.message,
        `Failed to get ${upperCaseName} balance of ${currentAccount}`
      );
    }
    const balanceDiv = document.getElementById(`${lowerCaseName}-balance`);
    balanceDiv.innerText = `${parseFloat(
      balance / ethers.constants.WeiPerEther
    ).toFixed(4)} ${upperCaseName}`;
  });
};
