import canceloffer from 'assets/badge/cancel offer.svg';
import collection from 'assets/badge/collection.svg';
import list from 'assets/badge/list.svg';
import mint from 'assets/badge/mint.svg';
import offer from 'assets/badge/offer.svg';
import offercollection from 'assets/badge/offercollection.svg';
import sale from 'assets/badge/sale.svg';
import transfer from 'assets/badge/transfer.svg';
import unlisted from 'assets/badge/unlisted.svg';
import React from 'react';

interface IProps {
  badge: string;
}

export default function Badge(props: IProps) {
  const { badge } = props;
  if (badge === 'List') return <img src={list} alt="List" style={{ paddingLeft: '5px', height: '20px' }} />;
  if (badge === 'Unlisted')
    return <img src={unlisted} alt="Unlisted" style={{ paddingLeft: '5px', height: '20px', width: '80px' }} />;
  if (badge === 'Mint') return <img src={mint} alt="Mint" style={{ paddingLeft: '5px', height: '20px' }} />;
  if (badge === 'Offer') return <img src={offer} alt="Offer" style={{ paddingLeft: '5px', height: '20px' }} />;
  if (badge === 'Sale') return <img src={sale} alt="Sale" style={{ paddingLeft: '5px', height: '20px' }} />;
  if (badge === 'Transfer') return <img src={transfer} alt="Transfer" style={{ paddingLeft: '5px', height: '20px' }} />;
  if (badge === 'Collection')
    return <img src={collection} alt="Transfer" style={{ paddingLeft: '5px', height: '20px' }} />;
  if (badge === 'Cancel offer')
    return <img src={canceloffer} alt="Cancel offer" style={{ paddingLeft: '5px', height: '20px' }} />;
  if (badge === 'OfferCollection')
    return <img src={offercollection} alt="OfferCollection" style={{ paddingLeft: '5px', height: '20px' }} />;
  return null;
}
