document.addEventListener("DOMContentLoaded", function () {
  let connected = false;

  const connectButton = document.getElementById("connect-button");
  connectButton.addEventListener("click", async function () {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    let userAddress = await signer.getAddress();
    console.log(userAddress);
  });
});
