[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

# excerpt-html

parses a given html text for a good excerpt.

# Install

```
$ npm i excerpt-html --save
```

# API usage

```JavaScript
var htmlCode = '<p>Hello world</p>';
var excerptHtml = require('excerpt-html');
var excerpt = excerptHtml(htmlCode);
```

It will either use the first found paragraph or everything up to a 

`<!-- more -->`

# Options

You can specify a few options that modify the way the excerpt is parsed:

``` JavaScript
excerptHtml(htmlCode, {
    moreRegExp:  /\s*<!--\s*more\s*-->/i,  // Search for the slug
    stripTags:   true, // Set to false to get html code
    pruneLength: 140, // Amount of characters that the excerpt should contain
    pruneString: '…', // Character that will be added to the pruned string
})
```

Note: `pruneLength` and `prunestring` only work when `stripTags` is set to `true` (default).

# History

To make this project we detached the code of [metalsmith-better-excerpts](https://github.com/simbo/metalsmith-better-excerpts) from `metalsmith`.



