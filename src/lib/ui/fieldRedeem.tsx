'use client';

import React, { useState, useEffect } from 'react'
import { useWriteContract, useAccount, useWatchContractEvent } from 'wagmi';
import { Address, parseEther, formatEther } from "viem";
import { readContract, writeContract as writeContractDirect, watchContractEvent, getTransactionReceipt } from '@wagmi/core'
import { type BaseError, useWaitForTransactionReceipt } from "wagmi";
import { FieldCurrency } from './fieldCurrency'
import { config } from '../config'
import { erc20Abi } from '@/config/abi/erc20Abi';
import { somtamOperationAbi } from '@/config/abi/somtamOperationAbi';
import { TokenDialog } from '@/app/components/tokenDialog'
import { tokenList } from '@/config/tokenList';
import { useAssetContext } from '../providers/AssetContext';
import { somtamContractAddr } from '@/config/contractAddress';
import  * as ethers from 'ethers';

type OrderType = {
  order_type: number,
  expiry: bigint,
  purchaser:`0x${string}`,
  seller: `0x${string}`,
  collateral_asset: `0x${string}`,
  collateral_amount: bigint,
}

export const FieldRedeem = () => {
  const { address: myaddress, chain } = useAccount();
  const { data: dataHash, error: error, isPending: isPending, writeContract} = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({hash: dataHash})
  const [redeemAmount, setRedeemAmount] = useState("0");
  const [outputAmount, setOutputAmount] = useState("0");
  const [usdcBalance, setUsdcBalance] = useState('0');
  const [somtamBalance, setSomtamBalance] = useState('0');
  const [showModal, setShowModal] = useState<boolean>(false)
  const { assetName, updateAssetName } = useAssetContext();
  const [tokenName, setTokenName] = useState(assetName);
  const [tokenBalance, setTokenBalance] = useState('0');
  const [SOMTAM_ADDR, setSOMTAM_ADDR] = useState('0')
  const [SOMTAMOPERATION_ADDR, setSOMTAMOPERATION_ADDR] = useState('0')
  const [USDC_ADDR, setUSDC_ADDR] = useState('0')
  const somtamOperInterface = new ethers.utils.Interface(somtamOperationAbi);
  const erc20Interface = new ethers.utils.Interface(erc20Abi);
  const [redeemMsg, setRedeemMsg] = useState('');

  useEffect(()=> {
    console.log("it isConfirmed", dataHash)
    const getSOMTAM = async () => {
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
    const findCollateralAsset = (colAddr: string): string => {
      console.log(chain?.id, colAddr)
      for (const chains of somtamContractAddr){
        if (chain?.id != undefined) {
          if (chains.ChainId == chain?.id) {
            if (colAddr == chains.USDC) 
              return 'USDC'
            else if (colAddr == chains.USDT) 
              return 'USDT'
            else if (colAddr == chains.FDUSD) 
              return 'FDUSD'
            else if (colAddr == chains.PYUSD) 
              return 'PYUSD'             
            else 
              return 'MockToken'
          }
          else 
            continue
        }
        return ''
      }
      return ''      
    }
    const getRedeemEvents = async() => {
      getTransactionReceipt(config, {
        hash: dataHash!,
      }).then((_data) => {
        console.log(_data)
        _data.logs.map(i => 
          {
            try {
              const decodedRedeem = somtamOperInterface.parseLog(i)
              console.log(decodedRedeem)
              let colAsset = findCollateralAsset(decodedRedeem.args[2]);
              setRedeemMsg(`You receive ${decodedRedeem.args[3]} wei of ${colAsset}`);
            } catch (e) {
              try {
                const decodedTransfer = erc20Interface.parseLog(i)
                console.log(decodedTransfer)
              } catch (e) {
                console.log(e)
              }
            }
          })
      })      
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
      if (dataHash != null) {
        getRedeemEvents();
      }
    } catch (e) {
      console.log(e)
    }
  }, [isConfirmed])

  useEffect(()=> {
    if (showModal == false) {
      let index = 0
      for (var i = 0, j = tokenList.length; i < j; i++) {
        if (tokenList[i].name === tokenName)
            index = i;
      }
      // SOMTAM decimal point is 18
      setOutputAmount((+redeemAmount/10**(18 - tokenList[index].decimal)).toFixed(18))
    }
  }, [showModal])

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
    if (redeemAmount === "0") {
      console.log("amount 0")
      setOutputAmount("0.0")
    }
    else {
      let index = 0;
      console.log("amount not 0")
      //setOutputAmount((+redeemAmount*1).toString())
      for (var i = 0, j = tokenList.length; i < j; i++) {
        if (tokenList[i].name === tokenName)
            index = i;
      }
      // SOMTAM decimal point is 18
      const tempNum = parseFloat((+redeemAmount/10**(18 - tokenList[index].decimal)).toFixed(18)).toString()
      
      // SOMTAM decimal point is 6
      //const tempNum = parseFloat((+redeemAmount/10**(6 - tokenList[index].decimal)).toFixed(18)).toString()
      setOutputAmount(tempNum)
    }
  }, [redeemAmount])

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
      console.log(tokenList[index].address)
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

  const handleRedeem = async (e: any) => {
    e.preventDefault() // prevents page reload
    const amountInEther = redeemAmount;
    const somtamOperAddr = SOMTAMOPERATION_ADDR

    setRedeemMsg('')
    let index = 0
    for (var i = 0, j = tokenList.length; i < j; i++) {
      if (tokenList[i].name === tokenName)
          index = i;
    }

    if (Number(amountInEther) % 1 != 0) {
      // is decimal
      alert("Please enter integer for redeem amount \nbecause unit is in wei")
      return
    }    
    if (amountInEther == '0' || amountInEther == '' ||
      parseInt(amountInEther, 10) == 0
    ) {
      alert("Please enter redeem amount")
      return
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
    console.log("amount", parseInt(redeemAmount, 10), amountInEther, parseFloat(redeemAmount))

    if (isNaN(parseFloat(outputAmount))) {
      alert("Please do not enter alphabet as input amount")
      return
    }
    if (parseInt(outputAmount, 10) < 1) {
      console.log(parseInt(outputAmount, 10))
      //alert("Please ensure output amount of at least 1 wei")
      //return
    }

    writeContract({
      address: somtamOperAddr as Address,
      abi: [{"type":"function","name":"redeem","inputs":[{"name":"seller","type":"address","internalType":"address"},{"name":"somtam_amount","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"}],
      functionName: "redeem",
      args: [myaddress as Address, BigInt(parseFloat(redeemAmount))],
    });

    console.log(colAddr, amountInEther)
  }

  const handleRedeemApprove = async (e: any) => {
    e.preventDefault() // prevents page reload
    const amountInEther = redeemAmount;
    const somtamOperAddr = SOMTAMOPERATION_ADDR
    const somtamAddr = SOMTAM_ADDR
    let colAddr = USDC_ADDR;

    writeContract({
      address: somtamAddr as Address,
      abi: erc20Abi,
      functionName: "approve",
      args: [somtamOperAddr, (+amountInEther*1000000000000000000)],
    });

  }

  /*const unwatch1 = watchContractEvent(config, {
    address: SOMTAM_ADDR as Address,
    abi: erc20Abi,
    eventName: 'Transfer',
    onLogs(logs) {
      console.log('Transfer logs!', logs)
    },
    poll: true, 
    pollingInterval: 1_000, 
  })
  
  unwatch1();

  const unwatch2 = watchContractEvent(config, {
    address: SOMTAMOPERATION_ADDR as Address,
    abi: somtamOperationAbi,
    eventName: 'Redeem',
    onLogs(logs) {
      console.log('Redeem logs!', logs)
    },
    poll: true, 
    pollingInterval: 1_000, 
  })*/

  const handleError = (error: any): string => {
    if ((error as BaseError).shortMessage.includes("0x4abae946")) {
      return "No assets is found in reserve"
    } else if ((error as BaseError).shortMessage.includes("0x87c9fc34")) {
      return "Proxy implementation error"
    } else {
      return (error as BaseError).shortMessage || error.message
    }
  }

  return (
    <div className="appBody">
      <div className="swapContainer">
        <div className="swapHeader">
          <span className="swapText">Redeem</span>  
          &nbsp;
          
        </div>
                       
        <div className="">
          <FieldCurrency
            field="input"
            tokenName="SOMTAM"
            balance={somtamBalance}
            onAmount={setRedeemAmount} />
          <div className="row currencyInput">
            <div className="col-md-6 currencyInputField">
              {outputAmount}&nbsp;wei
            </div>
            <div className="col-md-6 tokenContainer">
              <span className="tokenName">{tokenName}</span>
              <div className="balanceContainer">
                <span className="balanceAmount">Balance: {tokenBalance} wei</span>
              </div>              
            </div>
          </div>
        </div>
        <div className="swapButtonContainer">
          <button type="submit" className="swapButton" onClick={handleRedeem}>
            Redeem 
          </button>

          {redeemMsg && (
            <div>{redeemMsg}</div>
          )}
          {error && (
            <div>Error: { error && handleError(error)}</div>
          )}
        </div>
      </div>
    </div>
  )    
}
