import { sleep, wallets } from "./config";

const { Web3 } = require("web3");
const web3 = new Web3("https://testnet.dplabs-internal.com");
const SWAP_CONTRACT = "0x1a4de519154ae51200b0ad7c90f7fac75547888a";
const PHAROS_TOKEN = "0x76aaada469d23216be5f7c596fa25f282ff9b364";
const SWAP_ABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "collectionAndSelfcalls",
        type: "uint256",
      },
      {
        internalType: "bytes[]",
        name: "data",
        type: "bytes[]",
      },
    ],
    name: "multicall",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const ERC20_ABI = [
  {
    constant: false,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
];

const TOKENS = [
  {
    tokenName: "USDT",
    ctr_address: "0xed59de2d7ad9c043442e381231ee3646fc3c2939",
  },
  {
    tokenName: "USDC",
    ctr_address: "0xAD902CF99C2dE2f1Ba5ec4D642Fd7E49cae9EE37",
  },
];

function randomNumber() {
  //Random swap tối thiêu 0.001 $PHRS, tối đa 0.005 $PHRS
  const min = 0.001;
  const max = 0.005;
  const randomNum = min + Math.random() * (max - min);
  return Number(randomNum.toFixed(3));
}

function randomToken() {
  return TOKENS[Math.floor(Math.random() * TOKENS.length)];
}

async function approveToken(
  tokenAddress: string,
  spender: string,
  amount: string,
  privateKey: string,
  fromAddress: string
) {
  try {
    const tokenContract = new web3.eth.Contract(ERC20_ABI, tokenAddress);
    
    // Ensure private key is in correct format (remove 0x if present)
    const formattedPrivateKey = privateKey.startsWith('0x') ? privateKey.slice(2) : privateKey;
    
    const approveData = tokenContract.methods.approve(spender, amount).encodeABI();
    
    const gasPrice = await web3.eth.getGasPrice();
    const gasEstimate = await web3.eth.estimateGas({
      from: fromAddress,
      to: tokenAddress,
      data: approveData,
    });

    const tx = {
      from: fromAddress,
      to: tokenAddress,
      data: approveData,
      gas: BigInt(Math.floor(Number(gasEstimate) * 1.2)),
      gasPrice: BigInt(Math.floor(Number(gasPrice) * 1.2)),
      nonce: await web3.eth.getTransactionCount(fromAddress),
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, formattedPrivateKey);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    return receipt;
  } catch (error) {
    console.log("Error in approveToken:", error);
    throw error;
  }
}

async function performSwap(
  contract: any,
  fromToken: string,
  toToken: string,
  value: string,
  address: string,
  privateKey: string
) {
  try {
    // Approve tokens before swap
    await approveToken(fromToken, SWAP_CONTRACT, value, privateKey, address);
    
    const exactInputSingleData = web3.eth.abi.encodeFunctionCall(
      {
        name: "exactInputSingle",
        type: "function",
        inputs: [
          {
            type: "tuple",
            name: "params",
            components: [
              { name: "tokenIn", type: "address" },
              { name: "tokenOut", type: "address" },
              { name: "fee", type: "uint24" },
              { name: "recipient", type: "address" },
              { name: "amountIn", type: "uint256" },
              { name: "amountOutMinimum", type: "uint256" },
              { name: "sqrtPriceLimitX96", type: "uint160" },
            ],
          },
        ],
      },
      [
        {
          tokenIn: fromToken,
          tokenOut: toToken,
          fee: "500",
          recipient: address,
          amountIn: value,
          amountOutMinimum: "100000",
          sqrtPriceLimitX96: "0",
        },
      ]
    );

    const timestamp = Math.floor(Date.now() / 1000) + 60 * 20;
    const bytes = [exactInputSingleData];
    return contract.methods.multicall(timestamp, bytes).encodeABI();
  } catch (error) {
    console.log("Error in performSwap:", error);
    throw error;
  }
}

async function claim() {
  // Use only the first wallet
  const { address1, private1 } = wallets[0];
  console.log(`Using wallet: 0x...${address1.slice(-4)}`);
  
  while (true) {
    try {
      const contract = new web3.eth.Contract(SWAP_ABI, SWAP_CONTRACT);
      const _value = randomNumber();
      const { tokenName, ctr_address } = randomToken();
      const value = web3.utils.toWei(_value, "ether");

      // First swap: PHAROS -> USDC/USDT
      console.log(`\nSwapping ${_value} PHAROS to ${tokenName}...`);
      const firstSwapData = await performSwap(
        contract,
        PHAROS_TOKEN,
        ctr_address,
        value,
        address1,
        private1
      );

      const gasPriceSupply = await web3.eth.getGasPrice();
      const gasEstimate = await web3.eth.estimateGas({
        from: address1,
        to: SWAP_CONTRACT,
        data: firstSwapData,
        value,
      });

      const firstSwapPayload = {
        from: address1,
        to: SWAP_CONTRACT,
        data: firstSwapData,
        value,
        gasLimit: BigInt(Math.floor(Number(gasEstimate) * 2)),
        gasPrice: BigInt(Math.floor(Number(gasPriceSupply) * 2)),
        nonce: await web3.eth.getTransactionCount(address1),
      };

      const firstSwapTx = await web3.eth.accounts.signTransaction(
        firstSwapPayload,
        private1
      );
      const firstSwapHash = await web3.eth.sendSignedTransaction(
        firstSwapTx.rawTransaction
      );
      console.log(
        `First swap successful tx: 0x...${firstSwapHash.transactionHash.slice(-8)}`
      );

      // Wait for a random time between swaps
      await sleep(Math.floor(Math.random() * (10000 - 5000) + 5000));

      // Second swap: USDC/USDT -> PHAROS
      console.log(`Swapping back ${tokenName} to PHAROS...`);
      const secondSwapData = await performSwap(
        contract,
        ctr_address,
        PHAROS_TOKEN,
        value,
        address1,
        private1
      );

      const secondGasEstimate = await web3.eth.estimateGas({
        from: address1,
        to: SWAP_CONTRACT,
        data: secondSwapData,
        value: "0", // No value needed for second swap
      });

      const secondSwapPayload = {
        from: address1,
        to: SWAP_CONTRACT,
        data: secondSwapData,
        value: "0",
        gasLimit: BigInt(Math.floor(Number(secondGasEstimate) * 2)),
        gasPrice: BigInt(Math.floor(Number(gasPriceSupply) * 2)),
        nonce: await web3.eth.getTransactionCount(address1),
      };

      const secondSwapTx = await web3.eth.accounts.signTransaction(
        secondSwapPayload,
        private1
      );
      const secondSwapHash = await web3.eth.sendSignedTransaction(
        secondSwapTx.rawTransaction
      );
      console.log(
        `Second swap successful tx: 0x...${secondSwapHash.transactionHash.slice(-8)}`
      );
      console.log("Completed one back-and-forth swap cycle\n");
      
      // Wait before starting next cycle
      await sleep(Math.floor(Math.random() * (10000 - 5000) + 5000));
    } catch (error) {
      console.log("Error occurred:", error);
      // Wait a bit longer after an error before retrying
      await sleep(15000);
    }
  }
}

claim();
