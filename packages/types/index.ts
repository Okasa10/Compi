export type Language = 'python' | 'javascript' | 'cpp' | 'java'

export interface RunRequest {
  code: string
  language: Language
  stdin: string
}

export interface RunResult {
  stdout: string
  stderr: string
  exitCode: number
  executionTime: number
}
