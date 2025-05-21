import { utils } from "web3";
import { wallets } from "./config";
const { Web3 } = require("web3");

const web3 = new Web3("https://testnet.dplabs-internal.com");

async function sendRandomNativeToken() {
  for (let i = 0; i < wallets.length; i++) {
    const { address1, private1 } = wallets[i];
    const account = web3.eth.accounts.create();
    const to = account.address;
    const amount = web3.utils.toWei(
      (0.01 + Math.random() * (0.1 - 0.01)).toFixed(3),
      "ether"
    );

    const tx = {
      from: address1,
      to,
      value: amount,
      gasLimit: 21000n,
      gasPrice: await web3.eth.getGasPrice(),
    };

    try {
      console.log(`${i + 1}.Đang transfer ${utils.fromWei(amount, "ether")}`);
      const signedTx = await web3.eth.accounts.signTransaction(tx, private1);
      const receipt = await web3.eth.sendSignedTransaction(
        signedTx.rawTransaction
      );
      console.log(`Transfer thành công, tx: ${receipt.transactionHash}`);
    } catch (error) {
      console.error(`Lỗi khi gửi giao dịch ${i + 1}:`, error);
    }
    console.log("Đợi làm ví tiếp theo \n\n");
    await new Promise((resolve) =>
      setTimeout(resolve, 5000 + Math.random() * 2000)
    );
  }
  console.log("HOÀN THÀNH TRANSFER TOKEN, CHẠY LẠI NẾU MUỐN\n\n");
}

sendRandomNativeToken().catch(console.error);
