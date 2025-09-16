interface InterfaceContractAddresses {
  ChainId: number;
  Somtam: string;
  MockToken: string;
  SomtamOperation: string;
  USDC: string;
  USDT: string;
  PYUSD: string;
  FDUSD: string;
  WETH: string;
  POOL_FACTORY_CONTRACT_ADDRESS: string;
  QUOTERV2_CONTRACT_ADDRESS: string;
}

export const somtamContractAddr: InterfaceContractAddresses[] = [
  {
    ChainId: 1301, //unichain
    Somtam: "0x569B7cF72b393042E30bC4FE4CEb41Ab144824e8",
    MockToken: "0x6caE6b06490c1BCEc1265396718AF023b2C14648",
    SomtamOperation: "0x28bE051ca7f6225D261FE64b45286A979a2B7AaB",
    USDC: "0x31d0220469e10c4E71834a79b1f276d740d3768F",
    USDT: "",
    PYUSD: "",
    FDUSD: "",
    WETH: "0x4200000000000000000000000000000000000006",
    POOL_FACTORY_CONTRACT_ADDRESS: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
    QUOTERV2_CONTRACT_ADDRESS: "0x6Dd37329A1A225a6Fca658265D460423DCafBF89",
  },
];
