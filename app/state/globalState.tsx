"use client"

import { produce } from 'immer'
import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react'
import { Action, GlobalState } from './interface'


// Create initial state
const initialState: GlobalState = {
  intervalGrouping: {
    data: '',
    interval: '',
    result: {},
  },
  dataTable: {
    data: [],
  },
  functionPlotter: {
    selectedFunction: 'Math.sin(x)',
    customFunction: '',
    selectedRange: [-10, 10],
    customRange: '',
    steps: 100,
  },
  treeDataTable: { id: '0', name: 'Root', type: 'folder', children: [] },
}

// Create reducer
const reducer = produce((draft: GlobalState, action: Action) => {
  switch (action.type) {
    case 'SET_INTERVAL_GROUPING':
      Object.assign(draft.intervalGrouping, action.payload)
      break
    case 'SET_DATA_TABLE':
      Object.assign(draft.dataTable, action.payload)
      break
    case 'SET_FUNCTION_PLOTTER':
      Object.assign(draft.functionPlotter, action.payload)
      break
    case 'SET_TREE_DATA_TABLE':
      draft.treeDataTable = action.payload
      break
    case 'IMPORT_STATE':
      return action.payload
  }
})

// Create context
const GlobalStateContext = createContext<{
  state: GlobalState
  dispatch: React.Dispatch<Action>
} | undefined>(undefined)

// Create provider
export function GlobalStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    localStorage.setItem('globalState', JSON.stringify(state))
  }, [state])

  return (
    <GlobalStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalStateContext.Provider>
  )
}

// Create hook for using the global state
export function useGlobalState() {
  const context = useContext(GlobalStateContext)
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider')
  }
  return context
}

// Function to export state
export function exportState(state: GlobalState): string {
  return JSON.stringify(state)
}

// Function to import state
export function importState(jsonState: string): GlobalState {
  return JSON.parse(jsonState)
}

