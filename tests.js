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

if (typeof window !== 'undefined'){

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

}

function getStyleProp(elm, prop){
  if (navigator.userAgent.match(/MSIE/) && elm.currentStyle){
    return elm.currentStyle[prop]
  }
  if (window.getComputedStyle){
    var style = getComputedStyle(elm)
    return style.getPropertyValue(prop)
  }
}