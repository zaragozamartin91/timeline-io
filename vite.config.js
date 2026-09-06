// import { resolve } from 'node:path'
// import { defineConfig } from 'vite'

// export default defineConfig({
//   build: {
//     rollupOptions: {
//       input: {
//         main: resolve(import.meta.dirname, 'index.html'),
//         nested: resolve(import.meta.dirname, 'nested/index.html'),
//       },
//     },
//   },
// })

import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  input: {
    main: resolve(import.meta.dirname, 'index.html'),
    nested: resolve(import.meta.dirname, 'nested/index.html'),
    timeline: resolve(import.meta.dirname, 'timeline/timeline.html'),
  },
})