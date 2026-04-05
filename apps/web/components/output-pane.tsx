'use client'

import { Terminal, AlertCircle, Clock } from 'lucide-react'
import clsx from 'clsx'

interface Props {
  stdout: string
  stderr: string
  executionTime?: number
  isRunning: boolean
}

export default function OutputPane({ stdout, stderr, executionTime, isRunning }: Props) {
  const hasError = stderr.length > 0
  const hasOutput = stdout.length > 0
  const isEmpty = !hasError && !hasOutput && !isRunning

  return (
    <div className="flex flex-col h-full bg-zinc-950">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border-b border-zinc-800">
        <Terminal size={13} className="text-zinc-500" />
        <span className="text-xs font-mono text-zinc-500">OUTPUT</span>
        {executionTime !== undefined && !isRunning && (
          <span className="ml-auto flex items-center gap-1 text-xs text-zinc-600 font-mono">
            <Clock size={11} />
            {executionTime}ms
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-3 font-mono text-sm">
        {isRunning && (
          <div className="flex items-center gap-2 text-zinc-500">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Running...
          </div>
        )}

        {isEmpty && !isRunning && (
          <p className="text-zinc-600 text-xs">
            Output will appear here after you run your code.
          </p>
        )}

        {hasError && (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-red-400 text-xs mb-2">
              <AlertCircle size={12} />
              Error
            </div>
            <pre className="text-red-400 whitespace-pre-wrap">{stderr}</pre>
          </div>
        )}

        {hasOutput && (
          <pre className={clsx(
            'whitespace-pre-wrap',
            hasError ? 'mt-4 text-zinc-300' : 'text-emerald-300'
          )}>
            {stdout}
          </pre>
        )}
      </div>
    </div>
  )
}