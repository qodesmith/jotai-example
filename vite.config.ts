import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import jotaiDebugLabel from 'jotai/babel/plugin-debug-label'
import jotaiReactRefresh from 'jotai/babel/plugin-react-refresh'

// https://vitejs.dev/config/
export default defineConfig({
  // https://github.com/pmndrs/jotai/blob/main/docs/guides/vite.mdx
  plugins: [react({babel: {plugins: [jotaiDebugLabel, jotaiReactRefresh]}})],
})
