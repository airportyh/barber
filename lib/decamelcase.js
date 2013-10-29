
module.exports = function deCamelCase(str) {
  // stolen from <https://github.com/LeaVerou/prefixfree/blob/gh-pages/prefixfree.js#L151>
  return str.replace(/[A-Z]/g, function($0) { return '-' + $0.toLowerCase() });
}