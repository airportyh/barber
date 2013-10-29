Barber - Write CSS in JS
========================

Barber lets you write CSS in Javasript. Now you might ask: *why would you want to do that?*

1. You swim in Javascript anyway, why not?
2. Javacript is more programmatic/dynamic. Variables, for example.
3. Barber automatically handles vendor prefixing of CSS properties for you.
4. Harness the power of Javascript modules! You can now package up CSS as part of your module to be shared between projects and with the rest of the world.

## Install

Install `barber` via NPM or Bower.

## Usage

Simple example

    var Barber = require('barber')
    var styles = Barber.styleSheet()

    styles.add({
      'button': {
        'border-radius': '10px', // vendor prefixes are applied for you
        boxShadow: '3px 2px 3px #888', // can also camelCase
        'background': '#ddd'
      }
    })

    Barber.install() // apply the styles to the page

Alternatively, you can pass in one single string of CSS to `add()`

    styles.add('button { border-radius: 10px; box-shadow: 3px 2px 3px #888; }')

## Selector Nesting

Similarly to most CSS preprocessors, Barber supports selector nesting

    styles.add({
      '.view': {
        boxShadow: '3px 2px 3px #888',
        pre: {
          fontFamily: 'Monospace'
        }
      }
    })

This will generate the rules:

* `.view { box-shadow: 3px 2px 3px #888; }`, and
* `.view pre { font-family: Monospace; }`

## Namespaces

In the above example, calling `Barber.styleSheet()` returns the default stylesheet, but you can also namespace your stylesheets

    var styles = Barber.styleSheet('components')

`Barber.install()` still installs all available stylesheets, but you can choose to instead install each stylesheet separately

    Barber.styleSheet().install()
    Barber.styleSheet('components').install()

This gives you more control over what stylesheets you want applied.

## Using Barber with Modules

Barber was design with authoring modules in mind. How that would work is, in your Javascript module, you would have code that creates a stylesheet

    // awesome_module.js
    var styles = require('barber').styleSheet('awesome_module')

    styles.add(...)
    styles.add(...)
    ...

*Note that no stylesheet has been installed within the module code*.

Next, someone else installs your awesome module, and includes it in their app somewhere

    var awesome = require('awesome_module')

Then, in a separate part of their code - where they bootstrap the application - they would install the stylesheets.

    Barber.install()

They can also choose to skip the stylesheet from your module by explicitly installing each stylesheet they want included.

    Barber.styleSheet().install()
    Barber.styleSheet('some_other_module').install()


