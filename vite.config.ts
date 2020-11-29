import { resolve } from 'path'
import type { UserConfig } from 'vite'
// import { loadEnv } from './src/utils/index'

// const envFiles = [
//   /** default file */ `.env`,
//   /** mode file */ `.env.${process.env.NODE_ENV}`
// ]
// for (const file of envFiles) {
//   const envConfig = dotenv.parse(fs.readFileSync(file))
//   for (const k in envConfig) {
//     process.env[k] = envConfig[k]
//   }
// }

// console.log(process.env.VUE_APP_API_URL)

// Read all environment variable configuration files to process.env

import dotenv from 'dotenv'

// 环境参数
export const loadEnv =()=> {
  const env = process.env.NODE_ENV;
  const ret: any = {};
  const envList = [`.env.${env}.local`, `.env.${env}`, '.env.local', '.env'];
  envList.forEach((e) => {
    dotenv.config({
      path: e,
    });
  });

  for (const envName of Object.keys(process.env)) {
    let realName = (process.env as any)[envName].replace(/\\n/g, '\n');
    realName = realName === 'true' ? true : realName === 'false' ? false : realName;
    ret[envName] = realName;
    process.env[envName] = realName;
  }
  return ret;
}

const viteEnv = loadEnv();

const {
  VUE_APP_API_URL
} = viteEnv;

console.log(VUE_APP_API_URL)

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
  https: false,*/
  // port: 3000,
  // hostname: "localhost",
  proxy: {
  '/api': 'http://localhost:3001',
  }
}


export default Config