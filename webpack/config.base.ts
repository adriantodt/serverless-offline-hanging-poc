import { Configuration } from 'webpack';
import { resolve } from 'path';

interface CustomWebpackParams {
  basePackage: string;
  entries: string[];
  entrypointName: string;
}

const basicWebpackConfig: Configuration = {
  module: {
    rules: [
      {
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          happyPackMode: true,
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    alias: {
      '@': resolve('./src/'),
      '@test': resolve('../test/'),
    },
  },
  output: {
    libraryTarget: 'commonjs',
    path: resolve('./dist'),
    filename: '[name].js',
  },

  mode: 'production',
  target: 'node',
  devtool: 'source-map',
  optimization: {
    minimize: false,
    nodeEnv: false,
  }
};

export default function (params: CustomWebpackParams): Configuration {
  const entry: Record<string, any> = Object.fromEntries(params.entries.map(key => [key, {
    import: `${params.basePackage}/${key}/${params.entrypointName}`,
  }]));

  return { ...basicWebpackConfig, entry };
}
