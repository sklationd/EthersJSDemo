export const registerHandler = function (provider, network, currentAccount) {
  registerConnectButtonHandler(provider);
};

const registerConnectButtonHandler = function () {
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
