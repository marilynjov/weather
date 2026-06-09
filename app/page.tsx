"use client";
let title: string = "Weather App";

type ButtonProps = {
  onClick: (text: string) => void;
}

function Button({onClick}: ButtonProps){
  return (
    <button onClick={() => onClick("Clicked")} >
      {title} 
    </button>
  );
}

function Page() {
  return (
    <div>
      <Button 
        onClick ={() => {
          console.log("Button clicked!");
        }}
      />
    </div>
  );
}

export default Page;