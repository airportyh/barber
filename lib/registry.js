var StyleSheet = require('./stylesheet')

function Registry(){
  this.sheets = {}
}

Registry.prototype = {
  get: function(name){
    name = name || ''
    var sheet = this.sheets[name] = this.sheets[name] || new StyleSheet
    return sheet
  },
  installAll: function(){
    for (var name in this.sheets){
      var sheet = this.sheets[name]
      sheet.install()
    }
  },
  uninstallAll: function(){
    for (var name in this.sheets){
      var sheet = this.sheets[name]
      sheet.uninstall()
    }
  }
}

module.exports = Registry