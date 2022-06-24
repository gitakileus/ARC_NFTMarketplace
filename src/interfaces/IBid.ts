import { INFT } from './INFT';
import { IPerson } from './IPerson';

export interface IBid {
  _id?: string; // id of activity
  collection: string;
  bidder: IPerson; // bidder user id
  bidPrice: number; // bid price
  status: string; // current status of bid
  bidOn: INFT; // NFT id
  type: string;
}
