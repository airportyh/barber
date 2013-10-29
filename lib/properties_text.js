var deCamelCase = require('./decamelcase')
var PrefixTable = require('./build_prefix_table')()

module.exports = function propsText(rule){
  var props = rule.props
  var styles = []
  for (var prop in props){
    var value = props[prop]
    prop = deCamelCase(prop)
    if (prop in PrefixTable){
      prop = '-' + PrefixTable[prop] + '-' + prop
    }
    styles.push(prop + ': ' + value + '; ')
  }
  return styles.join('')
}