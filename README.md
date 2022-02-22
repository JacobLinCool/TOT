# TOT

Test Only Token. NFT Example.

Follow the instructions below to:

1. Generate NFTs
2. Store NFTs on IPFS
3. Write Smart Contract
4. Test Smart Contract
5. Deploy Smart Contract

## Setup

### 1. Install Node.js 16+

Using NVM is recommended.

### 2. Install PNPM (Optional)

```bash
npm install -g pnpm
```

### 3. Install Packages

```bash
pnpm i
```

> Note:
>
> For NPM users, use `npm i` instead of `pnpm i`.
>
> For Yarn users, use `yarn`.

## Build & Store NFTs

### 1. Build NFT

This command will run code in `src/build`, which will generate the NFTs' meta and asset, then store them in the `nft` directory.

```bash
pnpm nft:build
```

> If the output dir is already exists, it will fail. You may want to remove the output dir first.

### 2. Store NFT

This command will call [`nft.storage`](https://nft.storage/) API to store (and pin) the NFTs on IPFS.

```bash
pnpm nft:store
```

Before you use it, you should make sure that you already have a [`nft.storage`](https://nft.storage/) account, and the API key has been pasted in the `.env` file.

**The process may take a few minutes to complete.**

After the process is done, you can find the CIDs in `nft/ipfs.json` or on <https://nft.storage/>.

## Compile, Test & Deploy Contract

The source code of the contract is in `contracts/TOT.sol`.

We use `hardhat` to compile the contract, test it, and deploy it to the Ethereum testnet.

### 1. Compile Contract

You can edit the contract in `contracts/TOT.sol`, configurations like `TOKEN_COST` can be found there.

```bash
pnpm compile
```

### 2. Test Contract

```bash
pnpm test
```

### 3. Deploy Contract

We use [alchemy](https://www.alchemy.com/) to deploy the contract. You have to sign up a free account to get the API key, and paste it in the `.env` file.

Also, the deployment needs your private key to sign the transaction. You should also paste it in the `.env` file.

**Be carseful! Your private key is a very very important secret. Please make sure you have it safely stored.**

```bash
pnpm deploy
```

Congratulations! You can interact with the contract on chain now!
