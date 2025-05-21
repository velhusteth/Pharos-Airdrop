Author script: x.com/trangchongcheng

Group telegram về airdrop, blockchain: t.me/airdrop101xyz

Script farm airdrop Pharos, bao gồm làm nhiệm vụ:

1. Faucet token STT
2. Gửi
3. Swap PHAROS -> USDT/USDC

## Cách chạy code

Nếu chưa từng chạy code nodejs thì hãy xem video này trước để cài nodejs + vscode

[![Xem Video Hướng Dẫn](https://img.youtube.com/vi/YMwiiN557yg/0.jpg)](https://youtu.be/YMwiiN557yg)

1. Thêm thông tin ví và proxy vào file config.ts

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
