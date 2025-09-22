import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSass } from '@rsbuild/plugin-sass';
import { pluginBabel } from '@rsbuild/plugin-babel';

// React Compiler 配置
const ReactCompilerConfig = {
  // 可选配置项，用于自定义编译器行为
};

// 开发模式下的 react-scan 配置
const getReactScanTags = () => {
  // 检查是否为开发环境
  const isDev = process.env.NODE_ENV !== 'production';
  
  if (isDev) {
    return [
      {
        tag: 'script',
        attrs: {
          src: 'https://unpkg.com/react-scan/dist/auto.global.js',
          async: true,
        },
        append: false,
      },
    ];
  }
  
  return [];
};

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginSass(),
    // React Compiler 支持
    pluginBabel({
      include: /\.(?:jsx|tsx)$/,
      babelLoaderOptions(opts) {
        opts.plugins?.unshift([
          'babel-plugin-react-compiler',
          ReactCompilerConfig,
        ]);
      },
    }),
  ],
  html: {
    template: './src/index.html',
    // 在开发模式下注入远程 react-scan.js 脚本
    tags: getReactScanTags(),
  },
  source: {
    entry: {
      index: './src/index.tsx',
    },
  },
  output: {
    cssModules: {
      localIdentName: '[local]_[hash:base64:5]',
      auto: true,
    },
  },
});