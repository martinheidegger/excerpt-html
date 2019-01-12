'use strict'

var test = require('tap').test
var excerptHtml = require('..')

test('documentation example', function (t) {
  t.equal(excerptHtml('<p>Hello world</p>'), 'Hello world')
  t.end()
})

test('non html example', function (t) {
  t.equal(excerptHtml('Hello world'), 'Hello world')
  t.end()
})

test('more section without html tags', function (t) {
  t.equal(excerptHtml('Fancy text it is more than I need <!-- more --> Is still here'), 'Fancy text it is more than I need')
  t.end()
})

test('more section without html tags doesnt work with or without spaces', function (t) {
  t.equal(excerptHtml('Fancy text it is more than I need<!-- more --> Is still here'), 'Fancy text it is more than I need')
  t.end()
})

test('cut off by word at default', function (t) {
  t.equal(excerptHtml('Hello you', {
    pruneLength: 8,
    pruneString: ''
  }), 'Hello')
  t.end()
})

test('cut off characters without prune separator', function (t) {
  t.equal(excerptHtml('Hello you', {
    pruneLength: 8,
    pruneString: '',
    pruneSeparator: ''
  }), 'Hello yo')
  t.end()
})

test('cut off characters without prune separator', function (t) {
  t.equal(excerptHtml('Hello you', {
    pruneLength: 8,
    pruneSeparator: ''
  }), 'Hello y…')
  t.end()
})

test('strip html tags', function (t) {
  t.equal(excerptHtml('<p>This is a <b>fancy world, I think</b> it might be weird to ask me.</p>', {
    stripTags: false
  }), 'This is a <b>fancy world, I think</b> it might be weird to ask me.')
  t.end()
})

test('cropping stripped html tags doesnt work', function (t) {
  t.equal(excerptHtml('<p>This is a <b>fancy world, I think</b> it might be weird to ask me.</p>', {
    stripTags: false,
    pruneLength: 16
  }), 'This is a <b>fancy world, I think</b> it might be weird to ask me.')
  t.end()
})

test('cropping stripped html tags doesnt work', function (t) {
  t.equal(excerptHtml('<p>Hello World</p><p>This is not taken</p>', {
    stripTags: false,
    pruneLength: 16
  }), 'Hello World')
  t.end()
})

test('cropping stripped html tags doesnt work', function (t) {
  t.equal(excerptHtml('<p>Hello World</p><p>This is not taken</p>', {
    stripTags: false,
    pruneLength: 50
  }), 'Hello World')
  t.end()
})

test('unescaping should work for all characters', function (t) {
  t.equal(excerptHtml('Hello &amp; World &ouml; &hearts;'), 'Hello & World ö ♥')
  t.end()
})

test('dont prune text if pruneLength is < 1', function (t) {
  var longString = 'This is text. This text is longer than 140 characters, the default value for' +
    'this method. If pruneLength is set to a number < 1 it will ignore the default' +
    'limit of 140. Let us make the text a little longer.'
  t.equal(excerptHtml(longString, {
    pruneLength: -1
  }), longString)
  t.end()
})

test('empty text', function (t) {
  t.equal(excerptHtml('', {
    pruneLength: -1
  }), '')
  t.end()
})

test('make sure that empty tags are removed', function (t) {
  t.equal(excerptHtml('<p><img></img> <img></img> test <img></img> </p>', {
    stripTags: true
  }), 'test')
  t.end()
})
