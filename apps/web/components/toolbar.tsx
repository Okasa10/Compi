'use client'

import { Play, RotateCcw, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import type { Language } from '@dsa-compiler/types'
import LanguageSelector from './language-selector'
import clsx from 'clsx'

interface Props {
  language: Language
  onLanguageChange: (lang: Language) => void
  onRun: () => void
  onReset: () => void
  code: string
  isRunning: boolean
}

export default function Toolbar({
  language, onLanguageChange, onRun, onReset, code, isRunning
}: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border-b border-zinc-800">
      <LanguageSelector value={language} onChange={onLanguageChange} />

      <div className="h-4 w-px bg-zinc-700 mx-1" />

      {/* Copy button */}
      <button
        onClick={handleCopy}
        title="Copy code"
        className="flex items-center gap-1.5 px-2 py-1 rounded text-xs 
                   text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
      >
        {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
        {copied ? 'Copied' : 'Copy'}
      </button>

      {/* Reset button */}
      <button
        onClick={onReset}
        title="Reset code"
        className="flex items-center gap-1.5 px-2 py-1 rounded text-xs 
                   text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
      >
        <RotateCcw size={13} />
        Reset
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Run button */}
      <button
        onClick={onRun}
        disabled={isRunning}
        className={clsx(
          'flex items-center gap-2 px-4 py-1.5 rounded text-sm font-medium transition-all',
          isRunning
            ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
        )}
      >
        <Play size={13} className={isRunning ? 'animate-pulse' : ''} />
        {isRunning ? 'Running...' : 'Run'}
      </button>
    </div>
  )
}