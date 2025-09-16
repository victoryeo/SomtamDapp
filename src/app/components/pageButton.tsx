import React, { useEffect, useState, useReducer } from 'react'
import { useRouter, usePathname } from 'next/navigation';
   
export const PageButton = (props: any) => {
  const [activeButtonIndex, setActiveButtonIndex] = useState(0);
  const router = useRouter()
  const name: string = props.name

  const handleSelection = (e: any) => {
    console.log("handleSelection", e, activeButtonIndex)
    setActiveButtonIndex(e)
    router.push(`/${name.toLowerCase()}`)
  }

  useEffect(()=>{
    console.log("state changed", activeButtonIndex)
    forceUpdate()
  }, [activeButtonIndex])

  const [, forceUpdate] = useReducer(x => x + 1, 0);

  return (

      <button   
        type="submit"
        className={props.index === activeButtonIndex ? "bg-blue font-bold mr-2 py-2 px-4 border-radius" : "bg-grey font-bold mr-2 py-2 px-4"}
        onClick={() => {handleSelection(props.index)}} >
        {props.name}
      </button>      
    
  )
}
