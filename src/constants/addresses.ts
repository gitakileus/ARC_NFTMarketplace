export enum SupportedChainId {
  MAINNET = 1,
  RINKEBY = 4,
  HEX_MAINNET = '0x1',
  HEX_RINKEBY = '0x4',
}

type AddressMap = { [chainId: number]: string };

export const MULTICALL_ADDRESS: AddressMap = {
  [SupportedChainId.MAINNET]: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
  [SupportedChainId.RINKEBY]: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
};

export const ARC_TOKEN_ADDRESS: AddressMap = {
  [SupportedChainId.MAINNET]: '0xC82E3dB60A52CF7529253b4eC688f631aad9e7c2',
  [SupportedChainId.RINKEBY]: '0x9Baa392bF91042F605b71582D7B494e812584D2e',
};

export const EXCHANGE_ADDRESS: AddressMap = {
  [SupportedChainId.MAINNET]: '',
  [SupportedChainId.RINKEBY]: '0x4dB8D2C83d042Bd10Da07633C715608c5550a9A2',
};

export const CURRENCY_MANAGER_ADDRESS: AddressMap = {
  [SupportedChainId.MAINNET]: '',
  [SupportedChainId.RINKEBY]: '0xEd8734f418bA3E4D79a0a83df90382907157DB57',
};

export const EXECUTION_MANAGER_ADDRESS: AddressMap = {
  [SupportedChainId.MAINNET]: '',
  [SupportedChainId.RINKEBY]: '0xA5aE446adBf962f484E7E514b728d9c4cDf617A6',
};

export const ROYALTY_FEE_MANAGER_ADDRESS: AddressMap = {
  [SupportedChainId.MAINNET]: '',
  [SupportedChainId.RINKEBY]: '0xb4DBb4B8B8492f83561Fa7EB0B59c4E7aAb70f50',
};

export const TRANSFER_SELECTOR_NFT_ADDRESS: AddressMap = {
  [SupportedChainId.MAINNET]: '',
  [SupportedChainId.RINKEBY]: '0xC8b9Cb9D80e8d35486A2bf9e9F8DF793c2d077a0',
};

export const ROYALTY_FEE_REGISTRY_ADDRESS: AddressMap = {
  [SupportedChainId.MAINNET]: '',
  [SupportedChainId.RINKEBY]: '0xd7ebF321a48d4BC47f6027A6C00f63171627882f',
};

export const STRATEGY_ANY_ITEM_FROM_COLLECTION_FOR_FIXED_PRICE_ADDRESS: AddressMap = {
  [SupportedChainId.MAINNET]: '',
  [SupportedChainId.RINKEBY]: '0x64451983c3359C13c80b74621685E81a55420817',
};

export const STRATEGY_PRIVATE_SALE_ADDRESS: AddressMap = {
  [SupportedChainId.MAINNET]: '',
  [SupportedChainId.RINKEBY]: '0xD6e9a5F458de765a8369CE40BF6a032646520e3A',
};

export const STRATEGY_STANDARD_SALE_FOR_FIXED_PRICE_ADDRESS: AddressMap = {
  [SupportedChainId.MAINNET]: '',
  [SupportedChainId.RINKEBY]: '0x1e983eA1e6198440ec1Af1ac7A965DA7a5696065',
};

export const TRANSFER_MANAGER_ERC1155_ADDRESS: AddressMap = {
  [SupportedChainId.MAINNET]: '',
  [SupportedChainId.RINKEBY]: '0xfd8947464B3a4fAa6a80f182B58Aa4041260374c',
};

export const TRANSFER_MANAGER_ERC721_ADDRESS: AddressMap = {
  [SupportedChainId.MAINNET]: '',
  [SupportedChainId.RINKEBY]: '0x85Af7661280072213D6C1856f0419eE741e4BB0b',
};

export const ARC721_ADDRESS: AddressMap = {
  [SupportedChainId.MAINNET]: '',
  [SupportedChainId.RINKEBY]: '0x8002e428e9F2A19C4f78C625bda69fe70b81Ac26',
};

export const ARC1155_ADDRESS: AddressMap = {
  [SupportedChainId.MAINNET]: '',
  [SupportedChainId.RINKEBY]: '0x05c54832d62b8250a858B523151984282aC7f8BD',
};

export const WETH_ADDRESS: AddressMap = {
  [SupportedChainId.MAINNET]: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  [SupportedChainId.RINKEBY]: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
};
