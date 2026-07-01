"use client";

import {Dispatch, SetStateAction, useState, ComponentPropsWithoutRef, MouseEvent} from "react";

let title: string = "Weather App";

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
};


function Button({}: ButtonProps){
  
  // const handleClick = (e: MouseEvent<HTMLButtonElement, MouseEvent>) => {}
  function handleClick(e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>){}

  return (
    <button onClick={(handleClick) => {}}>
      {title} 
    </button>
  );
}

function Page() {
  
  return (
    <div>
      <Button>
        Click me
      </Button>
    </div>
  );
}

export default Page;