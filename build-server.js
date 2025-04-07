import { spawnSync } from 'child_process'
import { copyFileSync } from 'fs'
import { join } from 'path'

const isWindows = process.platform === 'win32'
const executableExt = isWindows ? '.exe' : ''

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
const targetFile = join('dist', `JobTrack${executableExt}`)

try {
  copyFileSync(sourceFile, targetFile)
  console.log(`Successfully copied executable to ${targetFile}`)
} catch (error) {
  console.error('Failed to copy executable:', error)
  process.exit(1)
}
