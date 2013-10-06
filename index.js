

function Barber(){
  this.styles = {}
  this.styleElm = null
}

Barber.prototype = {
  add: function($1, $2){
    var key
    if (arguments.length === 2){
      this.styles[key = renderStyle($1, $2)] = {
        selector: $1,
        properties: $2
      }
    }else if (arguments.length === 1){
      this.styles[key = $1] = parseStyle($1)
    }else{
      throw new Error('Wrong number of arguments')
    }
    if (this.styleElm){
      // already installed
      // want to update the live sheet
      this._addRule(key, this.styles[key])
    }
  },
  styleSheet: function(){
    return keys(this.styles).join('\n')
  },
  install: function(parentElm){
    var style = this.styleElm = document.createElement('style')
    var head = parentElm || document.getElementsByTagName('head')[0]
    head.appendChild(style)
    for (var prop in this.styles){
      this._addRule(prop, this.styles[prop])
    }
  },
  _addRule: function(ruleText, rule){
    var props = ''
    var sheet = this.styleElm.sheet || this.styleElm.styleSheet
    var rules = sheet.cssRules || sheet.rules
    for (var key in rule.properties){
      props += key + ': ' + rule.properties[key] + '; '
    }
    if (sheet.addRule){
      sheet.addRule(rule.selector, props, rules.length)
    }else{
      sheet.insertRule(ruleText, rules.length)
    }
  },
  uninstall: function(){
    this.styleElm.parentNode.removeChild(this.styleElm)
    delete this.styleElm
  },
  parseStyle: parseStyle
}

function parseStyle(rule){
  var m = rule.match(/([^ \t]+)\s+{\s*(.+?)\s*}/)
  var propStrings = m[2].split(';')
  var properties = {}
  for (var i = 0; i < propStrings.length; i++){
    if (propStrings[i].length === 0) continue
    var parts = propStrings[i].split(':')
    properties[trim(parts[0])] = trim(parts[1])
  }
  return {
    selector: m[1],
    properties: properties
  }
}

function renderStyle(selector, props){
  var styles = []
  for (var prop in props){
    styles.push(prop + ': ' + props[prop] + '; ')
  }
  return selector + ' { ' + styles.join('') + '}'
}

function keys(obj){
  var ret = []
  for (var key in obj) ret.push(key)
  return ret
}

function trim(str){
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '');
}

module.exports = Barber