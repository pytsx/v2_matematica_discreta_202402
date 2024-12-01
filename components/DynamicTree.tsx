'use client'

import React, { useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { v4 as uuid } from 'uuid'
import { Folder, File, Trash2 } from 'lucide-react'
import { NestedContent, TreeNode } from '@/app/state/interface'
import { useGlobalState } from '@/app/state/globalState'
import { FileContent } from './FileContent'


function TreeNodeComponent({ node, onAdd, onDelete, onEdit, onFileContentChange }: {
  node: TreeNode
  onAdd: (parentId: string, name: string, type: 'folder' | 'file') => void
  onDelete: (id: string) => void
  onEdit: (id: string, name: string) => void
  onFileContentChange: (id: string, content: NestedContent[]) => void
}) {
  const [editName, setEditName] = useState(node.name)
  const [open, setOpen] = useState(false)

  const handleBlur = useCallback(() => {
    if (editName.trim() !== '' && editName !== node.name) {
      onEdit(node.id, editName)
    }
  }, [editName, node.id])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur()
    }
  }, [handleBlur])

  return (
    <div className="">
      <div className="flex items-center group relative w-fit pl-2 h-[32px] border-l">
        {node.type === 'folder' ? <Folder className="h-4 w-4" /> : <File className="h-4 w-4" />}
        {
          node.type != "file" && <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-24 bg-transparent border-none p-0 focus:ring-0 mx-2 text-sm"
          />
        }
        {node.type === 'file' && (
          <Dialog
            onOpenChange={(o) => setOpen(o)}
            open={open}
          >
            <DialogTrigger asChild>
              <span className="text-sm cursor-pointer hover:underline mx-2">{node.name}</span>
            </DialogTrigger>

            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>{node.name}</DialogTitle>
              </DialogHeader>
              <FileContent
                node={node}
                onSave={(content) => onFileContentChange(node.id, content)}
                onEdit={onEdit}
                close={() => setOpen(!open)}
              />
            </DialogContent>
          </Dialog>
        )}

        <div className="opacity-0 group-hover:opacity-100 transition-opacity delay-75 ease-in-out ">
          <Button onClick={() => onDelete(node.id)} size="sm" variant="ghost">
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Excluir</span>
          </Button>
          {node.type === 'folder' && (
            <>
              <Button onClick={() => onAdd(node.id, 'Nova Pasta', 'folder')} size="sm" variant="ghost">
                <Folder className="h-4 w-4" />
                <span className="sr-only">Adicionar pasta</span>
              </Button>
              <Button onClick={() => onAdd(node.id, 'Novo Arquivo', 'file')} size="sm" variant="ghost">
                <File className="h-4 w-4" />
                <span className="sr-only">Adicionar arquivo</span>
              </Button>
            </>
          )}

        </div>

      </div>
      {node.type === 'folder' && node.children && (
        <div className="ml-4">
          {node.children.map(child => (
            <TreeNodeComponent
              key={child.id}
              node={child}
              onAdd={onAdd}
              onDelete={onDelete}
              onEdit={onEdit}
              onFileContentChange={onFileContentChange}
            />
          ))}
        </div>
      )}

    </div>
  )
}


export default function DynamicTree() {
  const { state, dispatch } = useGlobalState()

  const addNode = (parentId: string, name: string, type: 'folder' | 'file') => {
    const newTree = JSON.parse(JSON.stringify(state.treeDataTable))
    const addToChildren = (node: TreeNode): boolean => {
      if (node.id === parentId) {
        node.children = node.children || []
        node.children.push({ id: uuid(), name, type, children: [], content: type === 'file' ? [{ id: uuid(), type: "string" }] : undefined })
        return true
      }
      return node.children?.some(addToChildren) || false
    }
    addToChildren(newTree)
    dispatch({ type: 'SET_TREE_DATA_TABLE', payload: newTree })
  }

  const deleteNode = (id: string) => {
    const newTree = JSON.parse(JSON.stringify((state.treeDataTable)))
    const deleteFromChildren = (node: TreeNode): boolean => {
      if (node.children) {
        const index = node.children.findIndex(child => child.id === id)
        if (index !== -1) {
          node.children.splice(index, 1)
          return true
        }
        return node.children.some(deleteFromChildren)
      }
      return false
    }
    deleteFromChildren(newTree)
    dispatch({ type: 'SET_TREE_DATA_TABLE', payload: newTree })
  }

  const editNode = (id: string, name: string) => {
    const newTree = JSON.parse(JSON.stringify((state.treeDataTable)))
    const editInChildren = (node: TreeNode): boolean => {
      if (node.id === id) {
        node.name = name
        return true
      }
      return node.children?.some(editInChildren) || false
    }
    editInChildren(newTree)
    dispatch({ type: 'SET_TREE_DATA_TABLE', payload: newTree })
  }

  const handleFileContentChange = (id: string, content: NestedContent[]) => {
    const newTree = JSON.parse(JSON.stringify((state.treeDataTable)))
    const updateFileContent = (node: TreeNode): boolean => {
      if (node.id === id) {
        node.content = content
        return true
      }
      return node.children?.some(updateFileContent) || false
    }
    updateFileContent(newTree)
    dispatch({ type: 'SET_TREE_DATA_TABLE', payload: newTree })
  }

  return (
    <div className="p-2">
      <h3 className="font-bold mb-2">Árvore Dinâmica</h3>
      <div className="space-y-2">
        <TreeNodeComponent
          node={state.treeDataTable}
          onAdd={addNode}
          onDelete={deleteNode}
          onEdit={editNode}
          onFileContentChange={handleFileContentChange}
        />
      </div>
    </div>
  )
}

