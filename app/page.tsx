
let title: string = "Weather App";
type ButtonProps = {
  style: React.CSSProperties;
}

const Button = ({style}: ButtonProps) => {
  return (
    <button style={style}>
      {title} 
    </button>
  );
}

function Page() {
  return (
    <div>
      <Button style = {{backgroundColor: "orange", fontSize: 16}}/>
    </div>
  );
}

export default Page;