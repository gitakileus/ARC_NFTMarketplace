export interface ICollection {
  logoUrl?: string; // uri of collection logo
  featuredUrl: string;
  bannerUrl: string;
  contract: string;
  url: string;
  description: string;
  category: string;
  links: [];
  name: string;
  blockchain: string;
  volume: number;
  _24h: number;
  floorPrice: number;
  owners: number;
  items: number;
  isVerified: boolean;
  isExplicit: boolean;
  _id?: string;
}
