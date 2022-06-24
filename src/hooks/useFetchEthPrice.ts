import { useState, useCallback } from 'react';
import { API_BASE_URL } from 'utils';

export default function useFetchEthPrice() {
  const [price, setPrice] = useState(0);

  const retVal = useCallback(async () => {
    const res = await fetch(`${API_BASE_URL}/ws/v2/tokenPrice/ETH`);
    const json = await res.json();
    setPrice(json['price']);
    return json['price'];
  }, []);
  retVal();

  return price;
}
