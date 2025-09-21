const { execSync } = require('child_process')
const fs = require('fs')

console.log('🔍 Analyzing bundle...')

try {
  // Build with analysis
  execSync('ANALYZE=true bun run build', { stdio: 'inherit' })
  
  // Check if stats file exists
  if (fs.existsSync('dist/stats.html')) {
    console.log('✅ Bundle analysis complete!')
    console.log('📊 Open dist/stats.html to view the analysis')
    
    // Auto-open in browser (optional)
    if (process.platform === 'darwin') {
      execSync('open dist/stats.html')
    } else if (process.platform === 'linux') {
      execSync('xdg-open dist/stats.html')
    }
  }
} catch (error) {
  console.error('❌ Bundle analysis failed:', error.message)
  process.exit(1)
}
