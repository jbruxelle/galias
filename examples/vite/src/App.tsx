import { Counter } from "$counter";
import { Logotype } from "$logotype";
import "./App.css";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

function App() {
  return (
    <>
      <div>
        <Logotype
          link="https://vitejs.dev"
          image={{ src: viteLogo, alt: "Vite logo" }}
        />
        <Logotype
          link="https://react.dev"
          image={{ src: reactLogo, alt: "React logo" }}
        />
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <Counter />
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
