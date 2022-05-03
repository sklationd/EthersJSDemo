import { updateView } from "./updateView.js";
import { registerHandler } from "./handler.js";

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

  updateView(provider, network, currentAccount);
  registerHandler(provider, network, currentAccount);
}
