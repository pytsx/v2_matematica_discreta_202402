'use client'

import MermaidChart from './Mermaid'

const flowchartDefinition = `
graph TD
    A[Início] --> B[Inicializar Painel]
    B --> C{Usuário seleciona aba}
    C --> D[Agrupamento de Intervalos]
    C --> E[Plotador de Funções]
    C --> F[Árvore Dinâmica]
    C --> G[Exibição de Multi-Gráficos]
    C --> H[Fluxograma do Algoritmo]
    C --> I[Gerenciamento de Estado]

    D --> D1[Inserir números e intervalo]
    D1 --> D2[Agrupar dados]
    D2 --> D3[Exibir resultados]
    D3 --> C

    E --> E1[Selecionar ou inserir função]
    E1 --> E2[Selecionar ou inserir intervalo]
    E2 --> E3[Plotar função]
    E3 --> C

    F --> F1[Adicionar/Excluir nós]
    F1 --> F2[Atualizar estrutura da árvore]
    F2 --> F3[Exibir árvore atualizada]
    F3 --> C

    G --> G1[Selecionar tipo de gráfico]
    G1 --> G2[Gerar gráfico]
    G2 --> G3[Exibir gráfico]
    G3 --> C

    H --> H1[Exibir fluxograma]
    H1 --> C

    I --> I1[Importar/Exportar estado]
    I1 --> C

    subgraph AgrupamentoDeIntervalos
        D1 --> D1a[Validar entrada]
        D1a -->|Válido| D2
        D1a -->|Inválido| D1b[Mostrar erro]
        D2 --> D2a[Calcular intervalos]
        D2a --> D2b[Armazenar resultados]
        D2b --> D3
    end

    subgraph PlotadorDeFunções
        E1 --> E1a[Validar função]
        E1a -->|Válido| E2
        E1a -->|Inválido| E1b[Mostrar erro]
        E2 --> E2a[Validar intervalo]
        E2a -->|Válido| E3
        E2a -->|Inválido| E2b[Mostrar erro]
        E3 --> E3a[Plotar função]
        E3a --> E3b[Exibir plotagem]
    end

    subgraph ÁrvoreDinâmica
        F1 --> F1a[Validar nó]
        F1a -->|Válido| F2
        F1a -->|Inválido| F1b[Mostrar erro]
        F2 --> F2a[Atualizar estrutura]
        F2a --> F3
    end

    subgraph ExibiçãoDeMulti-Gráficos
        G1 --> G1a[Validar seleção]
        G1a -->|Válido| G2
        G1a -->|Inválido| G1b[Mostrar erro]
        G2 --> G2a[Gerar gráfico]
        G2a --> G3
    end

    subgraph GerenciamentoDeEstado
        I1 --> I1a[Exportar estado]
        I1 --> I1b[Importar estado]
        I1a --> I1c[Salvar em arquivo]
        I1b --> I1d[Carregar de arquivo]
    end
`

export default function AlgorithmFlowchart() {
  return (
    <div>
      <h3 className="font-bold mb-2">Diagrama de Fluxo do Sistema</h3>
      <MermaidChart chart={flowchartDefinition} />
    </div>
  )
}

