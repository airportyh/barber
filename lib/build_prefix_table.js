var deCamelCase = require('./decamelcase')

module.exports = function buildPrefixTable(){
  var prefixedProperties = {}
  var docElm = document.documentElement
  var styles
  if (window.getComputedStyle){
    styles = window.getComputedStyle(docElm)
  }else{
    styles = docElm.currentStyle
  }
  
  if (styles.length){
    for (var i = 0; i < styles.length; i++){
      var prop = styles[i]
      checkProp(prop)
    }
  }else{
    for (var key in styles){
      var prop = deCamelCase(key)
      checkProp(prop)
    }
  }
  function checkProp(prop){
    if (prop.charAt(0) === '-'){
      // is prefix
      var m = prop.match(/^\-([^-]+)\-(.+)$/)
      if (!m) return null
      var prefix = m[1]
      var unPrefixedProp = m[2]
      prefixedProperties[unPrefixedProp] = prefix
    } 
  }
  return prefixedProperties
}
