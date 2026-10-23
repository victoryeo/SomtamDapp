'use client';

import React, { useState, useEffect } from 'react'
import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { Address, parseEther, formatEther } from "viem";
import { readContract } from 'wagmi/actions'
import { FieldCurrency } from './fieldCurrency'
import { config } from '../config'
import { erc20Abi } from '@/config/abi/erc20Abi';
import { wethAbi } from '@/config/abi/wethAbi';
import { faucetList } from '@/config/faucetList';
import { type BaseError, useWaitForTransactionReceipt } from "wagmi";
import { somtamContractAddr } from '@/config/contractAddress';
import { TokenSelect } from '@/components/token-select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Droplets, Loader2 } from 'lucide-react';

export const FieldFaucet = () => {
  const { address: myaddress, chain } = useAccount();
  const { data, error: error, isPending: isPending, writeContract} = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({hash: data})  
  const [mintAmount, setMintAmount] = useState("0");
  const [outputAmount, setOutputAmount] = useState("0");
  const [tokenBalance, setTokenBalance] = useState('0');
  const [tokenName, setTokenName] = useState("WETH");

  useEffect(()=> {
    console.log("it isConfirmed")    
    const getColBalance = async () => {
      let tokenAddress = "0"
      // compare ChainId
      for (const chains of somtamContractAddr){
        if (chain?.id != undefined) {          
          if (chains.ChainId == chain?.id) {
            if (tokenName === "WETH") {
              tokenAddress = chains.WETH
            }
            else if (tokenName === "MockToken") {
              tokenAddress = chains.MockToken
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
      getColBalance().then((_data) => {
        const balance = String(_data)
        console.log('token balance', tokenName, balance)
        setTokenBalance(balance)
      });
    } catch (e) {
      console.log(e)
    }
  }, [isConfirmed])

  useEffect(() => {
    const getTokenBalance = async () => {
      
      let tokenAddress = "0"
      // compare ChainId
      for (const chains of somtamContractAddr){
        if (chain?.id != undefined) {          
          if (chains.ChainId == chain?.id) {
            if (tokenName === "WETH") {
              tokenAddress = chains.WETH
            }
            else if (tokenName === "MockToken") {
              tokenAddress = chains.MockToken
            }
          }
        }
      }

      try {
        const data = await readContract(config, {
          address: tokenAddress as Address,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [myaddress],
        });
        setTokenBalance(String(data));
      } catch (error) {
        console.error('Error fetching token balance:', error);
      }
    };

    getTokenBalance();
  }, [tokenName, myaddress]);

  useEffect(() => {
    if (mintAmount === "0") {
      setOutputAmount("0.0");
    } else {
      setOutputAmount((+mintAmount * 1).toString());
    }
  }, [mintAmount]);

  const handleMintFaucet = async (e: any) => {
    e.preventDefault() // prevents page reload
    let amountInEther: string

    if (Number(mintAmount) % 1 != 0) {
      // is decimal
      alert("Please enter integer for mint amount \nbecause unit is in wei")
      return
    }
    if (mintAmount == '0' || mintAmount == '' ||
      parseInt(mintAmount, 10) == 0
    ) {
      alert("Please enter amount to mint")
      return
    }

    if (mintAmount == "" || !mintAmount || mintAmount.length === 0) {
      amountInEther = "1"
    } else {
      amountInEther = mintAmount;
    }
    console.log(amountInEther)
    // Find the selected token
    let tokenAddress = "0"
    // compare ChainId
    for (const chains of somtamContractAddr){
      if (chain?.id != undefined) {          
        if (chains.ChainId == chain?.id) {
          if (tokenName === "WETH") {
            tokenAddress = chains.WETH
          }
          else if (tokenName === "MockToken") {
            tokenAddress = chains.MockToken
          }
        }
      }
    }  

    // Validate the selected token address
    const selectedTokenAddress = tokenAddress as `0x${string}` | undefined;
    if (!selectedTokenAddress || !/^0x[a-fA-F0-9]{40}$/.test(selectedTokenAddress)) {
      console.error('Invalid or undefined token address:', selectedTokenAddress);
      return; // Exit the function if the address is invalid
    }
    console.log('ERC-20 token address, name:', selectedTokenAddress, tokenName);

    if (tokenName === "weth" || tokenName === "WETH") {
      let newAmount = parseEther(formatEther(BigInt(mintAmount), "wei"))
      console.log('weth', newAmount)
      await writeContract({
        address: selectedTokenAddress as Address,
        abi: wethAbi,
        functionName: "deposit",
        args: [],
        value: newAmount
      });
    } else if (tokenName === "mockToken" || tokenName === "MockToken") {
      console.log('other tokens', selectedTokenAddress)
      await writeContract({
        address: selectedTokenAddress as Address,
        abi: [{"type":"function","name":"mint","inputs":[{"name":"amount","type":"uint256","internalType":"uint256"},{"name":"receiver","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"}],
        functionName: "mint",
        args: [BigInt(amountInEther), myaddress!],
      });
    } else {
      console.log('other tokens', selectedTokenAddress)
      await writeContract({
        address: selectedTokenAddress as Address,
        abi: erc20Abi,
        functionName: "mint",
        args: [myaddress, amountInEther.toString()],
      });
    }
    //alert(`collateral sent!`)
  }

  return (
    <Card className="glass-card mx-auto w-full max-w-xl">
      <CardHeader className="pb-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Droplets className="h-5 w-5 text-primary" />
              Faucet
            </CardTitle>
            <CardDescription>
              Request test tokens for this network.
            </CardDescription>
          </div>
          <TokenSelect
            value={tokenName}
            onValueChange={setTokenName}
            options={faucetList.map((token) => token.name)}
            ariaLabel="Select faucet token"
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
        <Button
          className="w-full gap-2"
          onClick={handleMintFaucet}
          disabled={isPending || isConfirming}
        >
          {isPending || isConfirming ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Droplets className="h-4 w-4" />
          )}
          {isConfirming ? "Confirming..." : "Get Tokens"}
        </Button>
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Faucet request failed</AlertTitle>
            <AlertDescription>
              {(error as BaseError).shortMessage || error.message}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
