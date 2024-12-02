'use client'

import { useState, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useGlobalState } from '@/app/state/globalState'

type ChartType = 'bar' | 'line' | 'area'

export default function IntervalGroupingMultiVisualization() {
  const { state, dispatch } = useGlobalState()
  const { data, interval, result } = state.intervalGrouping
  const [chartType, setChartType] = useState<ChartType>('bar')

  const handleGrouping = () => {
    const numbers = data.split(',').map(Number).filter(n => !isNaN(n))
    const intervalSize = Number(interval)
    const grouped: { [key: string]: number[] } = {}

    numbers.forEach(num => {
      const groupKey = Math.floor(num / intervalSize) * intervalSize
      if (!grouped[groupKey]) {
        grouped[groupKey] = []
      }
      grouped[groupKey].push(num)
    })

    dispatch({ type: 'SET_INTERVAL_GROUPING', payload: { result: grouped } })
  }

  const chartData = useMemo(() => {
    return Object.entries(result).map(([interval, numbers]) => ({
      name: `[${interval}, ${Number(interval) + Number(interval) - 1}]`,
      count: numbers.length,
      average: numbers.reduce((sum, num) => sum + num, 0) / numbers.length,
    }))
  }, [result])

  const renderChart = () => {
    const chartProps = {
      width: 500,
      height: 300,
      data: chartData,
      margin: { top: 5, right: 0, left: 0, bottom: 5 },
    }

    switch (chartType) {
      case 'bar':
        return (
          <BarChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--primary))" />
            <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--secondary))" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="count" fill="hsl(var(--primary))" name="Count" />
            <Bar yAxisId="right" dataKey="average" fill="hsl(var(--secondary))" name="Average" />
          </BarChart>
        )
      case 'line':
        return (
          <LineChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--primary))" />
            <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--secondary))" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="count" stroke="hsl(var(--primary))" name="Count" />
            <Line yAxisId="right" type="monotone" dataKey="average" stroke="hsl(var(--secondary))" name="Average" />
          </LineChart>
        )
      case 'area':
        return (
          <AreaChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--primary))" />
            <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--secondary))" />
            <Tooltip />
            <Legend />
            <Area yAxisId="left" type="monotone" dataKey="count" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} name="Count" />
            <Area yAxisId="right" type="monotone" dataKey="average" stroke="hsl(var(--secondary))" fill="hsl(var(--secondary))" fillOpacity={0.3} name="Average" />
          </AreaChart>
        )
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Agrupamento de Intervalos com Múltiplas Visualizações</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="data">Digite os números (separados por vírgula)</Label>
          <Input
            id="data"
            value={data}
            onChange={(e) => dispatch({ type: 'SET_INTERVAL_GROUPING', payload: { data: e.target.value } })}
            placeholder="1,2,3,4,5,6,7,8,9,10"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="interval">Digite o tamanho do intervalo</Label>
          <Input
            id="interval"
            value={interval}
            onChange={(e) => dispatch({ type: 'SET_INTERVAL_GROUPING', payload: { interval: e.target.value } })}
            placeholder="3"
          />
        </div>
        <Button onClick={handleGrouping}>Agrupar Dados</Button>

        {Object.keys(result).length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Resultado Agrupado:</h3>
              <Select value={chartType} onValueChange={(value: ChartType) => setChartType(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Selecione o tipo de gráfico" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Gráfico de Barras</SelectItem>
                  <SelectItem value="line">Gráfico de Linhas</SelectItem>
                  <SelectItem value="area">Gráfico de Área</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              {renderChart()}
            </ResponsiveContainer>
            <div className="mt-4">
              <h4 className="text-md font-semibold">Agrupamento Detalhado:</h4>
              <pre className="bg-muted p-2 rounded-md overflow-x-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

