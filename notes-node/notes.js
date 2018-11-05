const fs = require('fs');
const _ = require('lodash');

var data = 'notes-data.json';

var fetchNotes = () => {
    try {
        return JSON.parse(fs.readFileSync(data));
    } catch (e) {
        return [];
    }
};

var saveNotes = (notes) => {
    fs.writeFileSync(data, JSON.stringify(notes, null, 4));
};

var addNotes = (title, body) => {
    var notes = fetchNotes();
    var note = {title: title, body: body};
    
    // search for duplicates
    var duplicates = notes.filter((note) => note.title === title);
    
    if(duplicates.length > 0)
        return false;
    
    notes.push(note);
    saveNotes(notes);
    return note;
}

var getAll = () => {
    return fetchNotes();
}

var getNote = (title) => {
    return fetchNotes().filter((n) => n.title === title);    
}

var removeNote = (title) => {
    var notes = fetchNotes();
    var notesRemoved = _.remove(notes, (note) => note.title === title);
    saveNotes(notes);
    return notesRemoved;
}

module.exports = {
    addNotes, // ES6 (equal to addNotes: addNotes)
    getAll,
    getNote,
    removeNote
}