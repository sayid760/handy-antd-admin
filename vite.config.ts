import { resolve } from 'path'
import type { UserConfig } from 'vite'

const Config: UserConfig = {
  alias: {
    '/@/': resolve(__dirname, './src')
  },
  // 引入第三方的配置
  // 会使用rollup对包重新编译，将编译成符合esm模块规范的新的包放入node_modules下的
  optimizeDeps: {
    include: [
      'echarts',
      '@ant-design/icons-vue',
      '@ant-design/colors',
      // "axios"
    ],
  },
/*  
  outputDir: 'dist',
  assetsDir: 'static',
  port: '9000',
  // 是否自动在浏览器打开
  open: false,
  // 是否开启 https
  https: false,
  proxy: {
      // 如果是 /api 打头，则访问地址如下
      '/api': {
          target: 'http://39.100.8.62:8080',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, '')
      }
  }*/
}


export default Config