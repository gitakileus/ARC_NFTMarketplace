import { BigNumberish, BytesLike } from 'ethers';

export interface ISignature {
  v: BigNumberish;
  r: BytesLike;
  s: BytesLike;
}
