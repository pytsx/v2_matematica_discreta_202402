'use client'

import React, { useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const predefinedFunctions = [
  { name: 'Sin', func: 'Math.sin(x)' },
  { name: 'Cos', func: 'Math.cos(x)' },
  { name: 'Tan', func: 'Math.tan(x)' },
  { name: 'x^2', func: 'Math.pow(x, 2)' },
  { name: 'x^3', func: 'Math.pow(x, 3)' },
  { name: 'x^4', func: 'Math.pow(x, 4)' },
  { name: 'Sqrt', func: 'Math.sqrt(x)' },
  { name: 'Log', func: 'Math.log(x)' },
  { name: 'Exp', func: 'Math.exp(x)' },
  { name: 'Abs', func: 'Math.abs(x)' },
  { name: 'Round', func: 'Math.round(x)' },
  { name: 'Ceil', func: 'Math.ceil(x)' },
  { name: 'Floor', func: 'Math.floor(x)' },
  { name: '1/x', func: '1 / x' },
];

const predefinedRanges = [
  { name: '[-10, 10]', range: [-10, 10] },
  { name: '[-5, 5]', range: [-5, 5] },
  { name: '[0, 10]', range: [0, 10] },
  { name: '[-π, π]', range: [-Math.PI, Math.PI] },
]

type ChartType = 'line' | 'bar' | 'area'

export default function EnhancedFunctionPlotter() {

  const [selectedFunction, setSelectedFunction] = useState(predefinedFunctions[0].func)
  const [customFunction, setCustomFunction] = useState('')
  const [selectedRange, setSelectedRange] = useState<number[] | 'custom'>(predefinedRanges[0].range)
  const [customRange, setCustomRange] = useState('')
  const [steps, setSteps] = useState(100)
  const [data, setData] = useState<{ x: number; y: number }[]>([])
  const [error, setError] = useState<string | null>(null)
  const [chartType, setChartType] = useState<ChartType>('line')

  const handlePlot = useCallback(() => {
    setError(null)
    try {
      const func = new Function('x', `return ${selectedFunction === 'custom' ? customFunction : selectedFunction}`)
      const [min, max] = typeof selectedRange === 'string' && selectedRange === 'custom' ? JSON.parse(customRange) : selectedRange
      const step = (max - min) / (steps - 1)
      const newData = []
      for (let i = 0; i < steps; i++) {
        const x = min + i * step
        const y = func(x)

        if (isNaN(y) || !isFinite(y)) {
          throw new Error(`Resultado inválido para x = ${x}`)
        }
        newData.push({ x, y })
      }
      setData(newData)
    } catch (err) {
      setError(`Erro: ${err instanceof Error ? err.message : String(err)}`)
      setData([])
    }
  }, [selectedFunction, customFunction, selectedRange, customRange, steps])

  const renderChart = () => {
    const chartProps = {
      width: 500,
      height: 300,
      data: data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    }

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="y" stroke="hsl(var(--primary))" dot={false} />
          </LineChart>
        )
      case 'bar':
        return (
          <BarChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="y" fill="hsl(var(--primary))" />
          </BarChart>
        )
      case 'area':
        return (
          <AreaChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="y" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
          </AreaChart>
        )
    }
  }

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <div>
        <Label htmlFor="function">Selecione a função</Label>
        <Select onValueChange={setSelectedFunction} defaultValue={selectedFunction}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione a função" />
          </SelectTrigger>
          <SelectContent>
            {predefinedFunctions.map((f) => (
              <SelectItem className='font-extrabold' key={f.name} value={f.func}>{f.name} <span className='opacity-80 text-xs font-mono'>{f.func}</span></SelectItem>
            ))}
            <SelectItem value="custom">Personalizado</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {selectedFunction === 'custom' && (
        <div>
          <Label htmlFor="customFunction">Digite a função personalizada (em termos de x)</Label>
          <Input id="customFunction" value={customFunction} onChange={(e) => setCustomFunction(e.target.value)} placeholder="Math.sin(x)" />
        </div>
      )}
      <div>
        <Label htmlFor="range">Selecione o intervalo</Label>
        <Select onValueChange={(value) => setSelectedRange(value === 'custom' ? 'custom' : predefinedRanges.find(r => r.name === value)!.range)} defaultValue={predefinedRanges[0].name}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione o intervalo" />
          </SelectTrigger>
          <SelectContent>
            {predefinedRanges.map((r) => (
              <SelectItem key={r.name} value={r.name}>{r.name}</SelectItem>
            ))}
            <SelectItem value="custom">Personalizado</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {selectedRange === 'custom' && (
        <div>
          <Label htmlFor="customRange">Digite o intervalo personalizado [min, max]</Label>
          <Input id="customRange" value={customRange} onChange={(e) => setCustomRange(e.target.value)} placeholder="[-10, 10]" />
        </div>
      )}
      <div>
        <Label htmlFor="steps">Número de passos</Label>
        <Input
          id="steps"
          type="number"
          value={steps}
          onChange={(e) => setSteps(Math.max(2, parseInt(e.target.value) || 2))}
          min="2"
          max="1000"
        />
      </div>
      <Button onClick={handlePlot}>Plotar Função</Button>
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {data.length > 0 && (
        <>
          <div>
            <Label htmlFor="chartType">Selecione o tipo de gráfico</Label>
            <Select onValueChange={(value: ChartType) => setChartType(value)} defaultValue={chartType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o tipo de gráfico" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="line">Gráfico de Linha</SelectItem>
                <SelectItem value="bar">Gráfico de Barra</SelectItem>
                <SelectItem value="area">Gráfico de Área</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            {renderChart()}
          </ResponsiveContainer>
          <div>
            <h3 className="text-lg font-semibold mb-2">Tabela de Dados</h3>
            <div className="max-h-60 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>X</TableHead>
                    <TableHead>Y</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((point, index) => (
                    <TableRow key={index}>
                      <TableCell>{point.x.toFixed(2)}</TableCell>
                      <TableCell>{point.y.toFixed(4)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

