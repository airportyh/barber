var propertiesText = require('./properties_text')

module.exports = function addRule(elm, rule){
  var selector = rule.sel
  var properties = propertiesText(rule)
  var sheet = elm.sheet || elm.styleSheet
  var rules = sheet.cssRules || sheet.rules
  if (sheet.addRule){
    sheet.addRule(selector, properties, rules.length)
  }else{
    var ruleText = selector + ' { ' + properties + '}'
    sheet.insertRule(ruleText, rules.length)
  }
}