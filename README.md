Cộng đồng săn Airdrop: https://t.me/OneLabs_Channels

Group chat: https://t.me/OneLabs_Home

Telegram: @stewie0x

**Script farm airdrop Pharos, bao gồm làm nhiệm vụ:**


✅ Faucet Token PHRS

✅ Gửi Token Đi Random Địa Chỉ Nào Đó

✅ Swap PHAROS -> USDT/USDC


## Cách chạy code

1. Thêm thông tin ví và proxy vào file config.ts

## Farm nhiều ví

Chỉnh sửa lại file app/config.ts

```
export const sleep = (millis: number) => {
  return new Promise((resolve) => setTimeout(resolve, millis));
};

export const wallets = [
  {
    address1: "0xYourWalletAddressHere",
    private1: "YourPrivateKeyHere",,
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

```

2. Cài đặt thư viện cần thiết

```
npm install
```

```
npm install -g typescript ts-node

```

3. Run code

## Faucet:

Faucet token PHAROS, phải liên kết ví với X với faucet được.

```
ts-node app/faucet.ts

```

## Send token

Sẽ send token PRAROS tới 1 ví ngẫu nhiên

```
ts-node app/transfer.ts

```

## Swap PHAROS -> USDC/USDT

```
ts-node app/swap.ts

```

Done!
