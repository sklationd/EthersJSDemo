import { ERC20ABI } from "./abi/ERC20.js";
import { ERC721ABI } from "./abi/ERC721.js";
import { Address } from "./address/address.js";

export const updateView = async function (provider, network, currentAccount) {
  updateNetworkName(network);
  updateWalletAddress(currentAccount);
  updateConnectButton(currentAccount);
  updateCurrentETHBalance(provider, currentAccount);
  updateCurrentERC20Balance(provider, network, currentAccount, "weth");
  updateCurrentERC20Balance(provider, network, currentAccount, "fau");
  updateCurrentERC721List(provider, network, currentAccount, "soc");
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
      loadButton.innerText = "Not Connected";
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
      loadButton.innerText = "Not Connected";
    }
    const balanceDiv = document.getElementById(`${lowerCaseName}-balance`);
    balanceDiv.innerText = "Not Connected";
  }
}

async function updateCurrentERC721List(
  provider,
  network,
  currentAccount,
  ERC721Name
) {
  // ex) weth, fau
  let lowerCaseName = ERC721Name.toLowerCase();
  // ex) WETH, FAU
  let upperCaseName = ERC721Name.toUpperCase();

  if (
    currentAccount &&
    Address[network.name] &&
    Address[network.name][lowerCaseName]
  ) {
    const abi = ERC721ABI;
    const tokenAddress = Address[network.name][lowerCaseName];
    const tokenContract = new ethers.Contract(tokenAddress, abi, provider);
    let tokenCount = 0;
    try {
      tokenCount = await tokenContract.balanceOf(currentAccount);
    } catch (error) {
      console.log(
        error.message,
        `Failed to get ${upperCaseName} balance of ${currentAccount}`
      );
    }

    let root = document.getElementById("soc-grid");
    for (let i = 0; i < tokenCount; i++) {
      let tokenId = await tokenContract.tokenOfOwnerByIndex(currentAccount, i);
      let tokenURI = await tokenContract.tokenURI(tokenId);
      let node = await getNFTCardNode(tokenAddress, tokenId, tokenURI);
      root.appendChild(node);
    }
  } else {
    const loadButton = document.getElementById(
      `refresh-${lowerCaseName}-balance-button`
    );
    if (currentAccount === null) {
      loadButton.disabled = true;
      loadButton.innerText = "Not Connected";
    }
  }
}

function isIpfsURI(uri) {
  return uri.split("/")[0] === "ipfs:";
}

function getIpfsCID(uri) {
  let token = uri.split("/");
  return token[token.length - 1];
}

function getIpfsURL(CID) {
  return `https://ipfs.io/ipfs/${CID}`;
}

async function getNFTCardNode(tokenAddress, tokenId, tokenURI) {
  let url;
  if (isIpfsURI(tokenURI)) {
    url = getIpfsURL(getIpfsCID(tokenURI));
  } else {
    url = tokenURI;
  }
  let res = await fetch(url);
  let json = await res.json();

  let card = document.createElement("div");
  card.classList.add("card-view-grid-item");

  let title = document.createElement("div");
  title.innerText = json.name;

  let description = document.createElement("p");
  description.innerText = json.description;

  let linkToOpenSea = document.createElement("a");
  linkToOpenSea.innerText = "OpenSea Link";
  linkToOpenSea.href = `https://testnets.opensea.io/assets/${tokenAddress}/${tokenId}`;
  linkToOpenSea.target = "_blank";

  let img = document.createElement("img");
  img.classList.add("card-view-grid-item-img");
  img.src = json.image;
  img.alt = "nft image";

  card.appendChild(title);
  card.appendChild(description);
  card.appendChild(linkToOpenSea);
  card.appendChild(img);

  json.attributes.forEach((attribute) => {
    let attr = document.createElement("div");
    attr.classList.add("card-view-grid-item-attribute");
    let attr_type = document.createElement("div");
    attr.appendChild(attr_type);
    attr_type.innerText = `${attribute.trait_type}: `;
    let meter = document.createElement("meter");
    meter.classList.add("card-view-grid-item-attribute-gauge");
    meter.min = "0";
    meter.max = "100";
    meter.value = attribute.value;
    attr.appendChild(meter);
    card.appendChild(attr);
  });

  return card;
}
