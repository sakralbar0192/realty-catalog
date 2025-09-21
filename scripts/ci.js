#!/usr/bin/env node
/* eslint-disable no-console */

import { execSync } from 'child_process'

console.log('🚀 Running CI pipeline...\n')

const steps = [
  { name: 'Install dependencies', command: 'bun install --frozen-lockfile' },
  { name: 'Type checking', command: 'bun run typecheck' },
  { name: 'Linting', command: 'bun run lint:check' },
  { name: 'Style checking', command: 'bun run stylelint:check' },
  { name: 'Unit tests', command: 'bun run test:run' },
  { name: 'Build', command: 'bun run build' },
  // E2E tests disabled in CI for now - require separate setup
  // { name: 'E2E tests', command: 'bun run test:e2e' },
]

for (const step of steps) {
  try {
    console.log(`⚙️  ${step.name}...`)
    execSync(step.command, { stdio: 'inherit' })
    console.log(`✅ ${step.name} completed\n`)
  } catch {
    console.error(`❌ ${step.name} failed`)
    process.exit(1)
  }
}

console.log('🎉 CI pipeline completed successfully!')
