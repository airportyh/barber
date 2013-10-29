// maybe needed if we want to support adding by string
module.exports = function parseStyle(rule){
  var m = rule.match(/([^ \t]+)\s+{\s*(.+?)\s*}/)
  var propStrings = m[2].split(';')
  var properties = {}
  for (var i = 0; i < propStrings.length; i++){
    if (propStrings[i].length === 0) continue
    var parts = propStrings[i].split(':')
    properties[trim(parts[0])] = trim(parts[1])
  }
  return {
    sel: m[1],
    props: properties
  }
}

function trim(str){
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '');
}