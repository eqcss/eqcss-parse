![](http://i.imgur.com/OUQzoiA.png)

# eqcss-parse

**A Command-Line Parser for EQCSS Syntax**

[![Join the chat at https://gitter.im/eqcss/eqcss](https://badges.gitter.im/eqcss/eqcss.svg)](https://gitter.im/eqcss/eqcss?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## What does eqcss-parse do?

The main purpose of `eqcss-parse` is to consume the [custom CSS-like syntax](http://tomhodgins.github.io/element-queries-spec/element-queries.html) of [EQCSS](http://elementqueries.com) and parse it, transforming the selector(s), condition(s) and CSS styles in a JavaScript objects that can be loaded directly into EQCSS via `EQCSS.register`.

As an example, consider the following element query in EQCSS syntax which would make the `html` element green when any `input` on the page contains more than 3 characters:

```css
@element input and (max-characters: 3) {
  html {
    background: lime;
  }
}
```

After running this through `eqcss-parse` our query has turned into something that looks like this:

```javascript
EQCSS.register([{"selector":"input","conditions":[{"measure":"max-characters","value":"3","unit":null}],"style":" html { background: lime; } "},]);
```

Here the selector (`input`), the condition (`max-characters`), and the CSS styles have been turned into a JavaScript object. You'll also notice the output queries are wrapped in `EQCSS.register()` which would load them directly into the EQCSS plugin if it was running on the page.


## Why would I use `eqcss-parse`?

Perhaps you want a workflow where you are free to write EQCSS in your source code and project files, but don't desire to output EQCSS's syntax in production. By using `eqcss-parse` during your build process you could end up with 100% standard JS objects so you don't need to include any non-standard syntax in production.


## How do I use `eqcss-parse`

The simplest way to use this package is to install it via NPM with the following command:

```
npm install eqcss-parse
```

To convert an `.eqcss` file, or any file containing EQCSS syntax into JavaScript, use the `eqcss-parse` command. It can work with standard text input, as well as reading from a file, and output either to the command-line, or optionally to a file as well.

### Reading from `stdin`

When using standard input, any way that you're able to pass a string of text to `eqcss-parse` will work. Here are some examples using `echo`, `curl` to download remote source code to process, and `cat` to parse the contents of multiple files as a batch:

```
echo "@element html { $this { background: lime; } }" | eqcss-parse
```

```
curl http://elementqueries.com | eqcss-parse
```

```
cat *.eqcss | eqcss-parse
```

### Reading from a file

To read from a file, the first argument will automatically be used. In this example we will display the output of processing `input.eqcss` to the command-line:

```
eqcss-parse input.eqcss
```

### Outputing to file

There are at least two ways of specifying an output file. If you are processing an individual file, the second argument you supply will automatically be used.

In this example, processing `input.eqcss` will produce `output.js`:

```
eqcss-parse input.eqcss output.js
```

If you have read from `stdin` instead of from a file you are not able to make use of the second argument because there is no first argument present. Suppose you were parsing queries from `a.eqcss` and `b.eqcss` and wanted to output both to `c.js`, we can use `>` to send output to a file:

```
cat a.eqcss b.eqcss | eqcss-parse > c.js
```