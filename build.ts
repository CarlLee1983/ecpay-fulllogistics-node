/**
 * Build script for dual ESM/CJS output using Bun.build
 *
 * Usage: bun run build.ts
 *
 * Outputs:
 * - dist/index.mjs (ESM)
 * - dist/index.cjs (CJS)
 * - dist/types/    (TypeScript declarations via tsc)
 */

import { $ } from 'bun'

const entrypoint = './src/index.ts'

async function build() {
  console.log('🧹 Cleaning dist folder...')
  await $`rm -rf dist`

  console.log('📦 Building ESM...')
  const esmResult = await Bun.build({
    entrypoints: [entrypoint],
    outdir: './dist',
    target: 'node',
    format: 'esm',
    naming: '[name].mjs',
    minify: false,
    sourcemap: 'external',
  })

  if (!esmResult.success) {
    console.error('❌ ESM build failed:')
    for (const log of esmResult.logs) {
      console.error(log)
    }
    process.exit(1)
  }

  console.log('📦 Building CJS...')
  const cjsResult = await Bun.build({
    entrypoints: [entrypoint],
    outdir: './dist',
    target: 'node',
    format: 'cjs',
    naming: '[name].cjs',
    minify: false,
    sourcemap: 'external',
  })

  if (!cjsResult.success) {
    console.error('❌ CJS build failed:')
    for (const log of cjsResult.logs) {
      console.error(log)
    }
    process.exit(1)
  }

  console.log('📝 Generating type declarations...')
  // Only generate declarations for src files, not test or build.ts
  const tscResult =
    await $`bunx tsc --emitDeclarationOnly --outDir ./dist/types --declaration --declarationMap --rootDir ./src src/**/*.ts`.nothrow()

  if (tscResult.exitCode !== 0) {
    console.error('❌ Type declaration generation failed')
    process.exit(1)
  }

  console.log('✅ Build complete!')
  console.log('   - dist/index.mjs (ESM)')
  console.log('   - dist/index.cjs (CJS)')
  console.log('   - dist/types/    (TypeScript declarations)')
}

build().catch((error) => {
  console.error('Build failed:', error)
  process.exit(1)
})
