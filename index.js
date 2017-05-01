#!/usr/bin/env node

'use strict'

/*

# eqcss-parse
## version 1.0.0

A node script that consumes EQCSS's css-like syntac and emits the parsed queries as JavaScript objects that can be loaded into EQCSS via `EQCSS.register()`

- github.com/eqcss/eqcss-parse
- elementqueries.com

Authors: Tommy Hodgins, Maxime Euzière

Special Thanks: Ben Briggs & CSSnano

License: MIT

*/

// Import modules
var fs = require('fs')
var read = require('read-file-stdin')
var write = require('write-file-stdout')

// Read arguments from command
var opts = require('minimist')(process.argv.slice(2))
var file = opts._[0]
var out = opts._[1]


// Read EQCSS syntax from stdin or file
read(file, function(err, buf) {

  if (err) {

    throw err

  }

  /*
   * EQCSS.parse()
   * Called by load for each script / style / link resource.
   * Generates data for each Element Query found
   */

  function parse(code) {

    var parsed_queries = []

    // Cleanup
    code = code.replace(/\s+/g, ' '); // reduce spaces and line breaks
    code = code.replace(/\/\*[\w\W]*?\*\//g, ''); // remove comments
    code = code.replace(/@element/g, '\n@element'); // one element query per line
    code = code.replace(/(@element.*?\{([^}]*?\{[^}]*?\}[^}]*?)*\}).*/g, '$1'); // Keep the queries only (discard regular css written around them)

    // Parse

    // For each query
    code.replace(/(@element.*(?!@element))/g, function(string, query) {

      // Create a data entry
      var dataEntry = {};

      // Extract the selector
      query.replace(/(@element)\s*(".*?"|'.*?'|.*?)\s*(and\s*\(|{)/g, function(string, atrule, selector, extra) {

        // Strip outer quotes if present
        selector = selector.replace(/^\s?['](.*)[']/, '$1');
        selector = selector.replace(/^\s?["](.*)["]/, '$1');

        dataEntry.selector = selector;

      })

      // Extract the conditions (measure, value, unit)
      dataEntry.conditions = [];
      query.replace(/and ?\( ?([^:]*) ?: ?([^)]*) ?\)/g, function(string, measure, value) {

        // Separate value and unit if it's possible
        var unit = null;
        unit = value.replace(/^(\d*\.?\d+)(\D+)$/, '$2');

        if (unit === value) {

          unit = null;

        }

        value = value.replace(/^(\d*\.?\d+)\D+$/, '$1');
        dataEntry.conditions.push({measure: measure, value: value, unit: unit});

      });

      // Extract the styles
      query.replace(/{(.*)}/g, function(string, style) {

        dataEntry.style = style;

      });

      // Add it to data
      parsed_queries.push(dataEntry);

    });

    if (0 < parsed_queries.length) {

    var output = '['

    for (var i=0; i<parsed_queries.length; i++) {

      output += JSON.stringify(parsed_queries[i]) + ','

    }

    output += ']'

    return 'EQCSS.register(' + output + ');\n'

    }

  }

  var result = parse(String(buf))


  // If parse successfully returned at least one parsed query
  if (result) {

    // Write the result to stdout or file
    write(out, result)

  }

})