type TokenListType = {
  index: number,
  name: string,
  address:`0x${string}`,
}

export const tokenList = [
  {
    "index": 0,
    "name": "USDC",
    "address": process.env.NEXT_PUBLIC_USDC_ADDR,
    "decimal": 6
  },
  {
    "index": 1,
    "name": "USDT",
    "address": process.env.NEXT_PUBLIC_USDT_ADDR,
    "decimal": 6
  },
  {
    "index": 2,
    "name": "PYUSD",
    "address": process.env.NEXT_PUBLIC_PYUSD_ADDR,
    "decimal": 6
  }, 
  {
    "index": 3,
    "name": "FDUSD",
    "address": process.env.NEXT_PUBLIC_FDUSD_ADDR,
    "decimal": 18
  },   
  {
    "index": 4,
    "name": "MockToken",
    "address": process.env.NEXT_PUBLIC_COLLATERAL_ADDR,
    "decimal": 18
  },  
]