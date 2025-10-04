interface InterfaceContractAddresses {
  ChainId: number;
  MockToken: string;
  Somtam: string;
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
    MockToken: "0xE2D5640Be6617778f03b8F7A246d1096e0aeC563",
    Somtam: "0x7CA3F4AD164c9423aF4c32cce4E2c2d69d17112F",
    SomtamOperation: "0xc63cD3C58f00E1382fC4178187c75C578877aEFF",
    USDC: "0x31d0220469e10c4E71834a79b1f276d740d3768F",
    USDT: "",
    PYUSD: "",
    FDUSD: "",
    WETH: "0x4200000000000000000000000000000000000006",
    POOL_FACTORY_CONTRACT_ADDRESS: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
    QUOTERV2_CONTRACT_ADDRESS: "0x6Dd37329A1A225a6Fca658265D460423DCafBF89",
  },
];
