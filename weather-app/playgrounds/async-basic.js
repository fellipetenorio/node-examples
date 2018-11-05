console.log('Starting app');

var to = () => {
    setTimeout(() => {
        console.log('inside callback', Math.floor(new Date() / 1000));
        to();
    }, 2000);
};
to();
setTimeout(() => {
    console.log('inside callback 2', process.hrtime());
}, 0);
console.log('Finishing app');