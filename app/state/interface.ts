// Define the structure for our tree data table
export type TreeNode = {
  id: string
  name: string
  type: 'folder' | 'file'
  children?: TreeNode[]
  content?: NestedContent[]
}

export type IntervalGrouping = {
  data: string
  interval: string
  result: { [key: string]: number[] }
}

export interface NestedContent {
  id: string
  type: 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object'
  key?: string
  value?: string
  children?: NestedContent[]
}

export type DataTable = {
  data: {
    id: string;
    x: string;
    y: string;
  }[]
}

// Define the structure for our global state
export type GlobalState = {
  intervalGrouping: IntervalGrouping
  dataTable: DataTable
  functionPlotter: {
    selectedFunction: string
    customFunction: string
    selectedRange: number[] | 'custom'
    customRange: string
  }
  treeDataTable: TreeNode
}

// Define action types
export type Action =
  | { type: 'SET_INTERVAL_GROUPING'; payload: Partial<GlobalState['intervalGrouping']> }
  | { type: 'SET_DATA_TABLE'; payload: Partial<GlobalState['dataTable']> }
  | { type: 'SET_FUNCTION_PLOTTER'; payload: Partial<GlobalState['functionPlotter']> }
  | { type: 'SET_TREE_DATA_TABLE'; payload: TreeNode }
  | { type: 'IMPORT_STATE'; payload: GlobalState }
