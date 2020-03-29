const { override, fixBabelImports } = require('customize-cra');

const addWorkerLoader = () => config => {
  config.output.globalObject = 'this';
  return config;
};

module.exports = {
  webpack: override(
    fixBabelImports('import', {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: 'css'
    }),
    addWorkerLoader()
  )
};
