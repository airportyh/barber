
var rulesFor = require('./rules_for')
var propertiesText = require('./properties_text')
var textify = require('./textify')
var addRule = require('./add_rule')
var parseRule = require('./parse_style')

function StyleSheet(){
  this.styles = {}
  this.styleElm = null
}

StyleSheet.prototype = {
  add: function(def){
    var rules
    if (typeof def === 'string'){
      rules = [parseRule(def)]
    }else{
      rules = rulesFor(def)
    }
    
    var modified = false
    for (var i = 0; i < rules.length; i++){
      var rule = rules[i]
      var text = textify(rule)
      if (!(text in this.styles)){
        this.styles[text] = rule
        modified = true
      }
    }
    
    if (modified && this.styleElm){
      // already installed
      // want to update the live sheet
      addRule(this.styleElm, rule)
    }
  },
  install: function(parentElm){
    this.styleElm = document.createElement('style')
    var head = parentElm || document.getElementsByTagName('head')[0]
    head.appendChild(this.styleElm)
    for (var prop in this.styles){
      var rule = this.styles[prop]
      addRule(this.styleElm, rule)
    }
  },
  uninstall: function(){
    this.styleElm.parentNode.removeChild(this.styleElm)
    delete this.styleElm
  }
}

module.exports = StyleSheet