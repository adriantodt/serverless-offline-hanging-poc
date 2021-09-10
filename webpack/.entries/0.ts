import webpackConfig from '../config.base';

export default webpackConfig({
  basePackage: './src/handlers',
  entrypointName: 'handler.ts',
  entries: ["hello"],
});
