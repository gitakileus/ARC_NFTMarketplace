import { INFT } from './INFT';
import { IPerson } from './IPerson';

export interface INFTCollection {
  _id: string;
  logoUrl?: string; // uri of collection logo
  featuredUrl?: string; // uri of featured logo
  bannerUrl?: string; // uri of banner logo
  contract: string; // collection contract address
  creator: string; // creator of Collection
  creatorDetail: IPerson;
  url?: string; // collection url in arc
  description?: string; // description of collection
  category?: string; // category of collection
  links: Array<string>; // useful links - 0: yoursite, 1: discord, 2: instagram, 3: medium, 4: telegram
  name: string; // name of nft collection
  blockchain: string; // blockchain
  volume: number;
  totalVolume?: number;
  _24h: number;
  _24hPercent: number;
  floorPrice: number;
  owners: number;
  items: number;
  isVerified: boolean; // verified flag
  isExplicit: boolean; // explicit flag
  properties: any;
  platform: string; // platform
  creatorEarning: string; // Collect a fee when a user re-sells amn item you originally created. This is deducted from the final sale price and paid monthly to your address
  explicitContent?: string;
  nfts?: Array<INFT>;
  offerStatus?: string;
}
