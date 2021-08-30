const path = require('path');
const typescript = require('rollup-plugin-typescript2');
const resolve = require('rollup-plugin-node-resolve');

const dirMap = {
  'date-format-plugin': path.resolve(__dirname, `../src/index.ts`)
};

const formatNameMap = {
  'date-format-plugin': 'DateFormatPlugin'
};

const pkgNameMap = {
  'date-format-plugin': 'date-format-plugin'
};

const formatMap = {
  es: 'esm',
  umd: ''
};

const tsPlugin = typescript({
  tsconfig: path.resolve(__dirname, '../tsconfig.json'),
  cacheRoot: path.resolve(__dirname, '../node_modules/.rts2_cache'),
  useTsconfigDeclarationDir: true,
  tsconfigOverride: {
    exclude: ['**/tests']
  }
});

const package = require(path.resolve(__dirname, `../package.json`));
const version = process.env.VERSION || package.version;

function createConfig(pkg, format) {
  const config = {
    input: {
      input: dirMap[pkg],
      plugins: [resolve(), tsPlugin]
    },
    output: {
      banner: `/**
  * date-format-plugin v${version}
  *
  * @link ${package.homepage}
  * @source ${package.repository}
  * (c) ${new Date().getFullYear()} An Ha
  * @license MIT
  */`,
      format,
      name: format === 'umd' ? formatNameMap[pkg] : undefined,
      sourcemap: true
    }
  };

  config.bundleName = `${pkgNameMap[pkg]}${formatMap[format] ? '.' + formatMap[format] : ''}.js`;

  return config;
}

module.exports = {
  formatNameMap,
  pkgNameMap,
  formatMap,
  createConfig
};
