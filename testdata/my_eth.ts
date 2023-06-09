import myNFTs from "../NFTs/NFTs.tsx";
import {NFTConfigs} from "../types.d.ts";
import { moralisApiKey } from "../keys.ts"

const MORALIS_API_KEY = moralisApiKey;
//EVM
const EVM_WALLET_ADDRESS = '0x6829Bb547c3e4e077Dacd15a75aDF8fad38dDb93'
const EVM_CONTRACT_ADDRESS = '0x34d85c9CDeB23FA97cb08333b511ac86E1C4E258'
const TOKEN_ID = '98047'

const configs: NFTConfigs = {
    title: 'Otherdeed',
    author: 'Jimmy',
    apikey: MORALIS_API_KEY,
    // walletAddress: EVM_WALLET_ADDRESS,
    contractAddress: EVM_CONTRACT_ADDRESS,
    categoryType: 'image',
    chainType: 'ETH',
    // tokenID: TOKEN_ID,
    description: "Welcome to the home of MONKEY on OpenSea. Discover the best items in this collection.",
    coverTextColor:'white',
    avatar: "https://assets.otherside.xyz/otherdeeds/89561f877b88d4dc51bad965cf6a854970738d640e7910c4ca7bd11d75608a0e.jpg",
    avatarClass: "rounded-md",
    cover: 'https://assets.otherside.xyz/otherdeeds/62a17937dfc2e63d001599d85d1ad96c3cb86683b31dd6d9e12de55d96088b1c.jpg',
    links: [
        {title: "vecivedi@gmail.com", url: "mailto:vecivedi@gmail.com"},
        {title: "opensea", url: "https://opensea.io/collection/archive-of-peaceminusone-2016/drop"},
        {title: 'Binance NFT', url: 'https://www.binance.com/en/nft/home'}
    ]
}

myNFTs(configs);