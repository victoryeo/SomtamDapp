import React from "react";
import { tokenList } from '@/config/tokenList';

export const TokenDialog = (props : any) => {
    if (!props.isOpen) return null;

    return (
        <div
          style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
          }}
        >
          <div
            style={{
                background: "white",
                height: 280,
                width: 240,
                margin: "auto",
                padding: "2%",
                border: "2px solid #000",
                borderRadius: "10px",
                boxShadow: "2px solid black",
            }}
            >
              <div className="row">
                <label className="labelField">Selected Collateral</label>
              </div>
              <div className="row">
              <div className="col-md-9 fieldContainer">
                <input
                  width="240"
                  className="currencyInputField"
                  placeholder="USDC"
                  value={props.tokenName}
                  onChange={e => props.setTokenName(e.target.value)}
                />
              </div>
              <div className="col-md-9 fieldContainer">
              {
                tokenList.map(ch => 
                  <div key={ch.index} className="longButton" onClick={e => props.setTokenName(ch.name)}>{ch.name}</div>
                )
              }                
              </div>              
              <hr/>
              <button className="generalButton" onClick={props.onClose}>Close</button>
            </div>              
          </div>
        </div>
    );
};