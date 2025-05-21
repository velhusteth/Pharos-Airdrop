export const sleep = (millis: number) => {
  return new Promise((resolve) => setTimeout(resolve, millis));
};

export const wallets = [
  {
    address1: "0xYourWalletAddressHere",
    private1:
      "Paste Private key vao day",
    proxy: "", // bỏ trống nếu không có proxy
  },
{
    address1: "0xYourWalletAddressHere",
    private1: "YourPrivateKeyHere",
    proxy: "", // bỏ trống nếu không có proxy
  },
  {
    address1: "0xAnotherWalletAddressHere",
    private1: "AnotherPrivateKeyHere",
    proxy: "", // bỏ trống nếu không có proxy
  },
];
