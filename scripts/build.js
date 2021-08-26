const path = require('path');
const fs = require('fs-extra');
const { rollup } = require('rollup');
const chalk = require('chalk');
const Terser = require('terser');
const { createConfig } = require('./rollup.config');
const { reportSize } = require('./info');
const { generateDts } = require('./generate-dts');
const shell = require('shelljs');

const dist = path.join(__dirname, `../dist`);

async function minify({ code, bundleName }) {
  const output = await Terser.minify(code, {
    compress: true,
    mangle: true
  });

  const fileName = bundleName.replace(/\.js$/, '.min.js');
  const filePath = `${dist}/${fileName}`;
  fs.outputFileSync(filePath, output.code);
  const stats = reportSize({ code: output.code, path: filePath });
  console.log(`${chalk.green('Output File:')} ${fileName} ${stats}`);
}

async function copyLocales() {
  const localesDir = path.join(__dirname, '../locale');
  const files = fs.readdirSync(localesDir);
  console.log(chalk.cyan('Building i18n...'));

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    console.log(`${chalk.green(`Output File ${i + 1}/${files.length}: `)} ${file}`);

    const input = path.join(__dirname, '../locale', file);
    const out = path.join(__dirname, '../dist/locale', file);

    fs.copySync(input, out);
  }
}

async function build(pkg) {
  for (const format of ['es', 'umd']) {
    const { input, output, bundleName } = createConfig(pkg, format);
    const bundle = await rollup(input);
    const {
      output: [{ code }]
    } = await bundle.generate(output);

    const outputPath = path.join(dist, bundleName);
    fs.outputFileSync(outputPath, code);
    const stats = reportSize({ code, path: outputPath });
    // eslint-disable-next-line
    console.log(`${chalk.green('Output File:')} ${bundleName} ${stats}`);

    if (format === 'umd') {
      await minify({ bundleName, code });
    }
  }

  await generateDts(pkg);
}

(async function Bundle() {
  shell.rm('-rf', 'esm', 'dist');
  shell.exec('tsc -p tsconfig.dist.json');
  shell.exec(`
    NODE_ENV=esm babel esm-temp \
    --out-dir esm \
    --ignore 'esm-temp/types.js'
  `);

  await build('date-format-plugin');
  await copyLocales();

  shell.exec(`rm -rf esm-temp`);
})();
