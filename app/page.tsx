
let title: string = "Weather App";

type ButtonProps = {
  text: string;
  color?: string;
}
const Button = (props: ButtonProps) => {
  const { text, color } = props;
  return (
    <button>
      {text} 
    </button>
  );
}

function Page() {
  return (
    <div>
      <Button text = {title} color = "orange"/>
    </div>
  );
}

export default Page;