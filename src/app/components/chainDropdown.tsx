import React, { useState } from 'react';

export const ChainDropdown = (props: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState('ethereum');

  const handleChange = (e: any) => {
    setValue(e.target.value);
  };

  return (
    <div>
      <select value={value} onChange={
        (e) => {handleChange(e); props.onChain(e)}}>
          {props.chains.map((chain: any) => (
          <option key={chain.index} value={chain.value}>{chain.label}</option>
          ))}
      </select>
    </div>
  );
}