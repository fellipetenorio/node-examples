console.log('Starting');
const yargs = require('yargs');
const notes = require('./notes.js');
const titleOption = {
    describe: 'Title of the note',
    demand: true, // If call add without title will raise an error
    alias: 't' // call t instead title
};
const bodyOption = {
    describe: 'Body of the note',
    demand: true, // If call add without title will raise an error
    alias: 'b' // call t instead title
};

const argv = yargs
    //node file.js --help
    .command('add', 'Add a new command', {
        title: titleOption,
        body: bodyOption,
    })
    .command('list', 'List all notes')
    .command('read', 'Search a note by title', {
        title: titleOption
    })
    .command('remove', 'Remove a note by title', {
        title: titleOption
    })
    .argv;

switch(argv._[0]) {
    case 'list':
        notes.getAll().forEach(element => console.log(element));
        break;
    case 'add':
        var note = notes.addNotes(argv.title, argv.body);
        console.log(`note ${note ? 'saved' : 'not saved'}`);
        break;
    case 'read':
        var note = notes.getNote(argv.title);
        console.log(note);
        break;
    case 'remove':
        var no = notes.removeNote(argv.title);
        console.log(`removed  ${no.length} notes.`);
        break;
    default:
       console.log('Unknown command');
        break;
}