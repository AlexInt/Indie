import { NFTMetaData, CollectionsMeta } from "./blockchain.d.ts";
import { ChainType } from '../../types.d.ts'
import IPFS from './IPFS.ts'


export default class EVM {
    private url: URL;
    private readonly headers: HeadersInit
    private readonly chain: string

    constructor(apiKey: string, chain: ChainType = 'ETH') {
        this.url = new URL('https://deep-index.moralis.io')
        // this.url = new URL('https://deep-index-moralis-io.paiyaapp.com');
        this.chain = chain.toLowerCase()
        this.url.searchParams.set('chain', this.chain);
        this.headers = {
            accept: 'application/json',
            'X-API-Key': apiKey
        }
    }

    private async fetchNFT(): Promise<any> {
        const res = await fetch(this.url.toString(), {
            headers: this.headers
        })
        const metaJson = await res.json();
        return Promise.resolve(metaJson)
    }

    public async getNFTMetadata(address: string, token_id: string): Promise<NFTMetaData> {
        // console.log(address, token_id)
        this.url.pathname = `/api/v2/nft/${address}/${token_id}`
        this.url.searchParams.set('format', 'decimal');
        this.url.searchParams.set('media_items', 'false')

        const nftData = await this.fetchNFT()
        // console.log('nftData',nftData)
        const nftMeta: NFTMetaData = {
            name: nftData.name,
            owner_of: nftData.owner_of,
            contractAddress: nftData.token_address,
            token_id: nftData.token_id,
            contract_type: nftData.contract_type,
        }
        if (nftData.metadata) {
            const metaJson = JSON.parse(nftData.metadata)
            // console.log(metaJson)
            nftMeta.image = IPFS.ipfs2https(metaJson.image)
            nftMeta.name = metaJson.name;
            nftMeta.description = metaJson.description;
            nftMeta.category_type = metaJson.properties?.category;


            if (metaJson.properties?.category === 'video') {
                nftMeta.video = IPFS.ipfs2https(metaJson.properties?.files[0])
            }
        }


        return Promise.resolve(nftMeta);
    }

    public async getNFTByContract(address: string, token_id?: string): Promise<NFTMetaData[]> {
        if (token_id) {
            const nft = await this.getNFTMetadata(address, token_id)
            return Promise.resolve([nft])
        }
        this.url.pathname = `/api/v2/nft/${address}`
        this.url.searchParams.set('format', 'decimal');
        this.url.searchParams.set('media_items', 'false')

        const {result} = await this.fetchNFT()
        const metas: NFTMetaData[] = []
        for (const nftData of result) {
            const meta = await this.getNFTMetadata(nftData.token_address, nftData.token_id)
            metas.push(meta)
        }
        return Promise.resolve(metas);
    }

    public async getNFTCollectionsByWallet(address: string): Promise<NFTMetaData[]> {
        this.url.pathname = `/api/v2/${address}/nft`
        const collections = await this.fetchNFT() as CollectionsMeta
        const metas: NFTMetaData[] = []
        for (const collectionItem of collections.result) {
            const img = await this.getImage(collectionItem.token_uri)
            const meta = {
                name: `${collectionItem.name} #${collectionItem.token_id}`,
                image: img,
                token_id: collectionItem.token_id,
                contractAddress: collectionItem.token_address,
                contract_type: collectionItem.contract_type,
                owner_of: collectionItem.owner_of
            }
            metas.push(meta)
        }
        return Promise.resolve(metas)
    }

   private async getImage(tokenURI: string): Promise<string> {
        try {
            console.log(tokenURI)
            const res = await fetch(tokenURI)
            const {image} = await res.json();
            return Promise.resolve(image)
        } catch (e) {
            return Promise.resolve('')
        }
    }

    async getNFTOwnersByContract(address: string, token_id: string): Promise<string> {
        this.url.pathname = `/api/v2/nft/${address}/${token_id}/owners`
        this.url.searchParams.set('format', 'decimal');
        const {result} = await this.fetchNFT()
        const owners = result.map((item: { owner_of: string }) => item.owner_of).join(" ") as string
        return Promise.resolve(owners)
    }

}
