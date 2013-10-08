var Barber = require('./index')
var test = require('tape')


test('adds style as string', function(t){
  var b = new Barber
  b.add('.view { border: 1px solid black; }')
  t.equal(b.styleSheet(), '.view { border: 1px solid black; }')
  b.add('.item { background-color: yellow; }')
  t.equal(b.styleSheet(), [
    '.view { border: 1px solid black; }',
    '.item { background-color: yellow; }'
  ].join('\n'))
  t.end()
})

test('dedups exact matches', function(t){
  var b = new Barber
  b.add('.view { border: 1px solid black; }')
  b.add('.view { border: 1px solid black; }')
  t.equal(b.styleSheet(), '.view { border: 1px solid black; }')
  t.end()
})

test('adds style as object', function(t){
  var b = new Barber
  b.add('.view', {
    border: '1px solid black'
  })
  t.equal(b.styleSheet(), '.view { border: 1px solid black; }')
  t.end()
})

test('parseStyle', function(t){
  var b = new Barber
  t.deepEqual(b.parseStyle('.view { border: 1px solid black; }'),
    {selector: '.view', properties: {border: '1px solid black'}})
  t.deepEqual(b.parseStyle('.view { border: 1px solid black; width: 10px; }'),
    {selector: '.view', properties: {
      border: '1px solid black',
      width: '10px'
    }})
  t.end()
})

test('install', function(t){
  var b = new Barber
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

test('string install', function(t){
  var b = new Barber
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
  var b = new Barber
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
test('will auto-prefix', function(t){
  var b = new Barber
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
  var b = new Barber
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