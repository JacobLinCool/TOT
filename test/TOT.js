// This file test the contract and make sure the contract is working correctly.
const { expect } = require("chai");
const ipfs = require("../nft/ipfs.json");

describe("TOT Contract", () => {
    it("should have TOTAL_SUPPLY == 3000", async () => {
        const Contract = await ethers.getContractFactory("TOT");
        const contract = await Contract.deploy();
        const total = await contract.TOTAL_SUPPLY();
        console.log(total);
        expect(total).to.equal(3000);
    });

    it("should have same BASE_URL with ipfs.json", async () => {
        const Contract = await ethers.getContractFactory("TOT");
        const contract = await Contract.deploy();
        const base_url = await contract.BASE_URL();
        expect(base_url).to.equal("ipfs://" + ipfs.metas + "/");
    });

    it("should be able to show owner", async () => {
        const [owner] = await ethers.getSigners();
        const Contract = await ethers.getContractFactory("TOT");
        const contract = await Contract.deploy();

        expect(await contract.owner()).to.equal(owner.address);
    });

    it("should be able to mint", async () => {
        const [owner, other] = await ethers.getSigners();
        const Contract = await ethers.getContractFactory("TOT");
        const contract = await Contract.deploy();

        const owner_balance_before = await contract.getWallet(owner.address);
        expect(owner_balance_before.length).to.equal(0);
        await contract.connect(owner).mint(10);
        const owner_balance_after = await contract.getWallet(owner.address);
        expect(owner_balance_after.length).to.equal(10);

        const other_balance_before = await contract.getWallet(other.address);
        expect(other_balance_before.length).to.equal(0);
        await expect(contract.connect(other).mint(10, { value: BigInt(1e15) })).to.be.revertedWith(
            "Price of 10 TOT is 10000 szabos, only paid 1000",
        );
        const other_balance_after = await contract.getWallet(other.address);
        expect(other_balance_after.length).to.equal(0);
        await contract.connect(other).mint(10, { value: BigInt(1e16) });
        const other_balance_after2 = await contract.getWallet(other.address);
        expect(other_balance_after2.length).to.equal(10);
    });
});
