import React, { useState } from 'react'
import "../../app/swap.css"

export const FieldCurrency = (props: any) => {
  
  return (
    <div className="row currencyInput">
      <div className="col-md-6 numberContainer flex">
        {props.loading ? (
          <div className="spinnerContainer">
            <props.spinner />
          </div>
        ) : (
          <input
            className="currencyInputField"
            placeholder="0"
            value={props.value}
            onChange={(e)=>props.onAmount(e.target.value)}
          />
        )}&nbsp;wei
      </div>
      <div className="col-md-6 tokenContainer">
        <span className="tokenName">{props.tokenName}</span>
        <div className="balanceContainer">
          <span className="balanceAmount">Balance: {props.balance} wei</span>
        </div>
      </div>
    </div>
  )
}
