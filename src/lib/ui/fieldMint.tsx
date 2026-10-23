'use client';

import React, { useState, useEffect } from 'react'
import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { Address, parseEther, formatEther } from "viem";
import { readContract } from '@wagmi/core'
import { AmountBox, FieldCurrency } from './fieldCurrency'
import { config } from '../config'
import { erc20Abi } from '@/config/abi/erc20Abi';
import { type BaseError, useWaitForTransactionReceipt } from "wagmi";
import { tokenList } from '@/config/tokenList';
import { useAssetContext } from '../providers/AssetContext';
import { somtamContractAddr } from '@/config/contractAddress';
import { TokenSelect } from '@/components/token-select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Coins, Loader2, PlusCircle } from 'lucide-react';

type OrderType = {
  order_type: number,
  expiry: bigint,
  purchaser:`0x${string}`,
  seller: `0x${string}`,
  collateral_asset: `0x${string}`,
  collateral_amount: bigint,
}

export const FieldMint = () => {
  const { address: myaddress, chain } = useAccount();
  const { data, error: error, isPending: isPending, writeContract} = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({hash: data})
  const [mintAmount, setMintAmount] = useState("0");
  const [outputAmount, setOutputAmount] = useState("0");
  const [tokenBalance, setTokenBalance] = useState('0');
  const { assetName, updateAssetName } = useAssetContext();
  const [tokenName, setTokenName] = useState<string>(assetName);
  const [somtamBalance, setSomtamBalance] = useState('0');
  const [SOMTAM_ADDR, setSOMTAM_ADDR] = useState('0')
  const [SOMTAMOPERATION_ADDR, setSOMTAMOPERATION_ADDR] = useState('0')
  const [SOMTAMRESERVE_ADDR, setSOMTAMRESERVE_ADDR] = useState('0')
  const [USDC_ADDR, setUSDC_ADDR] = useState('0')

  useEffect(()=> {
    console.log("it isConfirmed")
    const getSOMTAM = async () => {
      console.log("SOMTAM addr", SOMTAM_ADDR)
      const data = await readContract(config, {
        address: SOMTAM_ADDR as Address,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [myaddress]
      })
      return data
    }    
    const getColBalance = async () => {
      let tokenAddress = "0"
      // compare ChainId
      for (const chains of somtamContractAddr){
        if (chain?.id != undefined) {          
          if (chains.ChainId == chain?.id) {
            if (tokenName === "USDC") {
              tokenAddress = chains.USDC
            }
            else if (tokenName === "MockToken") {
              tokenAddress = chains.MockToken
            }
            else if (tokenName === "USDT") {
              tokenAddress = chains.USDT
            }            
            else if (tokenName === "PYUSD") {
              tokenAddress = chains.PYUSD
            }
            else if (tokenName === "FDUSD") {
              tokenAddress = chains.FDUSD
            }
          }
        }
      }
      const data = await readContract(config, {
        address: tokenAddress as Address,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [myaddress]
      })
      return data
    }
    try {
      if (SOMTAM_ADDR != '0') {
      getColBalance().then((_data) => {
        const balance = String(_data)
        console.log('token balance', tokenName, balance)
        setTokenBalance(balance)
      });
      getSOMTAM().then((_data) => {
        const somtam = String(_data)
        console.log('somtam', somtam)
        setSomtamBalance(somtam)
      });
      }
    } catch (e) {
      console.log(e)
    }
  }, [isConfirmed])

  useEffect(()=> {
    const getChain = () => {
      for (const chains of somtamContractAddr){
        if (chain?.id != undefined) {
          if (chains.ChainId == chain?.id) {
            console.log("matched", chains.ChainId, chains.SomtamOperation)
            setSOMTAM_ADDR(chains.Somtam);
            setSOMTAMOPERATION_ADDR(chains.SomtamOperation)
            setUSDC_ADDR(chains.USDC)
          }
        }
      }
    }
    const getColBalance = async () => {
      let tokenAddress = "0"
      // compare ChainId
      for (const chains of somtamContractAddr){
        if (chain?.id != undefined) {          
          if (chains.ChainId == chain?.id) {
            if (tokenName === "USDC") {
              tokenAddress = chains.USDC
            }
            else if (tokenName === "MockToken") {
              tokenAddress = chains.MockToken
            }
            else if (tokenName === "USDT") {
              tokenAddress = chains.USDT
            }            
            else if (tokenName === "PYUSD") {
              tokenAddress = chains.PYUSD
            }
            else if (tokenName === "FDUSD") {
              tokenAddress = chains.FDUSD
            }
          }
        }
      }
      try {
        const data = await readContract(config, {
          address: tokenAddress as Address,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [myaddress]
        })
        return data
      } catch (e) {
        console.log("myaddress", myaddress)
        console.log("tokenAddress", tokenAddress)
        console.log(e)
      }
    }
    try {
      getChain()
      getColBalance().then((_data) => {
        const balance = String(_data)
        console.log('usdc', tokenName, balance)
        setTokenBalance(balance)
      });
    } catch (e) {
      console.log(e)
    }
  }, [])

  useEffect(()=> {
    const getSOMTAM = async () => {
      const data = await readContract(config, {
        address: SOMTAM_ADDR as Address,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [myaddress]
      })
      return data
    }

    try {
      if (SOMTAM_ADDR != '0') {
        getSOMTAM().then((_data) => {
          const somtam = String(_data)
          console.log('somtam', somtam)
          setSomtamBalance(somtam)
        });
      }    
    } catch (e) {
      console.log(e)
    }
  }, [SOMTAM_ADDR])

  useEffect(()=> {
    if (mintAmount === "0") {
      console.log("amount 0")
      setOutputAmount("0.0")
    }
    else {
      let index = 0;
      console.log("amount not 0")
      for (var i = 0, j = tokenList.length; i < j; i++) {
        if (tokenList[i].name === tokenName)
            index = i;
      }
      // SOMTAM decimal point is 18
      setOutputAmount((+mintAmount*10**(18 - tokenList[index].decimal)).toString())

      // SOMTAM decimal point is 6
      // setOutputAmount((+mintAmount*10**(6 - tokenList[index].decimal)).toString())      
    }
  }, [mintAmount, tokenName])

  useEffect(()=> {

    const getTokenBalance = async () => {
      let index = 0;
      for (var i = 0, j = tokenList.length; i < j; i++) {
        if (tokenList[i].name === tokenName)
            index = i;
      }
      let tokenAddress = "0"
      // compare ChainId
      for (const chains of somtamContractAddr){
        if (chain?.id != undefined) {          
          if (chains.ChainId == chain?.id) {
            if (tokenName === "USDC") {
              tokenAddress = chains.USDC
            }
            else if (tokenName === "MockToken") {
              tokenAddress = chains.MockToken
            }
            else if (tokenName === "USDT") {
              tokenAddress = chains.USDT
            }            
            else if (tokenName === "PYUSD") {
              tokenAddress = chains.PYUSD
            }
            else if (tokenName === "FDUSD") {
              tokenAddress = chains.FDUSD
            }
          }
        }
      }

      console.log(tokenList[index].address, tokenAddress)
      try {
        const data = await readContract(config, {
          address: tokenAddress as Address,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [myaddress]
        })
        return data
      } catch (e) {
        console.log("myaddress", myaddress)
        console.log("tokenAddress", tokenAddress)
        console.log(e)
      }
    }

    try {
      updateAssetName(tokenName)
      getTokenBalance().then((_data) => {
        const balance = String(_data)
        console.log('token', balance)
        setTokenBalance(balance)
      });
    } catch (e) {
      console.log(e)
    }
  }, [tokenName])

  const handleMint = async (e: any) => {
    e.preventDefault() // prevents page reload
    const amountInEther = mintAmount;
    const somtamOperAddr = SOMTAMOPERATION_ADDR
    const somtamReserveAddr = SOMTAMRESERVE_ADDR

    console.log("handleMint", SOMTAMOPERATION_ADDR)
    if (Number(amountInEther) % 1 != 0) {
      // is decimal
      alert("Please enter integer for mint amount \nbecause unit is in wei")
      return
    }
    if (amountInEther == '0' || amountInEther == '' ||
      parseInt(amountInEther, 10) == 0
    ) {
      alert("Please enter amount to mint")
      return
    }
    let index = 0
    for (var i = 0, j = tokenList.length; i < j; i++) {
      if (tokenList[i].name === tokenName)
          index = i;
    }
    let tokenAddress = "0"
    // compare ChainId
    for (const chains of somtamContractAddr){
      if (chain?.id != undefined) {          
        if (chains.ChainId == chain?.id) {
          if (tokenName === "USDC") {
            tokenAddress = chains.USDC
          }
          else if (tokenName === "MockToken") {
            tokenAddress = chains.MockToken
          }
          else if (tokenName === "USDT") {
            tokenAddress = chains.USDT
          }            
          else if (tokenName === "PYUSD") {
            tokenAddress = chains.PYUSD
          }
          else if (tokenName === "FDUSD") {
            tokenAddress = chains.FDUSD
          }
        }
      }
    }
    let colAddr = tokenAddress;
    console.log("colAddr", colAddr, amountInEther)

    const balData = await readContract(config, {
      address: colAddr as Address,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [myaddress]
    })
    const balance = String(balData)
    console.log('token balance', tokenName, balance)

    if (parseFloat(balance) > 0.0) {

      writeContract({
        address: somtamOperAddr as Address,
        abi: [{"type":"function","name":"mint","inputs":[{"name":"purchaser","type":"address","internalType":"address"},{"name":"collateral_asset","type":"address","internalType":"address"},{"name":"collateral_amount","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"}],
        functionName: "mint",
        args: [myaddress as Address, colAddr as Address, BigInt(amountInEther)],
      });

      console.log(somtamReserveAddr, somtamOperAddr, colAddr, amountInEther)
    }
    else {
      alert(`Your ${tokenName} balance is zero. Make sure you have ${tokenName} in your wallet.`)
    }
  }

  const handleMintApprove = async (e: any) => {
    e.preventDefault() // prevents page reload
    const amountInEther = mintAmount;
    const somtamOperAddr = SOMTAMOPERATION_ADDR
    const somtamReserveAddr = SOMTAMRESERVE_ADDR
    let colAddr = USDC_ADDR;

    writeContract({
        address: colAddr as Address,
        abi: erc20Abi,
        functionName: "approve",
        args: [somtamOperAddr, (+amountInEther*1000000000000000000)],
    });

    writeContract({
      address: colAddr as Address,
      abi: erc20Abi,
      functionName: "approve",
      args: [somtamReserveAddr, (+amountInEther*1000000000000000000)],
    });
  }

  return (
    <Card className="glass-card mx-auto w-full max-w-xl">
      <CardHeader className="pb-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <PlusCircle className="h-5 w-5 text-primary" />
              Mint SOMTAM
            </CardTitle>
            <CardDescription>
              Deposit collateral to mint SOMTAM into your wallet.
            </CardDescription>
          </div>
          <TokenSelect
            value={tokenName}
            onValueChange={setTokenName}
            options={tokenList.map((token) => token.name)}
            ariaLabel="Select collateral"
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <FieldCurrency
          field="input"
          tokenName={tokenName}
          balance={`${tokenBalance} wei`}
          onAmount={setMintAmount}
        />
        <AmountBox
          label="You receive"
          amount={outputAmount}
          tokenName="SOMTAM"
          balance={`${somtamBalance} wei`}
          readOnly
        />
        <Button
          className="w-full gap-2"
          onClick={handleMint}
          disabled={isPending || isConfirming}
        >
          {isPending || isConfirming ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Coins className="h-4 w-4" />
          )}
          {isConfirming ? "Confirming..." : "Mint"}
        </Button>
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Mint failed</AlertTitle>
            <AlertDescription>
              {(error as BaseError).shortMessage || error.message}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
