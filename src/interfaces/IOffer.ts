import { ISignature } from './ISignature';

interface INFTObject {
  artURI: string;
  name: string;
}

export interface IOffer {
  _id: string; // id of activity
  collection: string; // collection contract address
  nftId: string; // id of nft item
  type: string; // type of activity collection, sale, mint, transfer, list
  price: number; // price of activity
  startDate: number; // start date of activity
  endDate: number; // end date of activity
  from: string; // original owner
  to: string; // new owner
  nonce: number; // Nonce of each offer.
  active: boolean; // The status of offer
  signature: ISignature;
  collectionId?: string; // collection ID
  nft: INFTObject;
  by?: string; // mint by person
}
