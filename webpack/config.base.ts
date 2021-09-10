import { Configuration } from 'webpack';
import { resolve } from 'path';

const configuration = {
  ignoredModules: [
    // Unused - warnings
    '@sap/hdbext',
    'mongodb',
    'mysql',
    'mysql2',
    'oracledb',
    'pg-native',
    'pg-query-stream',
    'react-native-sqlite-storage',
    'redis',
    'ioredis',
    'sql.js',
    'sqlite3',
    'mssql',
    'typeorm-aurora-data-api-driver',
    // Causes error
    'pg-native',
    'sharp',
  ],
  dependencyBundle: [
    'dotenv',
    'lodash',
    'aws-sdk',
    'typeorm',
    'typedi',
    'typeorm-typedi-extensions',
    'pg'
  ],
}

// BELOW: Implementation

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
        test: /\.ts$/,
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    alias: {
      '@': resolve('./src/'),
      '@test': resolve('../test/'),
      'pg-native': resolve('./src/mock-pg-native.js'),
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
  },
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
  },
  externals: Object.fromEntries(configuration.ignoredModules.map((key) => [key, `commonjs ${key}`])),
};

export default function (params: CustomWebpackParams): Configuration {
  const entry: Record<string, any> = Object.fromEntries(params.entries.map(key => [key, {
    import: `${params.basePackage}/${key}/${params.entrypointName}`,
    //dependOn: 'lib',
  }]));

  //entry.lib = configuration.dependencyBundle;

  return { ...basicWebpackConfig, entry };
}
