import esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';

// Generate CSS/JS Builds
esbuild
  .build({
    entryPoints: [
      './styles/index.scss',
      './app/index.js',
    ],
    outdir: "./public",
    bundle: true,
    watch: true,
    platform: "node",
    external: ["*.woff", "*.woff2"],
    plugins: [
      sassPlugin(),
    ],
  })
  .then(() => console.log('⚡ watching... ⚡'));
