var deCamelCase = require('./decamelcase')
var propertiesText = require('./properties_text')

module.exports = function renderStyle(rule){
  var selector = rule.sel
  return selector + ' { ' + propertiesText(rule) + '}'
}