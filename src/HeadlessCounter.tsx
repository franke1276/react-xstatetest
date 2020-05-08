import { useMachine } from "@xstate/react"
import { assign, createMachine, State } from "xstate"

export type DnDContext = {
    counter: number
  } 
  
  export type CountEvent = {type: 'COUNT' , value: string}
  export type ResetEvent = {type: 'RESET'}
  
  export type DnDEvents = CountEvent | ResetEvent
  
  export type DnDState = {
    value: "Init"
    context: DnDContext 
  } | {
    value: "Counting"
    context: DnDContext
  } | {
    value: "Max"
    context: DnDContext & {
        msg: string
    }
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
        entry: ['assingMsg'],
        meta: {
            msg: "MAX@!"
          },
        on: {
          'RESET': {
            target: 'Init',
            internal: false
          }
          
        }
      },
    }
  })

  const machineOptions = {
    guards: {
      isMax: (ctx: DnDContext)=> ctx.counter > 5
    },
    actions: {
      count: assign<DnDContext>({counter: (ctx) => ctx.counter + 1}),
      reset: assign<DnDContext>({counter: () => 0}),
      assingMsg: assign({msg: (ctx) => "MAX!!@!"}),
    }
  }

  export type API = {
    state: State<DnDContext, DnDEvents, any, DnDState> 
    count: ()=> void,
    reset: ()=> void
  }
export type Props = {
    children: (api: API) => JSX.Element
}

export const HeadlessCounter =  (p: Props) => {
    const [state, send] = useMachine(machine, {
        ...machineOptions,
        context: {
            counter: 0
        },
        devTools: true
    })

    const {children,...counterProps} = p
    return children({
        state: state, 
        count(){send({type : 'COUNT', value: "Click"})}, 
        reset(){send({type : 'RESET'})}   
    })
}