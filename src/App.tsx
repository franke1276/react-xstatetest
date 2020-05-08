import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import styled from 'styled-components';

const Button = styled.button`
  background: palevioletred;
  border-radius: 3px;
  border: none;
  color: white;
`

function App() {
  const [counter,setCounter] = useState(0)

  return (
    <div className="App" data-testid="counter-screen">
      <header className="App-header">

        <Button>Test</Button>
        <div>Counter: <span data-testid="value-counter">{counter}</span></div>
        <button data-testid="button-count" onClick={()=> setCounter(counter + 1)}>count</button>
        <button data-testid="button-reset" onClick={()=> setCounter(0)}>reset</button>
      </header>
    </div>
  );
}

export default App;
