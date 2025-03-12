import { build } from 'bun'
import tailwindPlugin from 'bun-plugin-tailwind'

build({
  entrypoints: ['./view/app.ts'], 
  outdir: './dist', 
  plugins: [tailwindPlugin],
  minify: true
}).catch(() => process.exit(1));
