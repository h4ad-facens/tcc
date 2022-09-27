import { NFTMetadataAttribute } from "./NFT-metadata-attribute.interface";

export interface NFTMetadata {
  image: string;
  name: string;
  description: string;
  properties: NFTMetadataAttribute[];
}
