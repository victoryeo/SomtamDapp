'use client';

import React, { useState, useEffect } from 'react'
import "../../app/tabs.css"
import { FieldMint } from './fieldMint';
import { FieldRedeem } from './fieldRedeem';
import { FieldDashboard } from './fieldDashboard';
import { FieldFaucet } from './fieldFaucet';

export const NavbarTabs = () => {
  const [toggleTabs, setToggleTabs] = useState(1)

  const toggleTab = (index: number) => {
    setToggleTabs(index)
  } 

  useEffect(()=> {
    const getChain = () => {
      
    }
    try { 
      getChain()
    } catch (e) {
      console.log(e)
    }
  }, [])

  return (
    <div>
    <div className="tabContainer">
      <div className="bloc-tabs">
        <button className={toggleTabs === 1 ? "tabs active-tabs": "tabs"} onClick={()=>toggleTab(1)}>
          Dashboard
        </button>
        <button className={toggleTabs === 2 ? "tabs active-tabs": "tabs"} onClick={()=>toggleTab(2)}>
          Mint
        </button>
        <button className={toggleTabs === 3 ? "tabs active-tabs": "tabs"} onClick={()=>toggleTab(3)}>
          Redeem
        </button>
        <button className={toggleTabs === 4 ? "tabs active-tabs": "tabs"} onClick={()=>toggleTab(4)}>
          Faucet
        </button>
      </div>
      <div className="content-tabs">
        <div className={toggleTabs === 1 ? "content active-content": "content hidden-content"}>
          <div>
            <FieldDashboard />
          </div>
        </div>
        <div className={toggleTabs === 2 ? "content active-content": "content hidden-content"}>
          <div>
            <FieldMint />
          </div>
        </div>
        <div className={toggleTabs === 3 ? "content active-content": "content hidden-content"}>
          <div>
            <FieldRedeem />
          </div>
        </div>
        <div className={toggleTabs === 4 ? "content active-content": "content hidden-content"}>
          <div>
            <FieldFaucet />
          </div>
        </div>       
      </div>
    </div>
    </div>
  )
}