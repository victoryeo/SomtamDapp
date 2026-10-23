import React, { useState, useEffect } from 'react'
import { readContract, writeContract as writeContractDirect} from 'wagmi/actions'
import { config } from '../config'
import { somtamAbi } from '@/config/abi/somtamAbi';
import { somtamOperationAbi } from '@/config/abi/somtamOperationAbi';
import { Address, parseEther, formatEther } from "viem";
import { useWriteContract, useAccount, type BaseError } from 'wagmi';
import { useWalletClient } from "wagmi";
import { utils } from "ethers";
import { erc20Abi } from '@/config/abi/erc20Abi';
import { signPermit } from '../permit/permit';
import { somtamContractAddr } from '@/config/contractAddress';
import { useTransactionCount } from 'wagmi'
import { AlertCircle, KeyRound, LayoutDashboard, Loader2, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export const FieldDashboard = () => {
  const [somtamBalance, setSomtamBalance] = useState('0');
  const { address: myaddress, chain } = useAccount();
  const { data, error: error, isPending: isPending, writeContract} = useWriteContract();
  const { data: defaultWalletClient } = useWalletClient()
  const [SOMTAM_ADDR, setSOMTAM_ADDR] = useState('0')
  const [SOMTAMOPERATION_ADDR, setSOMTAMOPERATION_ADDR] = useState('0')
  const [USDC_ADDR, setUSDC_ADDR] = useState('0')
  const [COLLATERAL_ADDR, setCOLLATERAL_ADDR] = useState('0')
  const { data: transactionCount, isLoading } = useTransactionCount({
    address: myaddress,
    // blockTag: 'latest' // or 'pending', 'earliest', 'safe', 'finalized'
  })

  const handleGrant = async (e: any) => {
    e.preventDefault() // prevents page reload
    const somtamAddr = SOMTAM_ADDR
    const somtamOperAddr = SOMTAMOPERATION_ADDR
    const minterRole = utils.keccak256(utils.toUtf8Bytes("MINTER_ROLE"))
    const managerRole = utils.keccak256(utils.toUtf8Bytes("ASSET_MANAGER_ROLE"))
    const operationRole = utils.keccak256(utils.toUtf8Bytes("SOMTAM_OPERATION_ROLE"))
    const redeemerRole = utils.keccak256(utils.toUtf8Bytes("REDEEMER_ROLE"))

    console.log("myaddress", myaddress)
    writeContract({
        address: somtamOperAddr as Address,
        abi: somtamOperationAbi,
        functionName: "grantRole",
        args: [minterRole, myaddress],
    });
    console.log("somtamOperAddr", somtamOperAddr)

    writeContract({
        address: somtamOperAddr as Address,
        abi: somtamOperationAbi,
        functionName: "grantRole",
        args: [redeemerRole, myaddress],
    });

    // TODO: to be removed in future
    writeContract({
      address: somtamAddr as Address,
      abi: somtamAbi,
      functionName: "grantRole",
      args: [redeemerRole, somtamOperAddr],
    });
    
    writeContract({
      address: somtamAddr as Address,
      abi: somtamAbi,
      functionName: "grantRole",
      args: [minterRole, somtamOperAddr],
    });
  }

  const handlePermit = async (e: any) => {
    const somtamAddr = SOMTAM_ADDR
    const usdcAddr = USDC_ADDR
    const somtamOperAddr = SOMTAMOPERATION_ADDR
    const colAddr = COLLATERAL_ADDR

    console.log("handlePermit", somtamAddr, colAddr, myaddress)
    try {
    //  Mock Token
    let mtNonce = await readContract(config, {
      address: colAddr as Address,
      abi: [{"type":"function","name":"nonces","inputs":[{"name":"owner","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"}],
      functionName: "nonces",
      args: [myaddress!],
    });
    const mtName = await readContract(config, {
      address: colAddr as Address,
      abi: erc20Abi,
      functionName: "name",
      args: []
    });

    let mtVersion = "1"; 
    const mtDeadline = BigInt(Math.floor(Date.now() / 1000) + 200_000)
    console.log(mtNonce, mtName, chain?.id, mtVersion, mtDeadline)
    console.log(transactionCount, somtamOperAddr, myaddress, colAddr)

    // Verify the token actually supports permit
    const supportsPermit = await readContract(config, {
      address: colAddr as Address,
      abi: [{"type":"function","name":"DOMAIN_SEPARATOR","inputs":[],"outputs":[{"name":"","type":"bytes32"}],"stateMutability":"view"}],
      functionName: "DOMAIN_SEPARATOR",
    });
    console.log("Supports EIP-2612:", !!supportsPermit);

    const mtSignature1 = await signPermit({
        contractAddress: colAddr as Address,
        erc20Name: mtName as string,        
        ownerAddress: myaddress as Address,
        spenderAddress: somtamOperAddr as Address,
        deadline: mtDeadline,
        chainId: chain?.id || 1,
        nonce: mtNonce,
        permitVersion: mtVersion,
        value: parseEther("10")
    });
    console.log(mtSignature1)

    let mtRes = await writeContractDirect(config, {
      address: colAddr as Address,
      abi: [{"type":"function","name":"permit","inputs":[{"name":"owner","type":"address","internalType":"address"},{"name":"spender","type":"address","internalType":"address"},{"name":"amount","type":"uint256","internalType":"uint256"},{"name":"deadline","type":"uint256","internalType":"uint256"},{"name":"v","type":"uint8","internalType":"uint8"},{"name":"r","type":"bytes32","internalType":"bytes32"},{"name":"s","type":"bytes32","internalType":"bytes32"}],"outputs":[],"stateMutability":"nonpayable"}],
      functionName: "permit",
      args: [myaddress as Address, somtamOperAddr as Address, parseEther("10"), mtDeadline, mtSignature1.v, mtSignature1.r, mtSignature1.s],     
    })
    console.log(mtRes)

    // nonce increase with every successful permit call, 
    // so we read the nonce value again
    mtNonce = await readContract(config, {
      address: colAddr as Address,
      abi: [{"type":"function","name":"nonces","inputs":[{"name":"owner","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"}],
      functionName: "nonces",
      args: [myaddress!],
    });
    console.log(mtNonce, mtName, mtVersion, mtDeadline)

    const mtValueAllowance1 = await readContract(config, {
      address: colAddr as Address,
      abi: erc20Abi,
      functionName: "allowance",
      args: [myaddress, somtamOperAddr],
    });
    console.log(mtValueAllowance1)

    // USDC
    let usdcNonce = await readContract(config, {
      address: usdcAddr as Address,
      abi: [{"type":"function","name":"nonces","inputs":[{"name":"owner","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"}],
      functionName: "nonces",
      args: [myaddress!],
    });
    const usdcName = await readContract(config, {
      address: usdcAddr as Address,
      abi: erc20Abi,
      functionName: "name",
      args: []
    });

    let permitVersion = await readContract(config, {
      address: usdcAddr as Address,
      abi: [{"type":"function","name":"version","inputs":[],"outputs":[{"name":"","type":"string","internalType":"string"}],"stateMutability":"view"}],
      functionName: "version",
      args: [],
    });
    console.log(permitVersion)

    let version = permitVersion;   //usdc is on version 2 
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 200_000)
    console.log(usdcNonce, usdcName, version, deadline)

    const signature1 = await signPermit({
        contractAddress: usdcAddr as Address,  //USDC
        erc20Name: usdcName as string,        
        ownerAddress: myaddress as Address,
        spenderAddress: somtamOperAddr as Address,
        deadline: deadline,
        chainId: chain?.id || 1,
        nonce: usdcNonce,
        permitVersion: version,
        value: parseEther("10")
    });
    console.log(signature1)

    let res = await writeContractDirect(config, {
      address: usdcAddr as Address,
      abi: [{"type":"function","name":"permit","inputs":[{"name":"owner","type":"address","internalType":"address"},{"name":"spender","type":"address","internalType":"address"},{"name":"amount","type":"uint256","internalType":"uint256"},{"name":"deadline","type":"uint256","internalType":"uint256"},{"name":"v","type":"uint8","internalType":"uint8"},{"name":"r","type":"bytes32","internalType":"bytes32"},{"name":"s","type":"bytes32","internalType":"bytes32"}],"outputs":[],"stateMutability":"nonpayable"}],
      functionName: "permit",
      args: [myaddress as Address, somtamOperAddr as Address, parseEther("10"), deadline, signature1.v, signature1.r, signature1.s],     
    })
    console.log(res)

    // nonce increase with every successful permit call, 
    // so we read the nonce value again
    usdcNonce = await readContract(config, {
      address: usdcAddr as Address,
      abi: [{"type":"function","name":"nonces","inputs":[{"name":"owner","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"}],
      functionName: "nonces",
      args: [myaddress!],
    });
    console.log(usdcNonce, usdcName, version, deadline)

    const valueAllowance1 = await readContract(config, {
      address: usdcAddr as Address,
      abi: erc20Abi,
      functionName: "allowance",
      args: [myaddress, somtamOperAddr],
    });
    console.log(valueAllowance1)

    // SOMTAM 
    const somtamNonce = await readContract(config, {
      address: somtamAddr as Address,
      abi: [{"type":"function","name":"nonces","inputs":[{"name":"owner","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"}],
      functionName: "nonces",
      args: [myaddress!],
    });
    const somtamName = await readContract(config, {
      address: somtamAddr as Address,
      abi: erc20Abi,
      functionName: "name",
      args: []
    });
    console.log(somtamNonce, somtamName, version, deadline)

    // the SOMTAM permit version is hardcoded to 1 in solidstate library
    version = '1';
    const signature3 = await signPermit({
      contractAddress: somtamAddr as Address,  //SOMTAM
      erc20Name: somtamName as string,        
      ownerAddress: myaddress as Address,
      spenderAddress: somtamOperAddr as Address,
      deadline: deadline,
      chainId: chain?.id || 1,
      nonce: somtamNonce,
      permitVersion: version,
      value: parseEther("10")
    });
    console.log(signature3)

    res = await writeContractDirect(config, {
      address: somtamAddr as Address,
      abi: [{"type":"function","name":"permit","inputs":[{"name":"owner","type":"address","internalType":"address"},{"name":"spender","type":"address","internalType":"address"},{"name":"amount","type":"uint256","internalType":"uint256"},{"name":"deadline","type":"uint256","internalType":"uint256"},{"name":"v","type":"uint8","internalType":"uint8"},{"name":"r","type":"bytes32","internalType":"bytes32"},{"name":"s","type":"bytes32","internalType":"bytes32"}],"outputs":[],"stateMutability":"nonpayable"}],
      functionName: "permit",
      args: [myaddress as Address, somtamOperAddr as Address, parseEther("10"), deadline, signature3.v, signature3.r, signature3.s],     
    })
    console.log(res)

    const valueAllowance3 = await readContract(config, {
      address: somtamAddr as Address,
      abi: erc20Abi,
      functionName: "allowance",
      args: [myaddress, somtamOperAddr],
    });
    console.log(valueAllowance3)
    } catch (e) {
      console.warn(e)
    }
  }

  useEffect(()=> {
    const getChain = () => {
      for (const chains of somtamContractAddr){
        if (chain?.id != undefined) {
          if (chains.ChainId == chain?.id) {
            console.log("matched", chains.ChainId, chains.Somtam)
            setSOMTAM_ADDR(chains.Somtam)
            setSOMTAMOPERATION_ADDR(chains.SomtamOperation)
            setUSDC_ADDR(chains.USDC)
            setCOLLATERAL_ADDR(chains.MockToken)
          }
        }
      }
    }

    try {
      getChain()
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

  return (
    <Card className="glass-card mx-auto w-full max-w-xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <LayoutDashboard className="h-5 w-5 text-primary" />
          Dashboard
        </CardTitle>
        <CardDescription>
          Check your SOMTAM balance and manage wallet permissions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-primary/15 via-black/20 to-cyan-400/10 p-5">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            SOMTAM Balance
          </p>
          <p className="mt-1 text-3xl font-semibold tracking-tight">
            {somtamBalance}
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              wei
            </span>
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Button onClick={handlePermit} className="gap-2">
            <KeyRound className="h-4 w-4" />
            ERC20 Permit
          </Button>
          <Button variant="outline" onClick={handleGrant} className="gap-2">
            <ShieldCheck className="h-4 w-4" />
            Grant Role
          </Button>
        </div>

        {isPending && (
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Confirm the transaction in your wallet...
          </p>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Transaction failed</AlertTitle>
            <AlertDescription>
              {(error as BaseError).shortMessage || error.message}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}