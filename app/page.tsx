"use client";

import {Dispatch, SetStateAction, useState} from "react";

let title: string = "Weather App";

type ButtonProps = {
  setCount: Dispatch<SetStateAction<number>>
}

function Button({setCount}: ButtonProps){

  return (
    <button onClick = {() => setCount(5)}>
      {title} 
    </button>
  );
}

function Page() {
  const[count, setCount] = useState<number>(0)
  
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>{count}</h1>
      <Button
        setCount = {setCount}
      />
          
    </div>
  );
}

export default Page;