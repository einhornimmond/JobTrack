import { spawnSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const isWindows = process.platform === 'win32'
const executableExt = isWindows ? '.exe' : ''

// copy the assets
const assets = [
  'index.html',
  'app.css',
  'app.js',
  'favicon.ico',
]
// create dist folder if not exist
const distDir = join('zig-backend', 'src', 'dist')
if (!existsSync(distDir)) {
  mkdirSync(distDir)
}

for (const asset of assets) {
  copyFileSync(join('dist', asset), join(distDir, asset))
}

// Run zig build
const zigBuild = spawnSync('zig', ['build', '--release=small'], {
  cwd: './zig-backend',
  stdio: 'inherit'
});

if (zigBuild.status !== 0) {
  process.exit(1)
}

// Copy the built executable
const sourceFile = join('zig-backend', 'zig-out', 'bin', `zig_backend${executableExt}`)
const targetFile = join(`JobTrack${executableExt}`)

try {
  copyFileSync(sourceFile, targetFile)
  console.log(`Successfully copied executable to ${targetFile}`)
} catch (error) {
  console.error('Failed to copy executable:', error)
  process.exit(1)
}
