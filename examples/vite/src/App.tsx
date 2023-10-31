import reactLogo from './assets/react.svg';
import viteLogo from './vite.svg';

import { Counter } from '$counter';
import { Footer } from '$footer';
import { Header } from '$header';
import { Logotype } from '$logotype';
import { SomeComponent } from '$some-component';

import './App.css';

function App() {
  return (
    <>
      <div>
        <Header />
        <SomeComponent />
        <Logotype
          link="https://vitejs.dev"
          image={{ src: viteLogo, alt: 'Vite logo' }}
        />
        <Logotype
          link="https://react.dev"
          image={{ src: reactLogo, alt: 'React logo' }}
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
      <Footer />
    </>
  );
}

export default App;
