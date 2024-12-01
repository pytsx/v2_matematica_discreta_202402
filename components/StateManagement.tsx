'use client'

import { useGlobalState, exportState, importState } from '@/app/state/globalState'
import { Button } from "@/components/ui/button"

export default function GerenciamentoDeEstado() {
  const { state, dispatch } = useGlobalState()

  const handleExport = () => {
    const estadoExportado = exportState(state)
    const blob = new Blob([estadoExportado], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'estado-dashboard.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    input.onchange = (e) => {
      const arquivo = (e.target as HTMLInputElement).files?.[0]
      if (arquivo) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const estadoImportado = importState(e.target?.result as string)
            dispatch({ type: 'IMPORT_STATE', payload: estadoImportado })
          } catch (error) {
            console.error('Erro ao importar estado:', error)
            alert('Dados de importação inválidos. Por favor, verifique o arquivo JSON.')
          }
        }
        reader.readAsText(arquivo)
      }
    }
    input.click()
  }

  return (
    <div className="space-x-4">
      <Button onClick={handleExport}>Exportar Estado</Button>
      <Button onClick={handleImport}>Importar Estado</Button>
    </div>
  )
}

