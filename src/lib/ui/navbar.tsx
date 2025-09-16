'use client';

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation';
import { PageButton } from '@/app/components/pageButton';

export const Navbar = () => {
    const router = useRouter()
    const [activeButtonIndex, setActiveButtonIndex] = useState(0);

    const handleSelection = (e: any) => {
        console.log("handleSelection", e, activeButtonIndex)
        setActiveButtonIndex(e)
    }
    
    const buttonList = [
        {
            name: "Mint",
            index: 1,
            selected: false,
        },
        {
            name: "Redeem",
            index: 2,
            selected: false,
        },
        {
            name: "Faucet",
            index: 3,
            selected: false,
        }
    ]
    
    return (
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="buttonContainer">
          {
            buttonList.map(ch => 
              <PageButton name={ch.name} index={ch.index} key={ch.index} />)
          }
      </div>  
      </nav>
    )
}