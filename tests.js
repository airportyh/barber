var barber = require('./index')
var StyleSheet = barber.StyleSheet
var test = require('tape')

test('parseStyle', function(t){
  var b = new StyleSheet
  t.deepEqual(b.parseStyle('.view { border: 1px solid black; }'),
    {selector: '.view', properties: {border: '1px solid black'}})
  t.deepEqual(b.parseStyle('.view { border: 1px solid black; width: 10px; }'),
    {selector: '.view', properties: {
      border: '1px solid black',
      width: '10px'
    }})
  t.end()
})

test('basic', function(t){
  var b = new StyleSheet
  b.add('.view', {
    border: '1px solid black'
  })
  b.install()
  var div = document.createElement('div')
  div.className = 'view'
  document.body.appendChild(div)
  t.equal(getStyleProp(div, 'border-top-width'), '1px')
  t.equal(getStyleProp(div, 'border-top-style'), 'solid')
  t.assert(getStyleProp(div, 'border-top-color').match(/black|rgb\(0, 0, 0\)/))
  b.uninstall()
  t.assert(getStyleProp(div, 'border-top-width').match(/0px|medium/))
  t.end()
})

test('can use camelCase', function(t){
  var b = new StyleSheet
  b.add('.view', {
    backgroundColor: 'red'
  })
  b.install()
  var div = document.createElement('div')
  div.className = 'view'
  document.body.appendChild(div)
  t.assert(getStyleProp(div, 'background-color').match(/red|rgb\(255, 0, 0\)/))
  b.uninstall()
  t.assert(!getStyleProp(div, 'background-color').match(/red|rgb\(255, 0, 0\)/))
  t.end()
  t.end()
})

test('string', function(t){
  var b = new StyleSheet
  b.add('.view { border: 1px solid black; }')
  b.install()
  var div = document.createElement('div')
  div.className = 'view'
  document.body.appendChild(div)
  t.equal(getStyleProp(div, 'border-top-width'), '1px')
  b.uninstall()
  t.end()
})

test('still updates after install', function(t){
  var b = new StyleSheet
  b.install()
  var div = document.createElement('div')
  div.className = 'view'
  document.body.appendChild(div)
  b.add('.view { border: 1px solid black; }')
  t.equal(getStyleProp(div, 'border-top-width'), '1px')
  b.uninstall()
  t.end()
})

if (!navigator.userAgent.match(/MSIE/))
// should use feature detection here, but lazy
test('will auto-prefix', function(t){
  var b = new StyleSheet
  b.install()
  b.add('.view', {
    'transition-duration': '4s'
  })
  var div = document.createElement('div')
  div.className = 'view'
  document.body.appendChild(div)
  t.equal(getStyleProp(div, prefix() + '-transition-duration'), '4s')
  b.uninstall()
  t.end()
})

test('will auto-prefix 2', function(t){
  var b = new StyleSheet
  b.install()
  b.add('.view', {
    'text-overflow': 'ellipsis'
  })
  var div = document.createElement('div')
  div.className = 'view'
  document.body.appendChild(div)
  t.equal(getStyleProp(div, 'text-overflow'), 'ellipsis')
  b.uninstall()
  t.end()
})

test('stylesheet registry', function(t){
  t.equal(barber.styleSheet('mynamespace'), barber.styleSheet('mynamespace'))
  t.notEqual(barber.styleSheet('mynamespace'), barber.styleSheet('another_namespace'))
  t.end()
})

test('no arg returns default stylesheet', function(t){
  t.equal(barber.styleSheet(), barber.styleSheet(''))
  t.end()
})

test('install all style sheets', function(t){
  barber.styleSheet().add('.view { border: 1px solid blue; }')
  barber.styleSheet('sheet').add('.view { background-color: red; }')
  var div = document.createElement('div')
  div.className = 'view'
  document.body.appendChild(div)
  barber.install()
  t.equal(getStyleProp(div, 'border-top-width'), '1px')
  t.assert(getStyleProp(div, 'background-color').match(/red|rgb\(255, 0, 0\)/))
  barber.uninstall()
  t.notEqual(getStyleProp(div, 'border-top-width'), '1px')
  t.assert(!getStyleProp(div, 'background-color').match(/red|rgb\(255, 0, 0\)/))
  t.end()
})

function prefix(){
  if (window.getComputedStyle){
    var style = getComputedStyle(document.documentElement)
    if ('OTabSize' in style) return '-o'
    else if (style.getPropertyValue('-moz-column-count')) return '-moz'
    else if (style.getPropertyValue('-webkit-column-count')) return '-webkit'
    else if (style.getPropertyValue('-ms-text-overflow')) return '-ms'
  }
}

function getStyleProp(elm, prop){
  var value
  if (window.getComputedStyle){
    var style = getComputedStyle(elm)
    value = style.getPropertyValue(prop)
  }
  if (!value && elm.currentStyle){
    value = elm.currentStyle[prop]
  }
  return value
}