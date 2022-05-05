import { ERC20ABI } from "./abi/ERC20.js";
import { Address } from "./address/address.js";

export const updateView = async function (provider, network, currentAccount) {
  updateNetworkName(network);
  updateWalletAddress(currentAccount);
  updateConnectButton(currentAccount);
  updateCurrentETHBalance(provider, currentAccount);
  updateCurrentERC20Balance(provider, network, currentAccount, "weth");
  updateCurrentERC20Balance(provider, network, currentAccount, "fau");
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

function updateConnectButton(currentAccount) {
  const connectButton = document.getElementById("connect-button");
  if (currentAccount) {
    connectButton.disabled = true;
    connectButton.innerText = "Connected";
  }
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
    const loadButton = document.getElementById("refresh-eth-balance-button");
    if (currentAccount === null) {
      loadButton.disabled = true;
      connectButton.innerText = "Not Connected";
    }
    const balanceDiv = document.getElementById("eth-balance");
    balanceDiv.innerText = "Not Connected";
  }
}

async function updateCurrentERC20Balance(
  provider,
  network,
  currentAccount,
  ERC20Name
) {
  // ex) weth, fau
  let lowerCaseName = ERC20Name.toLowerCase();
  // ex) WETH, FAU
  let upperCaseName = ERC20Name.toUpperCase();

  if (
    currentAccount &&
    Address[network.name] &&
    Address[network.name][lowerCaseName]
  ) {
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
  } else {
    const loadButton = document.getElementById(
      `refresh-${lowerCaseName}-balance-button`
    );
    if (currentAccount === null) {
      loadButton.disabled = true;
      connectButton.innerText = "Not Connected";
    }
    const balanceDiv = document.getElementById(`${lowerCaseName}-balance`);
    balanceDiv.innerText = "Not Connected";
  }
}
