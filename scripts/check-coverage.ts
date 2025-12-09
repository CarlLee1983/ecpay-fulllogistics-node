/**
 * Coverage threshold checker script
 *
 * This script parses Bun test coverage output and fails if coverage
 * falls below the defined thresholds.
 *
 * Usage: bun run scripts/check-coverage.ts
 */

const COVERAGE_THRESHOLD = 95 // Minimum coverage percentage required

interface CoverageResult {
  lines: number
  functions: number
  branches: number
}

async function checkCoverage(): Promise<void> {
  const coverageFile = Bun.file('coverage-output.txt')

  if (!(await coverageFile.exists())) {
    console.error('❌ Coverage output file not found. Run tests with coverage first.')
    process.exit(1)
  }

  const coverageOutput = await coverageFile.text()

  // Parse coverage from Bun test output
  // Example line: "All files | 95.00% | 92.00% | 100.00%"
  const coverageMatch = coverageOutput.match(
    /All files\s*\|\s*([\d.]+)%\s*\|\s*([\d.]+)%\s*\|\s*([\d.]+)%/
  )

  if (!coverageMatch) {
    console.warn('⚠️  Could not parse coverage output. Skipping coverage check.')
    console.log('Coverage output:', coverageOutput)
    return
  }

  const coverage: CoverageResult = {
    lines: parseFloat(coverageMatch[1] ?? '0'),
    functions: parseFloat(coverageMatch[2] ?? '0'),
    branches: parseFloat(coverageMatch[3] ?? '0'),
  }

  console.log('\n📊 Coverage Report:')
  console.log(`   Lines:     ${coverage.lines.toFixed(2)}%`)
  console.log(`   Functions: ${coverage.functions.toFixed(2)}%`)
  console.log(`   Branches:  ${coverage.branches.toFixed(2)}%`)
  console.log(`   Threshold: ${COVERAGE_THRESHOLD}%\n`)

  const failures: string[] = []

  if (coverage.lines < COVERAGE_THRESHOLD) {
    failures.push(`Lines coverage (${coverage.lines}%) is below threshold (${COVERAGE_THRESHOLD}%)`)
  }
  if (coverage.functions < COVERAGE_THRESHOLD) {
    failures.push(
      `Functions coverage (${coverage.functions}%) is below threshold (${COVERAGE_THRESHOLD}%)`
    )
  }
  if (coverage.branches < COVERAGE_THRESHOLD) {
    failures.push(
      `Branches coverage (${coverage.branches}%) is below threshold (${COVERAGE_THRESHOLD}%)`
    )
  }

  if (failures.length > 0) {
    console.error('❌ Coverage threshold not met:')
    for (const failure of failures) {
      console.error(`   - ${failure}`)
    }
    process.exit(1)
  }

  console.log('✅ All coverage thresholds met!')
}

checkCoverage().catch((error) => {
  console.error('Coverage check failed:', error)
  process.exit(1)
})
