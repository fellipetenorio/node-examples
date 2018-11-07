const expect = require('expect');
const utils = require('./utils.js');

it('should add two numbers', () => {
    var res = utils.add(33,11);
    expect(res).toBe(44).toBeA('number');
    // if(res !== 44)
    //     throw new Error(`Expected 44, but got ${res}`)
});

it('should aquare a number', () => {
    var res = utils.square(3);
    expect(res).toBe(9).toBeA('number');

    // if(res !== 9)
    //     throw new Error(`Expected 9, but got ${res}`);
});

it('should expect some values', () => {
    // expect(12).toNotBe(12);
    // expect({name:'Andrew'}).toBe({name:'Andrew'}); // going to fail
    // expect({name:'Andrew'}).toNotEqual({name:'Andrew'}); // going to pass
    // expect([2,3,4]).toExclude(1); // pass
    // expect([2,3,4]).toInclude(5); // fail
    
    // expect({
    //     name: 'Fellipe',
    //     age: 25,
    //     location: 'Philadelphia'
    // }).toInclude({
    //     age: 26
    // }); // fail

    expect({
        name: 'Fellipe',
        age: 25,
        location: 'Philadelphia'
    }).toExclude({
        age: 26
    }); // pass
});

it('should have the name', () =>{
    var user = {
        name: 'Fellipe',
        age: 25,
        location: 'Philadelphia'
    }
    utils.setName(user, 'Fellipe Tenorio');
    expect(user).toInclude({name: 'Fellipe'}).toInclude({lastName: 'Tenorio'});
});

it('should async add numbers', (done) => {
    utils.asyncAdd(4, 3, (sum) => {
        expect(sum).toBeA('number').toBe(7);
        done();
    });
});