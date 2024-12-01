'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface DataItem {
  id: number
  nome: string
  valor: number
}

export default function DataTable() {
  const [nome, setNome] = useState('')
  const [valor, setValor] = useState('')
  const [dados, setDados] = useState<DataItem[]>([])

  const handleAdd = () => {
    if (nome && valor) {
      setDados([...dados, { id: Date.now(), nome, valor: Number(valor) }])
      setNome('')
      setValor('')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome" />
        <Input value={valor} onChange={(e) => setValor(e.target.value)} placeholder="Valor" type="number" />
        <Button onClick={handleAdd}>Adicionar</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Valor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dados.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.nome}</TableCell>
              <TableCell>{item.valor}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

