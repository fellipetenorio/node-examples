console.log('Starting');
var command = process.argv[2];
console.log('Command: ', command);

switch(command) {
    case 'list':
        console.log('List notes');
        break;
    default:
       console.log('Unknown command');
        break;
}