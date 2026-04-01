'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import type { Language } from '@dsa-compiler/types'

// Monaco must be loaded client-side only
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

const LANGUAGES: Language[] = ['python', 'cpp', 'java', 'javascript']

export default function EditorPage() {
  const [code, setCode] = useState('# Write your code here\n')
  const [language, setLanguage] = useState<Language>('python')
  const [stdin, setStdin] = useState('')
  const [output, setOutput] = useState('')

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-white">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-2 bg-zinc-900 border-b border-zinc-800">
        <span className="font-mono font-bold text-sm text-emerald-400">DSA Compiler</span>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="bg-zinc-800 border border-zinc-700 text-sm rounded px-2 py-1 text-white"
        >
          {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <button
          onClick={() => setOutput('// Run not wired yet — coming Day 6')}
          className="ml-auto bg-emerald-600 hover:bg-emerald-500 px-4 py-1 rounded text-sm font-medium"
        >
          ▶ Run
        </button>
      </div>

      {/* Main split */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor pane */}
        <div className="flex-1 border-r border-zinc-800">
          <MonacoEditor
            height="100%"
            language={language === 'cpp' ? 'cpp' : language}
            value={code}
            onChange={(v) => setCode(v ?? '')}
            theme="vs-dark"
            options={{
              fontSize: 14,
              fontFamily: 'JetBrains Mono, Fira Code, monospace',
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              tabSize: 2,
            }}
          />
        </div>

        {/* Input/Output pane */}
        <div className="w-96 flex flex-col">
          <div className="flex-1 flex flex-col border-b border-zinc-800">
            <div className="px-3 py-1 text-xs font-mono text-zinc-500 bg-zinc-900">STDIN</div>
            <textarea
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              className="flex-1 bg-zinc-950 text-sm font-mono p-3 resize-none outline-none text-zinc-300"
              placeholder="Input for your program..."
            />
          </div>
          <div className="flex-1 flex flex-col">
            <div className="px-3 py-1 text-xs font-mono text-zinc-500 bg-zinc-900">OUTPUT</div>
            <pre className="flex-1 bg-zinc-950 text-sm font-mono p-3 overflow-auto text-emerald-300">
              {output || 'Output will appear here...'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}