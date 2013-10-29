var barber = require('./index')
var StyleSheet = barber.StyleSheet
var test = require('tape')

var rulesFor = require('./lib/rules_for')
test('rulesFor basic', function(t){
  var rules = rulesFor({
    '.view': {
      border: '1px solid black'
    }
  })
  t.deepEqual(rules, 
    [{sel: '.view', props: { border: '1px solid black' }}])
  t.end()
})


test('rulesFor multiple properties', function(t){
  var rules = rulesFor({
    '.view': {
      border: '1px solid black',
      color: 'red'
    }
  })
  t.deepEqual(rules, 
    [{
      sel: '.view', 
      props: { border: '1px solid black', color: 'red' }
    }])
  t.end()
})


test('rulesFor multiple selectors', function(t){
  var rules = rulesFor({
    '.view': {
      border: '1px solid black'
    },
    '.panel': {
      'border-radius': '5px'
    }
  })
  t.deepEqual(rules, [
    {sel: '.view', props: {border: '1px solid black'}},
    {sel: '.panel', props: {'border-radius': '5px'}}
  ])
  t.end()
})


test('rulesFor nested', function(t){
  var rules = rulesFor({
    '.view': {
      pre: {
        'font-family': 'monospace'
      },
      border: '1px solid black'
    }
  })
  t.deepEqual(rules, [
    {sel: '.view pre', props: { 'font-family': 'monospace' }},
    {sel: '.view', props: { border: '1px solid black' }}
  ])
  t.end()
})


test('rulesFor nested (double nest)', function(t){
  var rules = rulesFor({
    '.view': {
      pre: {
        'font-family': 'monospace',
        '.highlight': {
          'background-color': 'yellow'
        }
      },
      border: '1px solid black'
    }
  })
  t.deepEqual(rules, [
    {sel: '.view pre .highlight', props: { 'background-color': 'yellow' }},
    {sel: '.view pre', props: { 'font-family': 'monospace' }},
    {sel: '.view', props: { border: '1px solid black' }}
  ])
  t.end()
})

test('rulesFor camelCase', function(t){
  var rules = rulesFor({
    '.view': {
      fontFamily: 'monospace'
    }
  })
  t.deepEqual(rules, [
    {sel: '.view', props: {'font-family': 'monospace'}}
  ])
  t.end()
})

var propertiesText = require('./lib/properties_text')
test('textify a rule', function(t){
  t.equal(
    propertiesText({sel: '.view', props: {'font-family': 'monospace'}}),
    'font-family: monospace; '
  )
  t.end()
})

var textify = require('./lib/textify')
test('textify a rule', function(t){
  t.equal(
    textify({sel: '.view', props: {'font-family': 'monospace'}}),
    '.view { font-family: monospace; }'
  )
  t.end()
})


test('basic', function(t){
  var b = new StyleSheet
  b.add({
    '.view': {
      border: '1px solid black'
    }
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

test('can use camelCase', function(t){
  var b = new StyleSheet
  b.add({
    '.view': {
      backgroundColor: 'red'
    }
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

test('still updates after install', function(t){
  var b = new StyleSheet
  b.install()
  var div = document.createElement('div')
  div.className = 'view'
  document.body.appendChild(div)
  b.add({
    '.view': {
      border: '1px solid black'
    }
  })
  t.equal(getStyleProp(div, 'border-top-width'), '1px')
  b.uninstall()
  t.end()
})


if (!navigator.userAgent.match(/MSIE/))
// should use feature detection here, but lazy
test('will auto-prefix', function(t){
  var b = new StyleSheet
  b.install()
  b.add({
    '.view': {
      'transition-duration': '4s'
    }
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
  b.add({
    '.view': {
      'text-overflow': 'ellipsis'
    }
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
  barber.styleSheet().add({
    '.view': {
      border: '1px solid blue'
    }
  })
  barber.styleSheet('sheet').add({
    '.view': {
      backgroundColor: 'red'
    }
  })
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