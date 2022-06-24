import type { Provider } from '@ethersproject/abstract-provider';
import IERC165 from 'abis/IERC165.json';
import IERC173 from 'abis/IERC173.json';
import IERC721 from 'abis/IERC721.json';
import IERC721Enumerable from 'abis/IERC721Enumerable.json';
import IERC721Metadata from 'abis/IERC721Metadata.json';
import IERC1155 from 'abis/IERC1155.json';
import IERC1155MetadataURI from 'abis/IERC1155MetadataURI.json';
import { ERC165 } from 'abis/types/ERC165';
import { BigNumber, Signer, Contract } from 'ethers';
import { getAddress } from 'ethers/lib/utils';
import React, { useCallback } from 'react';
import { useAppDispatch } from 'state/hooks';
import { fetchCollectionList, fetchNFTList } from 'state/lists/actions';
import { Collection, Nft, CollectionSupports, NftMetadata } from 'state/lists/types';
import {
  fetchCov,
  fetchGQL,
  fetchJson,
  getChecksumAddress,
  getCovalent,
  getNetwork,
  getSubgraphUrl,
  interfaceId,
  ipfsGatewayUrl,
  ipfsGetLink,
} from 'state/lists/utils';
import { useWeb3 } from 'web3';

type ErcKeys = 'IERC165' | 'IERC721' | 'IERC721Metadata' | 'IERC721Enumerable' | 'IERC1155' | 'IERC1155MetadataURI';

const abis = {
  IERC165,
  IERC721,
  IERC721Enumerable,
  IERC721Metadata,
  IERC1155,
  IERC173,
  IERC1155MetadataURI,
};

const collectionGetSupportedInterfaces = async (
  chainId: number,
  collectionOrAddress: Collection | string,
  signerOrProvider: Signer | Provider
): Promise<{ supports: CollectionSupports; version: number; mintable: boolean; owner: string }> => {
  const supports: CollectionSupports = {};
  let collectionAddress: string;
  const version = -1;
  const mintable = false;
  const owner = '';

  if (chainId && collectionOrAddress && signerOrProvider) {
    let contract: ERC165;

    supports.IERC165 = true;

    if (typeof collectionOrAddress === 'string') {
      collectionAddress = collectionOrAddress;
    } else {
      collectionAddress = collectionOrAddress.address;
    }

    try {
      contract = new Contract(collectionAddress, IERC165.concat(IERC173), signerOrProvider) as ERC165;

      const waitERC721 = contract.supportsInterface(interfaceId(IERC721));
      const waitERC1155 = contract.supportsInterface(interfaceId(IERC1155));
      const waitERC173 = contract.supportsInterface(interfaceId(IERC173));
      [supports.IERC721, supports.IERC1155, supports.IERC173] = await Promise.all([
        waitERC721,
        waitERC1155,
        waitERC173,
      ]);

      if (supports.IERC721) {
        const waitMetadata = contract.supportsInterface(interfaceId(IERC721Metadata));
        const waitEnumerable = contract.supportsInterface(interfaceId(IERC721Enumerable));

        [supports.IERC721Metadata, supports.IERC721Enumerable] = await Promise.all([waitMetadata, waitEnumerable]);
      } else if (supports.IERC1155) {
        supports.IERC1155MetadataURI = await contract.supportsInterface(interfaceId(IERC1155MetadataURI));
      }
    } catch (e) {
      console.error(`ERROR collectionGetSupportedInterfaces : ${chainId} ${collectionAddress}\n`, e);
    }
  }
  return { supports, version, mintable, owner };
};

const collectionGetContract = async (
  chainId: number,
  collectionOrAddress: Collection | string,
  signerOrProvider: Signer | Provider
): Promise<Contract> => {
  let abi: Array<string> = [];
  let collection: Collection;

  if (typeof collectionOrAddress === 'string') {
    collection = { chainId, address: collectionOrAddress };
  } else {
    collection = collectionOrAddress;
  }

  const collectionSupports = collection.supports
    ? collection.supports
    : await collectionGetSupportedInterfaces(chainId, collection.address, signerOrProvider);

  for (const [key, supports] of Object.entries(collectionSupports)) {
    if (supports) {
      abi = abi.concat(abis[key as ErcKeys]);
    }
  }
  const contract = new Contract(collection.address, abi, signerOrProvider);

  return contract;
};

const collectionListFromTheGraph = async (chainId: number, owner: string): Promise<Collection[]> => {
  const collections: Collection[] = [];
  const network = getNetwork(chainId);
  const query = `
      {
        ownerPerTokenContracts(
          where: {
            owner: "${owner.toLowerCase()}"
            }
        ) {
          contract {
            id
            name
            symbol
            numTokens
          }
          numTokens
        }
      }
  `;
  type AnswerCollectionsGQL = {
    ownerPerTokenContracts: Array<{
      contract: { id: string; name: string; symbol: string; numTokens: number };
      numTokens: number;
    }>;
  };
  const answerGQL = (await fetchGQL(getSubgraphUrl(chainId), query)) as AnswerCollectionsGQL;
  const currentContracts = answerGQL?.ownerPerTokenContracts || [];
  for (let index = 0; index < currentContracts.length; index++) {
    const currentContractResponse = currentContracts[index];
    const { contract, numTokens } = currentContractResponse;
    const { id, name, symbol, numTokens: numTokensTotal } = contract;
    const totalSupply = Number(numTokensTotal);
    const address = getAddress(id);
    const chainName = network?.chainName;
    const balanceOf = Math.max(numTokens, 0);
    const user = owner || '';

    if (currentContractResponse.numTokens > 0) {
      const collection: Collection = {
        chainId,
        chainName,
        address,
        name,
        symbol,
        totalSupply,
        user,
        balanceOf,
      };
      collections.push(collection);
    }
  }

  return collections;
};

const collectionListFromCovalent = async (chainId: number, owner: string): Promise<Collection[]> => {
  const collections: Collection[] = [];
  const network = getNetwork(chainId);
  if (network) {
    const match = '{$or:[{supports_erc:{$elemmatch:"erc721"}},{supports_erc:{$elemmatch:"erc1155"}}]}';
    const path =
      `/${Number(chainId)}/address/${owner}/balances_v2/` +
      '?nft=true' +
      '&no-nft-fetch=false' +
      `&match=${encodeURIComponent(match)}`;
    type CollectionCov = {
      contract_name: string;
      contract_ticker_symbol: string;
      contract_address: string;
      balance: BigNumber;
    };
    type AnswerCollectionsCov = {
      items?: Array<CollectionCov>;
    };
    const answerCollectionsCov = (await fetchCov(path)) as AnswerCollectionsCov;
    const collectionsCov = answerCollectionsCov?.items;
    if (collectionsCov?.length) {
      for (let index = 0; index < collectionsCov.length; index++) {
        const collectionCov: CollectionCov = collectionsCov[index];

        const chainName: string = network?.chainName;
        const address: string = getAddress(collectionCov.contract_address) as string;
        const name = collectionCov.contract_name || '';
        const symbol = collectionCov.contract_ticker_symbol || '';
        const user = owner || '';
        const balanceOf = Number(collectionCov.balance);

        const collection: Collection = {
          chainId,
          chainName,
          address,
          name,
          symbol,
          user,
          balanceOf,
        };
        collections.push(collection);
      }
    }
  }
  return collections;
};

const collectionList = async (chainId: number, owner: string): Promise<Collection[]> => {
  let collections: Collection[] = [];
  const network = getNetwork(chainId);
  if (network) {
    if (getSubgraphUrl(chainId)) {
      collections = await collectionListFromTheGraph(chainId, owner);
    } else if (getCovalent(chainId)) {
      collections = await collectionListFromCovalent(chainId, owner);
    }
  }
  return collections;
};

const contentTypes: Map<string, string> = new Map();

const nftGetContentType = async (nft: Nft): Promise<string> => {
  let contentType = 'text';
  const url = nftGetImageLink(nft);

  if (url) {
    contentType = contentTypes.get(url) || '';
    if (!contentType) {
      contentType = 'image';
      try {
        const options = { method: 'HEAD' };
        const response = await fetch(url, options);
        contentType = response.headers.get('content-type') || 'text';
        contentTypes.set(url, contentType);
      } catch (e) {
        console.error('ERROR nftGetContentType', e);
      }
    }
  }
  return contentType;
};

export const nftGetImageLink = (nft: Nft): string => (nft?.ipfs ? ipfsGatewayUrl(nft.ipfs) : nft?.image || '');

const nftGetMetadata = async (chainId: number, token: Nft, collection?: Collection): Promise<Nft | undefined> => {
  let nftMetadata: Nft | undefined;

  if (chainId && token) {
    const network = getNetwork(chainId);
    const collectionAddress: string = getChecksumAddress(token.collection || collection?.address || '');

    let tokenJson: NftMetadata = {};

    if (token.tokenURI) {
      if (token.metadata) {
        tokenJson = token.metadata;
      } else {
        try {
          const tokenURIAnswer = await fetchJson(token.tokenURI);
          if (tokenURIAnswer.error) {
            console.error('ERROR nftGetMetadata tokenURIAnswer.error ', tokenURIAnswer.error);
          } else {
            tokenJson = tokenURIAnswer as NftMetadata;
          }
        } catch (e) {
          console.error('ERROR nftGetMetadata tokenURIAnswer', e);
        }
      }
    }

    const chainName: string = token.chainName || network?.chainName || '';
    const metadata = { ...token.metadata, ...tokenJson };
    const image: string = token.image || metadata.image || metadata.image_url || '';

    nftMetadata = {
      tokenID: token.tokenID || '',
      tokenURI: token.tokenURI || '',
      tokenJson,
      collection: collectionAddress,
      chainId,
      chainName,
      metadata,
      image,
      name: token.name || metadata.name || '',
      description: token.description || metadata.description || '',
      creator: getChecksumAddress(token.creator || metadata.creator),
      minter: getChecksumAddress(token.minter || metadata.minter),
      owner: getChecksumAddress(token.owner || metadata.owner),
      ipfs: token.ipfs || metadata.ipfs || ipfsGetLink(image) || '',
      ipfsJson: token.ipfsJson || ipfsGetLink(token.tokenURI) || '',
    };
    nftMetadata.contentType = token.contentType;
    // nftMetadata.contentType = token.contentType || (await nftGetContentType(nftMetadata));
  }
  return nftMetadata;
};

const nftGetFromContract = async (
  chainId: number,
  collection: Collection,
  tokenID: string,
  provider: Provider,
  owner = ''
): Promise<Nft | undefined> => {
  let tokenURI = '';
  let contractName = '';

  let nft: Nft | undefined;

  if (chainId && collection) {
    try {
      const contract = await collectionGetContract(chainId, collection, provider);
      contractName = collection.name || 'No name';

      if (contract && collection?.supports?.IERC721Metadata) {
        contractName = contractName || (await contract.name());
        owner = owner || (await contract.ownerOf(tokenID));
        tokenURI = await contract.tokenURI(tokenID);
      }

      nft = {
        chainId,
        collection: collection.address,
        contractName,
        tokenID,
        tokenURI,
        owner,
      };
    } catch (e) {
      console.error('ERROR nftGetFromContract', e);
    }
  }
  return nft;
};

const nftGetFromContractEnumerable = async (
  chainId: number,
  collection: Collection,
  index: number,
  provider: Provider,
  owner?: string
): Promise<Nft | undefined> => {
  let nft: Nft | undefined;
  let tokID: BigNumber;

  if (chainId && collection?.supports?.IERC721Enumerable) {
    try {
      const contract = await collectionGetContract(chainId, collection, provider);
      if (contract) {
        if (owner) {
          tokID = await contract.tokenOfOwnerByIndex(owner, index);
        } else {
          tokID = await contract.tokenByIndex(index);
          owner = await contract.ownerOf(tokID);
        }
        nft = await nftGetFromContract(chainId, collection, tokID.toString(), provider, owner);
      }
    } catch (e) {
      console.error('ERROR nftGetFromContractEnumerable', chainId, index, owner, collection, e);
    }
  }
  return nft;
};

const nftListFromCovalent = async (chainId: number, collection: Collection, owner?: string): Promise<Nft[]> => {
  const nfts: Nft[] = [];
  const network = getNetwork(chainId);

  if (network && collection && owner) {
    const match = `{contract_address:"${getChecksumAddress(collection.address)}"}`;
    const path =
      `/${Number(chainId)}/address/${owner}/balances_v2/` +
      '?nft=true&no-nft-fetch=false' +
      `&match=${encodeURIComponent(match)}`;

    type NftsCov = {
      token_id: string;
      token_url: string;
      owner: string;
      external_data: NftMetadata;
      original_owner: string;
    };
    type AnswerNftsCov = {
      items?: [{ nft_data: [NftsCov] }];
    };

    try {
      const nftsJson = ((await fetchCov(path)) as AnswerNftsCov)?.items;
      if (nftsJson) {
        const tokens = nftsJson[0].nft_data;

        for (let index = 0; index < tokens.length; index++) {
          const _token = tokens[index];
          nfts.push({
            chainId,
            collection: getChecksumAddress(collection.address),
            tokenID: _token.token_id,
            tokenURI: _token.token_url,
            metadata: _token.external_data,
            owner: getChecksumAddress(_token.owner || owner),
            minter: getChecksumAddress(_token.original_owner),
          });
        }
      }
    } catch (e) {
      console.error('ERROR nftListFromCovalent', e);
    }
  }

  return nfts;
};

const nftListFromTheGraph = async (chainId: number, collection: Collection, owner?: string): Promise<Nft[]> => {
  const nfts: Nft[] = [];
  const network = getNetwork(chainId);

  if (network && collection) {
    const collectionAddress = collection.address.toLowerCase();
    const whereOwner = owner ? `where: { owner: "${owner.toLowerCase()}" }` : '';

    const query = `{
      tokenContract( id: "${collectionAddress}" ) {
        tokens( ${whereOwner} ) {
          id
          owner{
            id
          }
          tokenID
          tokenURI
        }
      }
    }`;
    type NftsGQL = {
      tokenID: string;
      tokenURI: string;
      owner: { id: string };
    };
    type AnswerNftsGQL = {
      tokenContract: { nfts: Array<NftsGQL> };
    };
    const answerGQL = (await fetchGQL(getSubgraphUrl(chainId) || '', query)) as AnswerNftsGQL;
    const nftsJson: Array<NftsGQL> = answerGQL?.tokenContract?.nfts || [];

    for (let index = 0; index < nftsJson.length; index++) {
      const _token = nftsJson[index];

      nfts.push({
        chainId,
        collection: getChecksumAddress(collection.address),
        tokenID: _token.tokenID,
        tokenURI: _token.tokenURI,
        owner: getChecksumAddress(_token.owner?.id),
      });
    }
  }

  return nfts;
};

const nftListFromContract = async (
  chainId: number,
  collection: Collection,
  provider: Provider,
  owner?: string
): Promise<Nft[]> => {
  const nfts: Nft[] = [];

  if (chainId && collection?.supports?.IERC721Enumerable) {
    try {
      const contract = await collectionGetContract(chainId, collection, provider);

      if (contract) {
        let nbTokens = 0;
        if (owner) {
          nbTokens = Number(await contract.balanceOf(owner));
        } else {
          if (contract.totalSupply) {
            nbTokens = Number(await contract.totalSupply());
          }
        }

        for (let index = 0; index < nbTokens; index++) {
          const nft: Nft | undefined = await nftGetFromContractEnumerable(chainId, collection, index, provider, owner);
          if (nft) {
            nfts.push(nft);
          }
        }
      }
    } catch (e) {
      console.error('nftListFromContract ERROR', e);
    }
  }
  return nfts;
};

const nftListTokenIds = async (
  chainId: number,
  collection: Collection,
  provider: Provider,
  owner?: string
): Promise<Nft[]> => {
  let nftsTokenIds: Nft[] = [];
  const network = getNetwork(chainId);

  if (network) {
    nftsTokenIds = await nftListFromContract(chainId, collection, provider, owner);
    if (nftsTokenIds.length === 0) {
      if (getSubgraphUrl(chainId)) {
        nftsTokenIds = await nftListFromTheGraph(chainId, collection, owner);
      } else if (getCovalent(chainId)) {
        nftsTokenIds = await nftListFromCovalent(chainId, collection, owner);
      } else {
        console.error('No NFTs found:-(');
      }
    }
  }

  return nftsTokenIds;
};

const nftListWithMetadata = async (chainId: number, collection: Collection, nfts: Nft[]): Promise<Nft[]> => {
  const nftsWithMetadata: Nft[] = [];
  const nftsFromIds = [...nfts];

  for (let index = 0; index < nftsFromIds.length; index++) {
    const nft = await nftGetMetadata(chainId, nftsFromIds[index], collection);
    if (nft) {
      nftsWithMetadata.push(nft);
    }
  }

  return nftsWithMetadata;
};

const nftList = async (chainId: number, collection: Collection, provider: Provider, owner?: string): Promise<Nft[]> => {
  const nftsTokenIds: Nft[] = await nftListTokenIds(chainId, collection, provider, owner);
  const nftsWithMetadata: Nft[] = await nftListWithMetadata(chainId, collection, nftsTokenIds);

  return nftsWithMetadata;
};

export function useFetchListCallback() {
  const { account, chainId, provider } = useWeb3();
  const dispatch = useAppDispatch();

  return useCallback(async () => {
    if (account && chainId && provider) {
      const collections = await collectionList(chainId, account);
      dispatch(fetchCollectionList({ chainId, list: collections }));
      collections.map((collection) => {
        dispatch(fetchNFTList.pending({ contractAddress: collection.address, chainId }));
        return nftList(chainId, collection, provider, account)
          .then((list) => {
            dispatch(fetchNFTList.fulfilled({ contractAddress: collection.address, list, chainId }));
          })
          .catch((err) => {
            dispatch(fetchNFTList.rejected({ contractAddress: collection.address, chainId, errorMessage: err }));
          });
      });
    }
  }, [dispatch, account, chainId, provider]);
}
