"use strict";
/**
 * Extracted from https://github.com/simbo/metalsmith-better-excerpts
 * (published under MIT license)
 */

var cheerio = require('cheerio');
var unescapeHTML = require("underscore.string/unescapeHTML");
var stripTags = require("underscore.string/stripTags");
var prune = require("underscore.string/prune");
var path = require('path');

/**
 * retrieve excerpt from file object by extracting contents until a 'more' tag
 * @param  {Object} file   file object
 * @param  {RegExp} regExp 'more' tag regexp
 * @return {mixed}         excerpt string or false
 */
function getExcerptByMoreTag(html, regExp) {
    var excerpt = false;
    html = cheerio.load('<root>' + html + '</root>')('root').html();
    var match = html.search(regExp);
    if (match > -1) {
        excerpt = html.slice(0, Buffer.byteLength(html.slice(0, match)));
        excerpt = unescapeHTML(excerpt);
    }
    return excerpt;
}


/**
 * retrieve excerpt from file object by extracting the first p's contents
 * @param  {Object} file file object
 * @return {mixed}       excerpt string or false
 */
function getExcerptByFirstParagraph(html) {
    var $ = cheerio.load(html),
        p = $('p').first(),
        excerpt = p.length ? p.html().trim() : false;
    if (excerpt) {
        excerpt = unescapeHTML(excerpt);
    }
    return excerpt;
}


/**
 * Check if a filename has an html extension
 * @param  {String}  filename path to check
 * @return {Boolean}          test result
 */
function isHtml(filename) {
    return /\.html?/.test(path.extname(filename)) ? true : false;
}

module.exports = function excerptHtml(html, options) {
    if (!options) {
        options = {}
    }
    options = {
        moreRegExp: options.moreRegExp || /\s*<!--\s*more\s*-->/i,
        stripTags:  options.stripTags !== false,
        pruneLength: typeof options.pruneLength === 'number' ? options.pruneLength : 140,
        pruneString: typeof options.pruneString === 'string' ? options.pruneString : '…'
    };
    var excerpt = getExcerptByMoreTag(html) || getExcerptByFirstParagraph(html, options.moreRegExp);
    if (options.stripTags) {
        excerpt = stripTags(excerpt);
        if (options.pruneLength > 0 && options.pruneString) {
            excerpt = prune(excerpt, options.pruneLength, options.pruneString);
        }
    }
    return excerpt;
};