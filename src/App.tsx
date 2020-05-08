import React from 'react';
import './App.css';
import { createMachine, assign } from 'xstate';
import { useMachine } from '@xstate/react';
import styled from 'styled-components';
import { HeadlessCounter } from './HeadlessCounter';

const Wrapper = styled.div`
  background: yellow;
  color: black;
  padding: 10px;
`;



function App() {
  return (
    <div className="App" data-testid="counter-screen">
      <header className="App-header">

      <HeadlessCounter>
        {counter => 
          <div>
            <div>Counter: <span data-testid="value-counter">{counter.state.context.counter}</span></div>
            {counter.state.matches("Max") ? <div>{counter.state.context.msg}</div>: null}
            <button disabled={counter.state.matches("Max")} data-testid="button-count" onClick={counter.count}>count</button>
            <button disabled={counter.state.matches("Init")} data-testid="button-reset" onClick={counter.reset}>reset</button>
          </div>
        }
      </HeadlessCounter>

      </header>
    </div>
  );
}

export default App;
