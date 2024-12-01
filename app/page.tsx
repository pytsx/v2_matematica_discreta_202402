'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import IntervalGrouping from '@/components/IntervalGrouping'
import FunctionPlotter from '@/components/FunctionPlotter'
import DynamicTree from '@/components/DynamicTree'
import MultiGraphDisplay from '@/components/MultiGraphDisplay'
import AlgorithmFlowchart from '@/components/AlgorithmFlowchart'
import { GlobalStateProvider } from './state/globalState'
import StateManagement from '@/components/StateManagement'
import React from "react"

export default function Dashboard() {
  const [hydrated, setHydrated] = React.useState(false) // Ensure client-side rendering

  React.useEffect(() => {
    setHydrated(true) // Hydration is complete
  }, [])

  if (!hydrated) return null // Avoid rendering until hydrated

  return (
    <GlobalStateProvider>
      <div className="container mx-auto p-4 select-none">
        <h1 className="text-2xl font-bold mb-4">Painel de Análise de Dados</h1>
        <Tabs defaultValue="grouping">
          <TabsList>
            <TabsTrigger value="grouping">Agrupamento de Intervalos</TabsTrigger>
            <TabsTrigger value="function">Plotador de Funções</TabsTrigger>
            <TabsTrigger value="tree">Árvore Dinâmica</TabsTrigger>
            <TabsTrigger value="graphs">Exibição de Multi-Gráficos</TabsTrigger>
            <TabsTrigger value="algorithm">Fluxograma do Algoritmo</TabsTrigger>
            <TabsTrigger value="state">Gerenciamento de Estado</TabsTrigger>
          </TabsList>
          <TabsContent value="grouping">
            <Card>
              <CardHeader>
                <CardTitle>Agrupamento de Intervalos</CardTitle>
                <CardDescription>Agrupar dados por intervalos</CardDescription>
              </CardHeader>
              <CardContent>
                <IntervalGrouping />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="function">
            <Card>
              <CardHeader>
                <CardTitle>Plotador de Funções</CardTitle>
                <CardDescription>Plotar funções matemáticas</CardDescription>
              </CardHeader>
              <CardContent>
                <FunctionPlotter />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="tree">
            <Card>
              <CardHeader>
                <CardTitle>Árvore Dinâmica</CardTitle>
                <CardDescription>Interagir com uma estrutura de árvore dinâmica</CardDescription>
              </CardHeader>
              <CardContent>
                <DynamicTree />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="graphs">
            <Card>
              <CardHeader>
                <CardTitle>Exibição de Multi-Gráficos</CardTitle>
                <CardDescription>Visualizar diferentes tipos de gráficos</CardDescription>
              </CardHeader>
              <CardContent>
                <MultiGraphDisplay />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="algorithm">
            <Card>
              <CardHeader>
                <CardTitle>Fluxograma do Algoritmo</CardTitle>
                <CardDescription>Visualizar o fluxo do sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <AlgorithmFlowchart />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="state">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Estado</CardTitle>
                <CardDescription>Importar e exportar estado da aplicação</CardDescription>
              </CardHeader>
              <CardContent>
                <StateManagement />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </GlobalStateProvider>
  )
}

