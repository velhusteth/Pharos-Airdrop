import axios from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";
import { sleep, wallets } from "./config";
const { Web3 } = require("web3");
const web3 = new Web3("https://rpc.ankr.com/eth");

const normalizePrivateKey = (privateKey: string) => {
  return privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`;
};

async function check() {
  for (let index = 0; index < wallets.length; index++) {
    const { address1, private1, proxy } = wallets[index];
    const axiosInstance = axios.create(
      proxy ? { httpsAgent: new HttpsProxyAgent(proxy) } : {}
    );
    const payload = {
      message: `pharos`,
      address: address1,
    };

    const { signature } = web3.eth.accounts.sign(
      payload.message,
      normalizePrivateKey(private1)
    );

    await sleep(2000);
    await getIp(axiosInstance);
    try {
      const { data } = await axiosInstance.post(
        `https://api.pharosnetwork.xyz/user/login?address=${address1}&signature=${signature}`,
        null,
        {
          headers: {
            referer: "https://testnet.pharosnetwork.xyz/",
            authorization: "Bearer null",
            "content-length": 0,
          },
        }
      );
      await sleep(3000);
      const {
        data: { jwt },
      } = data;
      const { data: data2 } = await axiosInstance.post(
        `https://api.pharosnetwork.xyz/faucet/daily?address=${address1}`,
        null,
        {
          headers: {
            authorization: `Bearer ${jwt}`,
            referer: "https://testnet.pharosnetwork.xyz/",
          },
        }
      );
      const { code, msg } = data2;
      if (code == 0) {
        console.log(index + 1, "- Faucet thành công - ", msg, "\n");
      } else {
        console.log(index + 1, "- Faucet lỗi hoặc đã faucet - ", msg, "\n");
      }
    } catch (error: any) {
      console.log("Error", proxy, error?.message);
    }
  }
}

async function getIp(axiosInstance: any) {
  try {
    const response = await axiosInstance.get(
      "https://api64.ipify.org?format=json"
    );
    console.log("Địa chỉ IP hiện tại:", response.data.ip);
    return response.data.ip;
  } catch (error: any) {
    console.error("Lỗi khi lấy địa chỉ IP:", error.message);
  }
}
check();
