var deCamelCase = require('./decamelcase')

module.exports = rulesFor
function rulesFor(def, parentSelector, rules){
  rules = rules || []
  for (var subSelector in def){
    generateRulesForSubSelector(subSelector, def[subSelector], null, rules)
  }
  return rules
}

function generateRulesForSubSelector(subSelector, props, parentSelector, rules){
  parentSelector = parentSelector || ''
  var selector = parentSelector + subSelector
  var ruleProps = {}
  for (var key in props){
    var value = props[key]
    if (typeof value === 'string'){
      ruleProps[deCamelCase(key)] = value
    }else if (value && typeof value === 'object'){
      generateRulesForSubSelector(key, value, 
        selector + ' ', rules)
    }
  }
  rules.push({sel: selector, props: ruleProps})
}