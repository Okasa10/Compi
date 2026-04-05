'use client'

import type { Language } from '@dsa-compiler/types'

const LANGUAGE_LABELS: Record<Language, string> = {
  python: '🐍 Python',
  cpp: '⚙️ C++',
  java: '☕ Java',
  javascript: '🟨 JavaScript',
}

interface Props {
  value: Language
  onChange: (lang: Language) => void
}

export default function LanguageSelector({ value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as Language)}
      className="bg-zinc-800 border border-zinc-700 hover:border-zinc-500 
                 text-sm rounded px-2 py-1 text-white cursor-pointer 
                 transition-colors outline-none focus:border-emerald-500"
    >
      {(Object.keys(LANGUAGE_LABELS) as Language[]).map((lang) => (
        <option key={lang} value={lang}>
          {LANGUAGE_LABELS[lang]}
        </option>
      ))}
    </select>
  )
}