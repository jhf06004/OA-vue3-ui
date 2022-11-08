import legacyPlugin from '@vitejs/plugin-legacy'
import Banner from 'vite-plugin-banner'
import * as path from 'path'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import vuePlugin from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export default ({
  command,
  mode
}) => {
  const NODE_ENV = process.env.NODE_ENV || 'development'
  const envFiles = [
    `.env.${NODE_ENV}`
  ]
  for (const file of envFiles) {
    const envConfig = dotenv.parse(fs.readFileSync(file))
    for (const k in envConfig) {
      process.env[k] = envConfig[k]
    }
  }

  const timestamp = Date.parse(new Date())

  const optimizeDeps = {}

  const alias = {
    '@': path.resolve(__dirname, './src'),
    'vue$': 'vue/dist/vue.runtime.esm-bundler.js',
  }

  const esbuild = {}

  return {
    base: './', // index.html文件所在位置
    root: './', // js导入的资源路径，src
    resolve: {
      alias,
    },
    define: {
      'process.env': {}
    },
    server: {
      host: '0.0.0.0',
      // 如果使用docker-compose开发模式，设置为false
      open: true,
      port: process.env.VITE_CLI_PORT,
      proxy: {
        // 把key的路径代理到target位置
        ['/api']: { // 需要代理的路径   例如 '/api'
          // target: 'http://192.168.0.236:29000', // 代理到 目标路径
          target: 'http://192.168.0.199:8080', // 代理到 目标路径
          changeOrigin: true,
          rewrite: path => path.replace(/\/api/, '')
        }
      },
    },
    build: {
      target: 'es2017',
      minify: 'terser', // 是否进行压缩,boolean | 'terser' | 'esbuild',默认使用terser
      manifest: false, // 是否产出manifest.json
      sourcemap: false, // 是否产出sourcemap.json
      outDir: 'dist', // 产出目录
      // rollupOptions,
    },
    esbuild,
    optimizeDeps,
    presets: [
      '@vue/cli-plugin-babel/preset'
    ],
    plugins: [
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), 'src/icons/svg')],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]'
      }),
      // 使用iconPark图标库
      [
        'import',
        {
          libraryName: '@icon-park/vue-next',
          libraryDirectory: 'es/icons',
          camel2DashComponentName: false
        },
        'icon'      // 多个组件库时需要加上这个属性,不重复即可。
      ],
      legacyPlugin({
        targets: ['Android > 39', 'Chrome >= 60', 'Safari >= 10.1', 'iOS >= 10.3', 'Firefox >= 54', 'Edge >= 15'],
      }), vuePlugin(), [Banner(`\n Build based on gin-vue-admin \n Time : ${timestamp}`)]
    ],
    // css
    css: {
      loaderOptions: {
        sass: {
          sassOptions: {
            outputStyle: "expanded",
            // 支持内联 JavaScript
            javascriptEnabled: true
          }
        }
      }
    }
  }
}
