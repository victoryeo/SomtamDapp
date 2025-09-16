'use client'

import React, { ReactNode, useState, useEffect, createContext, useContext } from 'react';

interface AssetContextType {
    assetName: string;
    updateAssetName: (e: any) => void;
};

const AssetContextDefaultValues: AssetContextType = {
    assetName: "USDC",
    updateAssetName: (e: any) => {},
};

const AssetContext = createContext<AssetContextType | undefined>(AssetContextDefaultValues);

export const useAssetContext = () => {
    const context = useContext(AssetContext);
    if (!context) {
      throw new Error(
        'useContext must be used'
      );
    }
    return context;
};

interface AssetProps {
    children:  ReactNode;
};

export const AssetProvider: React.FC<AssetProps> = ({
    children,
  }) => {
    const [assetName, setAssetName] = useState<string>("USDC");


    const updateAssetName = (e: any) => {
        console.log("updateAssetName", e)
        setAssetName(e)
    };

    return (
        <>
            <AssetContext.Provider value={{ assetName, updateAssetName }}>
                {children}
            </AssetContext.Provider>
        </>
    );
}