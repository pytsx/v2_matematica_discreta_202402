'use client'

import { useEffect } from 'react'
import mermaid from 'mermaid'

interface MermaidProps {
  chart: string
}

export default function Mermaid({ chart }: MermaidProps) {
  useEffect(() => {
    mermaid.initialize({ startOnLoad: true })
    mermaid.contentLoaded()
  }, [])

  return <div className="mermaid">{chart}</div>
}

