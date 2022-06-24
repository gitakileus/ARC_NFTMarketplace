import { Network } from './types';
import { Fragment, Interface } from '@ethersproject/abi';
import networks from 'config/networks';
import { utils, BigNumber } from 'ethers';

const networksMap = new Map(networks.map((network) => [network.chainId, network]));

export const getChecksumAddress = (address: string | undefined): string => {
  return address ? utils.getAddress(address) : '';
};

export const getNetwork = (chainId: number | string): Network | undefined => {
  return networksMap.get(Number(chainId));
};

export const getSubgraphUrl = (chainId: number): string => {
  const network = getNetwork(chainId);
  return (network?.subgraph?.active && network?.subgraph?.url) || '';
};

export const getCovalent = (chainId: number): boolean => {
  const network = getNetwork(chainId);
  return Boolean(network?.covalent?.active);
};

const ipfsGateway = 'https://ipfs.io/ipfs/';

const ipfsLinkToCid = (ipfs: string): string => ipfs.replace(/^ipfs:\/\//, '');

const ipfsCidToLink = (cid: string): string => (cid ? `ipfs://${cid}` : '');

export const ipfsGatewayUrl = (ipfs: string): string => `${ipfsGateway}${ipfsLinkToCid(ipfs)}`;

const ipfsToUrlHttp = (url: string): string => (url.startsWith('ipfs://') ? ipfsGatewayUrl(url) : url);

export const ipfsGetLink = (uri: string): string => {
  let ipfsLink = '';
  let cid = '';

  if (uri.startsWith('Qm') || uri.startsWith('ba')) {
    cid = uri;
  } else if (uri.startsWith('ipfs://')) {
    if (uri.startsWith('ipfs://ipfs/')) {
      cid = uri.replace(/^ipfs:\/\/(ipfs\/)/, '');
    } else {
      ipfsLink = uri;
    }
  } else {
    // find cid in uri
    const res = uri.match(/^.*\/ipfs\/(.*)$/i);
    cid = (res && res[1]) || '';
  }
  if (cid) {
    // reconstruct ipfs uri
    ipfsLink = ipfsCidToLink(cid);
  }
  return ipfsLink;
};

type FetchResponse = {
  data?: unknown;
  error?: unknown;
};

export const fetchJson = async (url: string, config: RequestInit = {}): Promise<FetchResponse> => {
  let json: FetchResponse;
  if (url) {
    try {
      const res = await fetch(ipfsToUrlHttp(url), config);
      json = (await res.json()) as FetchResponse;
    } catch (e) {
      json = { error: e };
      console.error('OpenNFTs.fetchJson ERROR', e, url, json);
    }
  } else {
    const e = 'OpenNFTs.fetchJson URL not defined';
    console.error(e);
    json = { error: e };
  }
  return json;
};

export const fetchGQL = async (url: string, query: string): Promise<unknown> => {
  const config = { method: 'POST', body: JSON.stringify({ query }) };

  const answerGQL = await fetchJson(url, config);

  if (answerGQL.error) console.error('fetchGQL ERROR', answerGQL.error);
  return answerGQL?.data;
};

export const fetchCov = async (path: string): Promise<unknown> => {
  const loginPass = `${process.env.REACT_APP_COVALENT_API_KEY}`;
  const url = `https://api.covalenthq.com/v1${path}&key=${loginPass}`;
  const config = {
    method: 'GET',
    headers: {
      // Authorization: `Basic ${btoa(loginPass)}`,
      Accept: 'application/json',
    },
  };

  const answerCov: FetchResponse = await fetchJson(url, config);

  if (answerCov.error) console.error('fetchCov ERROR', answerCov.error);
  return answerCov?.data;
};

export const interfaceId = (abi: Array<string>): string => {
  const iface = new Interface(abi);

  let id = BigNumber.from(0);
  iface.fragments.forEach((f: Fragment): void => {
    if (f.type === 'function') {
      id = id.xor(BigNumber.from(iface.getSighash(f)));
    }
  });
  return utils.hexlify(id);
};
