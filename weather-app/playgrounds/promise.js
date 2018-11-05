// var somePromise = new Promise((resolve, reject) => {
//     // resolve('hi. it works!');
//     setTimeout(() => reject('problem'), 1000);
// });

// somePromise.then(message => {
//     console.log(message);
// }, error => {
//     console.log('error', error);
// });


var asyncAdd = (a,b) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if(b === 10)
                reject('do not use 10');
            if(typeof a === 'number' && typeof b === 'number')
                resolve(a+b);
            reject('invalid format');
        }, 1500);
    });
};

asyncAdd(5,7)
    .then(result => asyncAdd(result, 10))
    .then(res => console.log('final result', res))
    .catch(error => console.log('error by any promise:', error));
    