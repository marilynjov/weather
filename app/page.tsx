"use client";

import {Dispatch, SetStateAction, useState, ComponentPropsWithoutRef} from "react";

let title: string = "Weather App";

type ButtonProps = ComponentPropsWithoutRef<"button">


function Button({onClick, ...rest}: ButtonProps){
  const handleclick = () => {
    if (onclick) { 
      alert("Clicked")
    }
  }
  return (
    <button {...rest}>
      {title} 
    </button>
  );
}

function Page() {
  
  return (
    <div>
      <Button onClick = {() => alert("Welcome")}>

      </Button>
    </div>
  );
}

export default Page;