var deCamelCase = require('./decamelcase')

module.exports = rulesFor
function rulesFor(def, parentSelector, rules){
  rules = rules || []
  for (var key in def){
    var props = def[key]
    var subSelectors = key.split(',')
    for (var i = 0; i < subSelectors.length; i++){
      var subSelector = subSelectors[i].trim()
      generateRulesForSubSelector(subSelector, props, null, rules)
    }
  }
  return rules
}

function generateRulesForSubSelector(subSelector, props, parentSelector, rules){
  parentSelector = parentSelector || ''
  var selector = parentSelector + subSelector
  var ruleProps = {}
  var hasRules = false
  for (var key in props){
    var parts = key.split(',')
    for (var i = 0; i < parts.length; i++){
      var value = props[key]
      if (typeof value === 'string'){
        hasRules = true
        ruleProps[deCamelCase(key)] = value
      }else if (value && typeof value === 'object'){
        var subSelectors = key.split(',')
        for (var i = 0; i < subSelectors.length; i++){
          var subSelector = subSelectors[i].trim()
          generateRulesForSubSelector(subSelector, value, 
            selector + ' ', rules)
        }
      }
    }
  }
  if (hasRules){
    rules.push({sel: selector, props: ruleProps})
  }
}