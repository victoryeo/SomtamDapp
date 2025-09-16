'use client';

import React, { useState, useEffect } from 'react'
import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { Address, parseEther, formatEther } from "viem";
import { readContract } from '@wagmi/core'
import { FieldCurrency } from './fieldCurrency'
import { config } from '../config'
import { erc20Abi } from '@/config/abi/erc20Abi';
import { wethAbi } from '@/config/abi/wethAbi';
import { FaucetDialog } from '@/app/components/faucetDialog';
import { faucetList } from '@/config/faucetList';
import { type BaseError, useWaitForTransactionReceipt } from "wagmi";
import { somtamContractAddr } from '@/config/contractAddress';

export const FieldFaucet = () => {
  const { address: myaddress, chain } = useAccount();
  const { data, error: error, isPending: isPending, writeContract} = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({hash: data})  
  const [mintAmount, setMintAmount] = useState("0");
  const [outputAmount, setOutputAmount] = useState("0");
  const [tokenBalance, setTokenBalance] = useState('0');
  const [showModal, setShowModal] = useState<boolean>(false);
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
    <div className="appBody">
      <div className="swapContainer">
        <div className="swapHeader">
          <span className="swapText">Faucet</span>
          <button
            className="narrowButton rightAlignContainer"
            onClick={() => setShowModal(true)}
          >
            Select Token
          </button>
        </div>

        {showModal && (
          <FaucetDialog
            isOpen={() => setShowModal(true)}
            onClose={() => setShowModal(false)}
            tokenName={tokenName}
            setTokenName={setTokenName}
          />
        )}

        <div className="">
          <FieldCurrency
            field="input"
            tokenName={tokenName}
            balance={tokenBalance}
            onAmount={setMintAmount}
          />
        </div>

        <div className="swapButtonContainer">
          <button type="submit" className="swapButton" onClick={handleMintFaucet}>
            Get Tokens
          </button>

          {error && (
            <div>Error: {(error as BaseError).shortMessage || error.message}</div>
          )}
        </div>
      </div>
    </div>
  )
}
