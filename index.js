'use strict'
/**
 * Extracted from https://github.com/simbo/metalsmith-better-excerpts
 * (published under MIT license)
 */

var cheerio = require('cheerio')
var unescapeHTML = require('he').unescape
var stripTags = require('striptags')
var truncate = require('lodash.truncate')

/**
 * retrieve excerpt from file object by extracting contents until a 'more' tag
 * @param  {string} html   file object
 * @param  {RegExp} regExp 'more' tag regexp
 * @return {string}         excerpt string or undefined
 */
function getExcerptByMoreTag (html, regExp) {
  html = cheerio.load('<root>' + html + '</root>')('root').html()
  var match = html.search(regExp)
  if (match > -1) {
    var excerpt = html.slice(0, Buffer.byteLength(html.slice(0, match)))
    return unescapeHTML(excerpt)
  }
}

/**
 * retrieve excerpt from file object by extracting the first p's contents
 * @param  {string} html file object
 * @return {string}       excerpt string
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

/**
 * @param {string} excerpt Already extracted excerpt
 * @param {Object} options stripping options
 * @param {number} [options.pruneLength]
 * @param {string} [options.pruneSeparator]
 * @param {string} [options.pruneString]
 * @return {string} The striped and pruned excerpt
 */
function stripTagsFromExcerpt (excerpt, options) {
  excerpt = stripTags(excerpt)
  excerpt = excerpt.replace(/^\s+|\s+$|\s+(?=\s)/g, '')
  var pruneLength = typeof options.pruneLength === 'number' ? options.pruneLength : 140
  if (pruneLength > 0) {
    excerpt = truncate(excerpt, {
      length: pruneLength,
      omission: typeof options.pruneString === 'string' ? options.pruneString : '…',
      separator: typeof options.pruneSeparator === 'string' ? options.pruneSeparator : ' '
    })
  }
  return excerpt
}

/**
 * Extracts the raw excerpt (without stripped tags) from the html
 *
 * @param {string} html Html string to look for the excerpt
 * @param {RegExp} [moreRegExp=/\s*<!--\s*more\s*-->/i] RegExp used to look for the end of the excerpt
 * @return If found, the excerpt from the more tag, else the excerpt contained in the first <p></p>
 */
function getRawExcerpt (html, moreRegExp) {
  if (!moreRegExp) {
    moreRegExp = /\s*<!--\s*more\s*-->/i
  }
  return getExcerptByMoreTag(html, moreRegExp) || getExcerptByFirstParagraph(html)
}

/**
 * Parses the excerpt for a given html string.
 *
 * @param {string}  html Html code to parse for the excerpt.
 * @param {Object}  [options] Options for parsing.
 * @param {RegExp}  [options.moreRegExp=/\s*<!--\s*more\s*-->/i] Regexp to look for the end of the excerpt. If this is not found
 * @param {boolean} [options.stripTags=true] Strip the tags from the html code when getting the excerpt.
 * @param {number}  [options.pruneLength=140] Maximum size of the excerpt (only functional if stripTags=true)
 * @param {string}  [options.pruneSeparator=' '] Character to look for when truncating a text
 * @param {string}  [options.pruneString='…'] String to be attached if pruning needs to happen
 * @returns {string} The excerpt found in the given html code.
 */
module.exports = function excerptHtml (html, options) {
  if (!options) {
    options = {}
  }
  var rawExcerpt = getRawExcerpt(html, options.moreRegExp)
  if (options.stripTags === false) {
    return rawExcerpt
  }
  return stripTagsFromExcerpt(rawExcerpt, options)
}
