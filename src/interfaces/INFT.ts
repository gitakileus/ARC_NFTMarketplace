import { IOffer } from './IOffer';
import { IPerson } from './IPerson';

export interface INFTSimple {
  collection: string; // collection contract address
  index: number; // index of nft in collection
}

export interface IProperty {
  key: string;
  value: string;
}

export interface INFTCollectionDetails {
  _id?: string;
  contract?: string;
  platform?: string;
  name?: string;
  logoURL?: string;
}

export interface INFT extends INFTSimple {
  _id: string; // id of nft Item
  collection: string; // collection contract address
  collectionId: string; // collection ID
  index: number; // index of nft in collection
  owner: string; // owner
  ownerDetail: IPerson; // owner Detail
  creator: string; // creator
  artURI: string; // URI of art image
  price: number;
  mintStatus: string;
  saleStatus: string;
  status: string; // For Sale, Buy Now
  status_date: string; // For Sale, Buy Now
  description?: string;
  explicitContent?: string;
  isExplicit: boolean; // explicit flag
  isLockContent: boolean;
  lockContent?: string;
  name: string; // nft name
  externalLink?: string;
  properties: any;
  collection_details?: INFTCollectionDetails;
  contentType?: string;
  timeLeft?: string;
  tokenType: string;
  offer_lists?: IOffer[];
  creatorEarning: number;
}

export interface IPrice {
  price: number;
  timestamp: Date;
}
