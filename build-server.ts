import * as esbuild from 'esbuild';

esbuild.build({
  entryPoints: ['server.ts'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  outfile: 'dist/server.cjs',
  external: ['express', 'socket.io', 'vite', '@prisma/client', '.prisma/client'],
}).catch(() => process.exit(1));
