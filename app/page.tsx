"use client";

import React from "react";

let title: string = "Weather App";

type ButtonProps = {
  children: React.ReactNode; 
  // JSX.Element; from React 18, ReactNode is more appropriate for 
  // children as it can represent any renderable content, including 
  // strings, numbers, fragments, and arrays of elements.
}

function Button({children}: ButtonProps){
  return (
    <button >
      {title} 
    </button>
  );
}

function Page() {
  return (
    <div>
      <Button>
          Click
      </Button>
    </div>
  );
}

export default Page;