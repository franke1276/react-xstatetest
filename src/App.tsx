import React from 'react';
import './App.css';
import { createMachine, assign } from 'xstate';
import { useMachine } from '@xstate/react';


type DnDContext = {
  counter: number
}

type CountEvent = {type: 'COUNT'}
type ResetEvent = {type: 'RESET'}

type DnDEvents = CountEvent | ResetEvent

type DnDState = {
  value: "Init"
  context: DnDContext & {
    counter: 0
  }
} | {
  value: "Counting"
  context: DnDContext
} | {
  value: "Max"
  context: DnDContext
}


export const machine = createMachine<DnDContext, DnDEvents, DnDState>({
  id: "dnd",
  initial: "Init",
  states: {
    Init: {
      entry: 'reset',
      on: {
        'COUNT': {
          target: 'Counting',
        }
      }
    },
    Counting:{
      entry: 'count',
      on: {

        'RESET': {
          target: 'Init',
          internal: false
        },
        'COUNT': [{
          target: 'Max',
          cond: 'isMax',
        },
        {
          target: 'Counting',
          internal: false
        }
      ]
      } 
    },
    Max: {
      on: {
        'RESET': {
          target: 'Init',
          internal: false
        }
        
      }
    },
  }
}, {
  guards: {
    isMax: (ctx: DnDContext)=> ctx.counter > 5
  },
  actions: {
    count: assign<DnDContext>({counter: (ctx) => ctx.counter + 1}),
    reset: assign<DnDContext>({counter: (ctx) => 0})
  }
})

function App() {
  const [state, send] = useMachine(machine, {devTools: true})
  return (
    <div className="App" data-testid="counter-screen">
      <header className="App-header">

        <div>Counter: <span data-testid="value-counter">{state.context.counter}</span></div>
        <button disabled={state.matches("Max")} data-testid="button-count" onClick={()=> send({type: 'COUNT'})}>count</button>
        <button disabled={state.matches("Init")} data-testid="button-reset" onClick={()=> send({type: 'RESET'})}>reset</button>
      </header>
    </div>
  );
}

export default App;
