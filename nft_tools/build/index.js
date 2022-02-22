// this script will generate NFTs (meta + asset) basing on a "Base SVG"
// Copyright (c) 2022 JacobLinCool, MIT License
const fs = require("node:fs");
const path = require("node:path");
const { generate_attributes, inject, text_shadow } = require("./generator");

const NUMBER_OF_NFT = 3000;
const BASE_URL = "https://nft-svelte.pages.dev/nft/";
const BASE_SVG_PATH = path.resolve("nft_tools", "base.svg");
const DEST_PATH = path.resolve("nft");

ensure_dirs();

const base_svg = fs.readFileSync(BASE_SVG_PATH, "utf8");

for (let i = 1; i <= NUMBER_OF_NFT; i++) {
    const attributes = generate_attributes();

    const asset = inject(base_svg, {
        n: i.toString(),
        background:
            "#" +
            [attributes.red[0], attributes.green[0], attributes.blue[0]]
                .map((n) => n.toString(16).padStart(2, "0"))
                .join(""),
        text_shadow: text_shadow(attributes.shadows[0]),
        text_decoration: attributes.deleted[0] ? "text-decoration: line-through;" : "",
        font_weight: attributes.bold[0] ? "font-weight: bold;" : "",
    });

    const meta = {
        name: "TOT #" + i,
        description: `A ${attributes.deleted[0] ? "dead" : "living"} TOT with ${attributes.shadows[0]} special skills.`,
        image: `${BASE_URL}${i}.svg`,
        attributes: Object.entries(attributes).map(([key, [value, max]]) => ({
            trait_type: key,
            value,
            max_value: max,
        })),
    };

    fs.writeFileSync(path.resolve(DEST_PATH, "asset", `${i}.svg`), asset);
    fs.writeFileSync(path.resolve(DEST_PATH, "meta", `${i}.json`), JSON.stringify(meta));
}

console.log("Built", NUMBER_OF_NFT, "NFTs");

function ensure_dirs() {
    if (fs.existsSync(DEST_PATH)) {
        process.stderr.write(`!!! ERROR: DEST_PATH folder already exists.\n${DEST_PATH}\n`);
        process.exit(1);
    }
    fs.mkdirSync(path.resolve(DEST_PATH, "meta"), { recursive: true });
    fs.mkdirSync(path.resolve(DEST_PATH, "asset"), { recursive: true });
}
