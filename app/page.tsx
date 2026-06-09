
let title: string = "Weather App";
type ButtonProps = {
  citiesTemp: Record<"London"|"New York"|"Tokyo", number>;
}

const Button = ({}: ButtonProps) => {
  return (
    <button >
      {title} 
    </button>
  );
}

function Page() {
  return (
    <div>
      <Button citiesTemp=
      {{'New York': 25, 'London': 18, 'Tokyo': 30}}
      />
    </div>
  );
}

export default Page;