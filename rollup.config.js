export default {
  input: "index.js",
  output: [{
    name: "concaveman",
    format: "cjs",
    indent: false,
    file: './dist/index-cjs.js',
    exports: 'auto'
  },
  {
    name: "concaveman",
    format: "esm",
    indent: false,
    file: './dist/index-esm.js',
  }],
  external: ['rbush', 'tinyqueue', 'point-in-polygon', 'robust-predicates'],
  plugins: []
}
