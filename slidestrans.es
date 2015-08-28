/*
Copyright © 2015 Leo Liang <leoliang@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/


let fs = require('fs');
let async = require('async');
let cheerio = require('cheerio');


function readNotes(html) {
  let $ = cheerio.load(html);
  let notes = $('script').map((i, elem) => {
    let result = $(elem).text().match(/var\s+SLConfig\s*=(.*);/);
    return result ? JSON.parse(result[1]).deck.notes : null;
  }).get(0);

  let addNote = (m, section, key) => {
    let id = section.attr('data-id');
    m.set(key(), notes[id]);
    return m;
  };
  
  return Array.from($('div.slides > section').get()).reduce((m, elem, i) => {
    let section = $(elem);
    if (section.attr('class') === 'stack') {
      return Array.from($('section', elem).get()).reduce((m, elem, j) => addNote(m, $(elem), () => `${i}-${j}`), m);
    } else {
      return addNote(m, section, () => `${i}`);
    }
  }, new Map());
}

// main

async.parallel({
  index: done => {
    fs.readFile('./index.html', done);
  },
  style: done => {
    fs.readFile('./style.html', {encoding: 'utf-8'}, done);
  },
  content: done => {
    fs.readFile('./content.html', {encoding: 'utf-8'}, done);
  },
  exported: done => {
    fs.readFile('./export.html', done);
  }
}, (err, files) => {
  if (err) {
    throw err;
  }
  
  let $ = cheerio.load(files.index);
  $('#theme').remove();
  $('style').remove();
  $('body > div').remove();
  $('head').append(files.style);
  $('body').prepend(files.content);
  
  let speakerNote = note => `<aside class="notes">${note.split('\n').join('<br />')}</aside>`;
  let sections = $('div.slides > section');
  let notes = readNotes(files.exported);
  notes.forEach( (note, key) => {
    if (note) {
      let [id, subId] = key.split('-');
      let section = sections.eq(id);
      if (subId) {
        if (section.attr('class') !== 'stack') throw new Error('Mismatch');
        $('section', section).eq(subId).append(speakerNote(note));
      } else {
        section.append(speakerNote(note));
      }
    }
  });
  
  fs.writeFile('./index.html', $.html());
});
