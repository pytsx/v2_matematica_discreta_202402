'use client'

import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useGlobalState } from '@/app/state/globalState'

interface DataItem {
  id: string;
  x: string;
  y: string;
}

type ChartType = 'line' | 'bar' | 'scatter'

export default function MultiGraphDisplay() {
  const {
    state,
    dispatch
  } = useGlobalState()

  const [newRow, setNewRow] = useState<DataItem>({ id: '', x: '', y: '' })
  const [chartType, setChartType] = useState<ChartType>('line')

  const handleAddRow = () => {
    if (newRow.x !== '' && newRow.y !== '') {
      dispatch({ type: 'SET_DATA_TABLE', payload: { data: [...state.dataTable.data, { ...newRow, id: uuidv4() }] } })
      setNewRow({ id: '', x: '', y: '' })
    }
  }

  const handleUpdateRow = (id: string, key: 'x' | 'y', value: string) => {
    dispatch({ type: 'SET_DATA_TABLE', payload: { data: state.dataTable.data.map(row => row.id === id ? { ...row, [key]: value } : row) } })
  }

  const handleDeleteRow = (id: string) => {
    dispatch({ type: 'SET_DATA_TABLE', payload: { data: state.dataTable.data.filter(row => row.id !== id) } })
  }

  const renderChart = () => {
    const chartProps = {
      data: state.dataTable.data.map(item => ({ ...item, x: Number(item.x), y: Number(item.y) })),
      margin: { top: 5, right: 10, left: 0, bottom: 5 },
    }

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" type="number" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="y" stroke="hsl(var(--primary))" />
          </LineChart>
        )
      case 'bar':
        return (
          <BarChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" type="number" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="y" fill="hsl(var(--primary))" />
          </BarChart>
        )
      case 'scatter':
        return (
          <ScatterChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" type="number" />
            <YAxis dataKey="y" type="number" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Legend />
            <Scatter name="Dados" data={chartProps.data} fill="hsl(var(--primary))" />
          </ScatterChart>
        )
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gráfico Interativo</h2>
        <Select value={chartType} onValueChange={(value: ChartType) => setChartType(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione o tipo de gráfico" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="line">Gráfico de Linha</SelectItem>
            <SelectItem value="bar">Gráfico de Barra</SelectItem>
            <SelectItem value="scatter">Gráfico de Dispersão</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        {renderChart()}
      </ResponsiveContainer>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>X</TableHead>
            <TableHead>Y</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {state.dataTable.data.map(row => (
            <TableRow key={row.id}>
              <TableCell>
                <Input
                  value={row.x}
                  onChange={(e) => handleUpdateRow(row.id, 'x', e.target.value)}
                  type="number"
                />
              </TableCell>
              <TableCell>
                <Input
                  value={row.y}
                  onChange={(e) => handleUpdateRow(row.id, 'y', e.target.value)}
                  type="number"
                />
              </TableCell>
              <TableCell>
                <Button onClick={() => handleDeleteRow(row.id)} variant="destructive" size="sm">
                  Excluir
                </Button>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell>
              <Input
                value={newRow.x}
                onChange={(e) => setNewRow({ ...newRow, x: e.target.value })}
                placeholder="Digite X"
                type="number"
              />
            </TableCell>
            <TableCell>
              <Input
                value={newRow.y}
                onChange={(e) => setNewRow({ ...newRow, y: e.target.value })}
                placeholder="Digite Y"
                type="number"
              />
            </TableCell>
            <TableCell>
              <Button onClick={handleAddRow}>Adicionar Linha</Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

