/** @type {import('next').NextConfig} */
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';

const webpack = (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    // https://github.com/vercel/next.js/issues/31692#issuecomment-1061260424
    if (!isServer) {
      config.plugins.push(new MonacoWebpackPlugin({
        languages: [],
        filename: "static/[name].worker.js",
      }));
    }
    config.module.rules.push({
      test: /\.ttf$/,
      type: 'asset/resource',
    })
    return config
  }

const nextConfig = {
  output: 'export',
  webpack: webpack,
};

export default nextConfig;
