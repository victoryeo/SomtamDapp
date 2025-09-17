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
    MockToken: "0x6E511b239Fb69A420796fAd0FA51Cf9E95432d34",
    Somtam: "0xbf7B5eEe6AFCef9DaED934886351A87D3C4032c7",
    SomtamOperation: "0xbCaC9A23DFFB13CDccf484937Daa5aC9b6914f72",
    USDC: "0x31d0220469e10c4E71834a79b1f276d740d3768F",
    USDT: "",
    PYUSD: "",
    FDUSD: "",
    WETH: "0x4200000000000000000000000000000000000006",
    POOL_FACTORY_CONTRACT_ADDRESS: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
    QUOTERV2_CONTRACT_ADDRESS: "0x6Dd37329A1A225a6Fca658265D460423DCafBF89",
  },
];
