'use client';

import React, { useState, useEffect } from 'react'
import { Address, parseEther, formatEther } from "viem";
import { readContract, writeContract } from '@wagmi/core'
import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { FieldCurrency } from './fieldCurrency'
import { erc20Abi } from '@/config/abi/erc20Abi';
import { config } from '../config';
import { Hex, hexToNumber, pad, slice, toHex, TypedDataDomain } from "viem";
import { parseGwei } from 'viem'

type SendParam = {
  dstEid: number,
  to: `0x${string}`,
  amountLD: bigint,
  minAmountLD: bigint,
  extraOptions: `0x${string}`,
  composeMsg: `0x${string}`,
  oftCmd: `0x${string}`,
}

type MessagingFee = {
  nativeFee: bigint,
  lzTokenFee: bigint,
}

export const FieldTransfer = () => {
  const [swapAmount, setSwapAmount] = useState("0");
  const [outputAmount, setOutputAmount] = useState("0");
  const { address: myaddress } = useAccount();
  const [somtamBalance, setSomtamBalance] = useState('0');
  const [destinationAddress, setDestinationAddress] = useState('0x70997970C51812dc3A010C7d01b50e0d17dc79C8');

  const handleSend = async (e: any) => {
    e.preventDefault() // prevents page reload

    const endpointData = await readContract(config, {
      address: process.env.NEXT_PUBLIC_SOMTAM_ADDR as Address,
      abi: [{"type":"function","name":"endpoint","inputs":[],"outputs":[{"name":"","type":"address","internalType":"contract ILayerZeroEndpointV2"}],"stateMutability":"view"},],
      functionName: 'endpoint',
      args: []
    })
    console.log(endpointData)

    console.log(destinationAddress)
    // pad to bytes32 
    const bytes32DestAddr ='0x'.concat(destinationAddress.slice(2).padStart(64, '0'))
    console.log(bytes32DestAddr, BigInt(parseInt(swapAmount, 10)))

    const sendParam: SendParam = {
      dstEid: 2,
      to: bytes32DestAddr as `0x${string}`,
      amountLD: BigInt(swapAmount),
      minAmountLD: BigInt(swapAmount),
      extraOptions: `0x1`,  // TBC: dummy value for now
      composeMsg: "" as `0x${string}`,
      oftCmd: "" as `0x${string}`
    }

    /*const eidData = await readContract(config, {
      address: process.env.NEXT_PUBLIC_SOMTAM_ADDR as Address,
      abi: [{"type":"function","name":"eid","inputs":[],"outputs":[{"name":"","type":"uint32","internalType":"uint32"}],"stateMutability":"view"}],
      functionName: 'eid',
      args: []
    })
    console.log(eidData)*/  

    const oAppVer = await readContract(config, {
      address: process.env.NEXT_PUBLIC_SOMTAM_ADDR as Address,
      abi: [{"type":"function","name":"oAppVersion","inputs":[],"outputs":[{"name":"senderVersion","type":"uint64","internalType":"uint64"},{"name":"receiverVersion","type":"uint64","internalType":"uint64"}],"stateMutability":"pure"}],
      functionName: 'oAppVersion',
      args: []
    })
    console.log(oAppVer)

    const data = await readContract(config, {
      address: process.env.NEXT_PUBLIC_SOMTAM_ADDR as Address,
      abi: [{"type":"function","name":"quoteSend","inputs":[{"name":"_sendParam","type":"tuple","internalType":"struct SendParam","components":[{"name":"dstEid","type":"uint32","internalType":"uint32"},{"name":"to","type":"bytes32","internalType":"bytes32"},{"name":"amountLD","type":"uint256","internalType":"uint256"},{"name":"minAmountLD","type":"uint256","internalType":"uint256"},{"name":"extraOptions","type":"bytes","internalType":"bytes"},{"name":"composeMsg","type":"bytes","internalType":"bytes"},{"name":"oftCmd","type":"bytes","internalType":"bytes"}]},{"name":"_payInLzToken","type":"bool","internalType":"bool"}],"outputs":[{"name":"msgFee","type":"tuple","internalType":"struct MessagingFee","components":[{"name":"nativeFee","type":"uint256","internalType":"uint256"},{"name":"lzTokenFee","type":"uint256","internalType":"uint256"}]}],"stateMutability":"view"}],
      functionName: 'quoteSend',
      args: [sendParam, false]
    })

    const msgFee = data as MessagingFee
    console.log(msgFee)
    /*const msgFee: MessagingFee = {
      nativeFee: BigInt(1),  //TODO
      lzTokenFee: BigInt(1),  //TODO
    }*/

    let result      
    result = await writeContract(config, {
      address: process.env.NEXT_PUBLIC_SOMTAM_ADDR as Address,
      abi: [{"type":"function","name":"send","inputs":[{"name":"_sendParam","type":"tuple","internalType":"struct SendParam","components":[{"name":"dstEid","type":"uint32","internalType":"uint32"},{"name":"to","type":"bytes32","internalType":"bytes32"},{"name":"amountLD","type":"uint256","internalType":"uint256"},{"name":"minAmountLD","type":"uint256","internalType":"uint256"},{"name":"extraOptions","type":"bytes","internalType":"bytes"},{"name":"composeMsg","type":"bytes","internalType":"bytes"},{"name":"oftCmd","type":"bytes","internalType":"bytes"}]},{"name":"_fee","type":"tuple","internalType":"struct MessagingFee","components":[{"name":"nativeFee","type":"uint256","internalType":"uint256"},{"name":"lzTokenFee","type":"uint256","internalType":"uint256"}]},{"name":"_refundAddress","type":"address","internalType":"address"}],"outputs":[{"name":"msgReceipt","type":"tuple","internalType":"struct MessagingReceipt","components":[{"name":"guid","type":"bytes32","internalType":"bytes32"},{"name":"nonce","type":"uint64","internalType":"uint64"},{"name":"fee","type":"tuple","internalType":"struct MessagingFee","components":[{"name":"nativeFee","type":"uint256","internalType":"uint256"},{"name":"lzTokenFee","type":"uint256","internalType":"uint256"}]}]},{"name":"oftReceipt","type":"tuple","internalType":"struct OFTReceipt","components":[{"name":"amountSentLD","type":"uint256","internalType":"uint256"},{"name":"amountReceivedLD","type":"uint256","internalType":"uint256"}]}],"stateMutability":"payable"}],
      functionName: "send",
      args: [sendParam, msgFee, myaddress||'0x0'],
      value: msgFee.nativeFee, 
    });
    console.log(result)
  }

  useEffect(()=> {

    if (swapAmount === "0") {
      console.log("amount 0")
      setOutputAmount("0.0")
    }
    else {
      console.log(swapAmount, "amount not 0")
      setOutputAmount((+swapAmount*1).toString())
    }
  }, [swapAmount])


  useEffect(()=> {

    const getSOMTAM = async () => {
      const data = await readContract(config, {
        address: process.env.NEXT_PUBLIC_SOMTAM_ADDR as Address,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [myaddress]
      })
      return data
    }

    try {
      getSOMTAM().then((_data) => {
        const balance = String(_data)
        console.log('usdc', balance)
        setSomtamBalance(balance)
      });  
    } catch (e) {
      console.log(e)
    }
  }, [])

  return (
    <div className="appBody">
      <div className="swapContainer">
        <div className="swapHeader">
          <span className="swapText">Transfer</span>
        </div>
        <div className="chainSpace">   
          <div className="row currencyInput">
            <div className="col-md-6 currencyInputField">
              Destination Address
            </div>              
            <div className="col-md-6 tokenContainer">
              <span className="tokenName">
              <input
                className="amountInputField"
                placeholder="0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
                value={destinationAddress}
                onChange={(e)=>setDestinationAddress(e.target.value)}
              />
              </span>
            </div>
          </div>
        </div>
        <div className="">
          <FieldCurrency
            field="input"
            tokenName="SOMTAM"
            balance={somtamBalance}
            onAmount={setSwapAmount} />
        </div>
        <div className="swapButtonContainer">
          <button type="submit" className="swapButton" onClick={handleSend}>
            Send 
          </button>               
        </div>
      </div>
    </div>
  )
}
