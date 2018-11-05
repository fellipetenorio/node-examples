var obj = {
    name: 'Fellipe',
};

// var stringObj = JSON.stringify(obj);
// console.log(typeof stringObj);
// console.log(stringObj);

// var personString = '{"name":"Fellipe","age":25}';
// var personObj = JSON.parse(personString);
// console.log(typeof personObj);
// console.log(personObj);
const fs = require('fs');

var originalNote = [];
originalNote.push({
    title: 'Some title',
    body: 'Some body'
});
originalNote.push({
    title: 'Some title 2',
    body: 'Some body 2'
});
var originalNoteString = JSON.stringify(originalNote);
fs.writeFileSync('notes.json', originalNoteString);

var noteString = fs.readFileSync('notes.json');
var note = JSON.parse(noteString);

note.push({
    title: 'Some title 2',
    body: 'Some body 2'
});
fs.writeFileSync('notes.json', JSON.stringify(note));
console.log(typeof note);
console.log(note);