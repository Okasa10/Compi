'use client'

import { ArrowRight } from 'lucide-react'

interface Props {
  value: string
  onChange: (v: string) => void
}

export default function StdinPane({ value, onChange }: Props) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border-b border-zinc-800">
        <ArrowRight size={13} className="text-zinc-500" />
        <span className="text-xs font-mono text-zinc-500">STDIN</span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Custom input for your program..."
        spellCheck={false}
        className="flex-1 bg-zinc-950 text-sm font-mono p-3 resize-none 
                   outline-none text-zinc-300 placeholder:text-zinc-700"
      />
    </div>
  )
}