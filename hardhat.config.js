require("dotenv").config();
require("@nomiclabs/hardhat-waffle");

/**
 * @type import("hardhat/config").HardhatUserConfig
 */
module.exports = {
    solidity: "0.8.12",
    networks: {
        rinkeby: {
            url: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
            accounts: [process.env.OWNER_PRIVATE_KEY],
        },
    },
};
