import { INFTSimple } from './INFT';

export interface IPerson {
  id: string; // user id
  photoUrl: string; // photo image url
  wallet: string; // wallet address
  username?: string; // username
  email?: string; //email
  displayName?: string; // displayName
  backgroundUrl?: string;
  bio?: string;
  social?: string;
  nfts: number;
  collections: number;
}
