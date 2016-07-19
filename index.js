'use strict'
/**
 * Extracted from https://github.com/simbo/metalsmith-better-excerpts
 * (published under MIT license)
 */

var cheerio = require('cheerio')
var unescapeHTML = require('lodash.unescape')
var stripTags = require('striptags')
var truncate = require('lodash.truncate')

/**
 * retrieve excerpt from file object by extracting contents until a 'more' tag
 * @param  {Object} file   file object
 * @param  {RegExp} regExp 'more' tag regexp
 * @return {mixed}         excerpt string or false
 */
function getExcerptByMoreTag (html, regExp) {
  var excerpt = false
  html = cheerio.load('<root>' + html + '</root>')('root').html()
  var match = html.search(regExp)
  if (match > -1) {
    excerpt = html.slice(0, Buffer.byteLength(html.slice(0, match)))
    excerpt = unescapeHTML(excerpt)
  }
  return excerpt
}

/**
 * retrieve excerpt from file object by extracting the first p's contents
 * @param  {Object} file file object
 * @return {mixed}       excerpt string or false
 */
function getExcerptByFirstParagraph (html) {
  var $ = cheerio.load(html)
  var p = $('p').first()
  var excerpt = p.length ? p.html().trim() : html
  if (excerpt) {
    excerpt = unescapeHTML(excerpt)
  }
  return excerpt
}

module.exports = function excerptHtml (html, options) {
  if (!options) {
    options = {}
  }
  var excerpt = getExcerptByMoreTag(html, options.moreRegExp || /\s*<!--\s*more\s*-->/i)
  if (!excerpt) {
    excerpt = getExcerptByFirstParagraph(html)
  }
  if (options.stripTags !== false) {
    excerpt = stripTags(excerpt)
    var pruneLength = typeof options.pruneLength === 'number' ? options.pruneLength : 140
    if (pruneLength > 0) {
      excerpt = truncate(excerpt, {
        length: pruneLength,
        omission: typeof options.pruneString === 'string' ? options.pruneString : '…',
        separator: typeof options.pruneSeparator === 'string' ? options.pruneSeparator : ' '
      })
    }
  }
  return excerpt
}
