'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus, ChevronDown, ChevronRight } from 'lucide-react'
import { TreeNode } from '@/app/state/interface'
import { v4 as uuid } from 'uuid'

interface NestedContent {
  id: string
  type: 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object'
  key?: string
  value?: string
  children?: NestedContent[]
}

interface FileContentProps {
  node: TreeNode
  onSave: (content: NestedContent[]) => void
  onEdit: (id: string, name: string) => void
  close: () => void
}

function NestedField({ content, onUpdate, onDelete, level = 0, arrayIndex = -1 }: {
  content: NestedContent
  onUpdate: (id: string, updates: Partial<NestedContent>) => void
  onDelete: (id: string) => void
  level?: number
  arrayIndex?: number
}) {
  const [isExpanded, setIsExpanded] = useState(true)

  const renderValue = () => {
    switch (content.type) {
      case 'string':
      case 'number':
        return (
          <Input
            value={content.value || ''}
            onChange={(e) => onUpdate(content.id, { value: e.target.value })}
            placeholder="Valor"
            className="flex-1"
            type={content.type === 'number' ? 'number' : 'text'}
          />
        )
      case 'boolean':
        return (
          <Select
            value={content.value}
            onValueChange={(value) => onUpdate(content.id, { value })}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Verdadeiro</SelectItem>
              <SelectItem value="false">Falso</SelectItem>
            </SelectContent>
          </Select>
        )
      case 'date':
        return (
          <Input
            value={content.value || ''}
            onChange={(e) => onUpdate(content.id, { value: e.target.value })}
            placeholder="AAAA-MM-DD"
            className="flex-1"
            type="date"
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-2 select-none" style={{ marginLeft: `${level * 20}px` }}>
      <div className="flex items-center space-x-1 group">
        {content.type === 'array' || content.type === 'object' ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-accent rounded"
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        ) : null}

        {arrayIndex > -1 ? (
          <span className="w-10 border border-r-0 px-4 py-[.3rem] -mr-1">{arrayIndex}</span>
        ) : (
          <Input
            value={content.key || ''}
            onChange={(e) => onUpdate(content.id, { key: e.target.value })}
            placeholder="Nome do campo"
            className="w-40"
          />
        )}

        <Select

          value={content.type}
          onValueChange={(value) => onUpdate(content.id, {
            type: value as NestedContent['type'],
            children: value === 'array' || value === 'object' ? [{ id: uuid(), type: 'string' }] : undefined,
            value: undefined
          })}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="string">String</SelectItem>
            <SelectItem value="number">Número</SelectItem>
            <SelectItem value="boolean">Booleano</SelectItem>
            <SelectItem value="date">Data</SelectItem>
            <SelectItem value="array">Array</SelectItem>
            <SelectItem value="object">Objeto</SelectItem>
          </SelectContent>
        </Select>

        {renderValue()}

        <Button
          onClick={() => onDelete(content.id)}
          variant="destructive"
          size="icon"
          className='group-hover:flex hidden'
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {isExpanded && content.children && content.children.map((child, index) => (
        <NestedField
          key={child.id}
          content={child}
          onUpdate={onUpdate}
          onDelete={onDelete}
          level={level + 1}
          arrayIndex={content.type === 'array' ? index : -1}
        />
      ))}

      {isExpanded && (content.type === 'array' || content.type === 'object') && (
        <Button
          variant="ghost"
          onClick={() => onUpdate(content.id, {
            children: [
              ...(content.children || []),
              { id: uuid(), type: 'string' }
            ]
          })}
          size="sm"
          className="ml-[20px]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Campo
        </Button>
      )}
    </div>
  )
}

export function FileContent({ node, onSave, onEdit, close }: FileContentProps) {
  const [content, setContent] = useState<NestedContent[]>(
    node.content || [{ id: uuid(), type: 'string' }]
  )
  const [editName, setEditName] = useState(node.name)

  const handleUpdateContent = (id: string, updates: Partial<NestedContent>) => {
    const updateInTree = (items: NestedContent[]): NestedContent[] => {
      return items.map(item => {
        if (item.id === id) {
          return { ...item, ...updates }
        }
        if (item.children) {
          return { ...item, children: updateInTree(item.children) }
        }
        return item
      })
    }
    setContent(updateInTree(content))
  }

  const handleDeleteContent = (id: string) => {
    const deleteFromTree = (items: NestedContent[]): NestedContent[] => {
      return items
        .filter(item => item.id !== id)
        .map(item => {
          if (item.children) {
            return { ...item, children: deleteFromTree(item.children) }
          }
          return item
        })
    }
    setContent(deleteFromTree(content))
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center space-x-2">
        <Input
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          className="w-40"
        />
        <Button variant="ghost" onClick={() => onEdit(node.id, editName)}>Atualizar Nome</Button>
      </div>

      <div className="space-y-4">
        {content.map((item) => (
          <NestedField
            key={item.id}
            content={item}
            onUpdate={handleUpdateContent}
            onDelete={handleDeleteContent}
          />
        ))}

        <Button
          variant="ghost"
          onClick={() => setContent([...content, { id: uuid(), type: 'string' }])}
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Campo
        </Button>
      </div>

      <Button variant="ghost" onClick={() => {
        onSave(content)
        close()
      }} className="mt-4">
        Salvar Alterações
      </Button>
    </div>
  )
}

