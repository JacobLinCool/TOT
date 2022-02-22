// this script will store NFTs (meta + asset) on IPFS through nft.storage
// Copyright (c) 2022 JacobLinCool, MIT License
const fs = require("node:fs");
const path = require("node:path");
const { config } = require("dotenv");
const { NFTStorage, File } = require("nft.storage");

config();
main();

async function main() {
    const storage = new NFTStorage({ token: process.env.NFT_STORAGE_KEY });

    const dest = path.resolve("nft");
    const list = fs.readdirSync(path.resolve(dest, "asset")).filter((file) => file.endsWith(".svg"));

    const images = [];
    for (let i = 0; i < list.length; i++) {
        const image_path = path.resolve(dest, "asset", list[i]);
        const image = new File([fs.readFileSync(image_path)], path.basename(image_path), { type: "image/svg+xml" });
        images.push(image);
    }

    console.log("Uploading", images.length, "images");
    const images_cid = await storage.storeDirectory(images);
    console.log("Stored", images.length, "images in", images_cid);

    const metas = [];
    for (let i = 0; i < list.length; i++) {
        const meta_path = path.resolve(dest, "meta", list[i].replace(".svg", ".json"));
        const meta = JSON.parse(fs.readFileSync(meta_path, "utf8"));
        meta.image = `ipfs://${images_cid}/${list[i]}`;
        metas.push(new File([JSON.stringify(meta)], path.basename(meta_path), { type: "application/json" }));
    }

    console.log("Uploading", metas.length, "metas");
    const metas_cid = await storage.storeDirectory(metas);
    console.log("Stored", metas.length, "metas in", metas_cid);

    fs.writeFileSync(path.resolve(dest, "ipfs.json"), JSON.stringify({ images: images_cid, metas: metas_cid }));
}
