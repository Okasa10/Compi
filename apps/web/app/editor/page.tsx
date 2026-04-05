'use client'

import dynamic from 'next/dynamic'
import { useState, useCallback } from 'react'
import {
  Panel,
  Group,
  Separator,
} from 'react-resizable-panels'
import type { Language } from '@dsa-compiler/types'
import Navbar from '@/components/navbar'
import Toolbar from '@/components/toolbar'
import OutputPane from '@/components/output-pane'
import StdinPane from '@/components/stdin-pane'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

const DEFAULT_CODE: Record<Language, string> = {
  python: '# Write your solution here\n\ndef solve():\n    pass\n\nsolve()\n',
  cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}\n',
  java: 'public class Main {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}\n',
  javascript: '// Write your solution here\n\nfunction solve() {\n\n}\n\nsolve();\n',
}

export default function EditorPage() {
  const [language, setLanguage] = useState<Language>('python')
  const [code, setCode] = useState(DEFAULT_CODE['python'])
  const [stdin, setStdin] = useState('')
  const [stdout, setStdout] = useState('')
  const [stderr, setStderr] = useState('')
  const [executionTime, setExecutionTime] = useState<number | undefined>()
  const [isRunning, setIsRunning] = useState(false)

  const handleLanguageChange = useCallback((lang: Language) => {
    setLanguage(lang)
    setCode(DEFAULT_CODE[lang])
    setStdout('')
    setStderr('')
  }, [])

  const handleReset = useCallback(() => {
    setCode(DEFAULT_CODE[language])
    setStdout('')
    setStderr('')
    setStdin('')
  }, [language])

  // Stub — will be replaced with real WebSocket call on Day 6
  const handleRun = useCallback(async () => {
    setIsRunning(true)
    setStdout('')
    setStderr('')
    setExecutionTime(undefined)

    await new Promise((r) => setTimeout(r, 1200)) // fake delay

    setStdout('Hello, World!\n// Real execution coming Day 6 🚀')
    setExecutionTime(42)
    setIsRunning(false)
  }, [])

  return (
    <div className="flex flex-col h-screen bg-zinc-950">
      <Navbar />

      <Toolbar
        language={language}
        onLanguageChange={handleLanguageChange}
        onRun={handleRun}
        onReset={handleReset}
        code={code}
        isRunning={isRunning}
      />

      {/* Resizable main area */}
      <div className="flex-1 overflow-hidden">
        <Group orientation="horizontal" className="h-full">
          {/* Editor panel */}
          <Panel defaultSize={65} minSize={30}>
            <MonacoEditor
              height="100%"
              language={language === 'cpp' ? 'cpp' : language}
              value={code}
              onChange={(v) => setCode(v ?? '')}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                fontLigatures: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                tabSize: 2,
                padding: { top: 12 },
                smoothScrolling: true,
                cursorBlinking: 'smooth',
                renderLineHighlight: 'gutter',
              }}
            />
          </Panel>

          {/* Drag handle */}
          <Separator className="w-1 bg-zinc-800 hover:bg-emerald-500 
                                        transition-colors cursor-col-resize" />

          {/* Right panel — stdin + output stacked */}
          <Panel defaultSize={35} minSize={20}>
            <Group orientation="vertical" className="h-full">
              <Panel defaultSize={35} minSize={15}>
                <StdinPane value={stdin} onChange={setStdin} />
              </Panel>

              <Separator className="h-1 bg-zinc-800 hover:bg-emerald-500 
                                            transition-colors cursor-row-resize" />

              <Panel defaultSize={65} minSize={20}>
                <OutputPane
                  stdout={stdout}
                  stderr={stderr}
                  executionTime={executionTime}
                  isRunning={isRunning}
                />
              </Panel>
            </Group>
          </Panel>
        </Group>
      </div>
    </div>
  )
}