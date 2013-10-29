var StyleSheet = require('./lib/stylesheet')
var Registry = require('./lib/registry')

var registry = new Registry

module.exports = {
  StyleSheet: StyleSheet,
  styleSheet: function(name){
    return registry.get(name)
  },
  install: function(){
    registry.installAll()
  },
  uninstall: function(){
    registry.uninstallAll()
  }
}