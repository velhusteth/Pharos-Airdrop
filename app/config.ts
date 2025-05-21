export const sleep = (millis: number) => {
  return new Promise((resolve) => setTimeout(resolve, millis));
};

export const wallets = [
  {
    address1: "0xCA2f0C5aEf4Df89a90DCb52561B5c7BbFF01A817",
    private1:
      "Paste Private key vao day",
    proxy: "", // bỏ trống nếu không có proxy
  },
  {
    address1: "0xA3E9fbfF456273A760976f369E7e31D3BA533333",
    private1:
      "e7be2bf487fc2c1c49fda12de803d222861a01abd9e8305b156713d53adb6713",
    proxy: "http://username:passs@host:port", // thêm proxy nếu có
  },
];
