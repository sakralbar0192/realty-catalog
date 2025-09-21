#!/usr/bin/env node
/* eslint-disable no-console */

import { execSync } from 'child_process'

console.log('🔍 Running comprehensive quality checks...\n')

const checks = [
  { name: 'ESLint', command: 'bun run lint:check' },
  { name: 'Stylelint', command: 'bun run stylelint:check' },
  { name: 'TypeScript', command: 'bun run typecheck' },
  { name: 'Unit Tests', command: 'bun run test:run --exclude="**/e2e/**"' },
  { name: 'HTML Validation', command: 'find . -name "*.html" -o -name "*.vue" | grep -v -E "(node_modules|coverage|dist|playwright-report)" | head -20 | xargs html-validate' },
]

let failed = false

for (const check of checks) {
  try {
    console.log(`📋 Running ${check.name}...`)
    execSync(check.command, { stdio: 'inherit' })
    console.log(`✅ ${check.name} passed\n`)
  } catch {
    console.error(`❌ ${check.name} failed\n`)
    failed = true
  }
}

if (failed) {
  console.error('💥 Quality checks failed!')
  process.exit(1)
} else {
  console.log('🎉 All quality checks passed!')
}
