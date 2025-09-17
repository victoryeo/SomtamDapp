type FaucetListType = {
  index: number;
  name: string;
  address: `0x${string}`;
};

export const faucetList = [
  {
    index: 0,
    name: "MockToken",
    address: process.env.NEXT_PUBLIC_MOCKTOKEN_ADDR,
  },
  {
    index: 1,
    name: "WETH",
    address: process.env.NEXT_PUBLIC_WETH_ADDR,
  },
];
