var expect = require('expect');

var {generateMessage} = require('./message');

describe('generateMessage', () => {
    it('should generate correct message object', done => {
        const from = 'Tenorio';
        const text = 'Hi';
        var obj = generateMessage(from, text);
        expect(obj.from).toBe(from);
        expect(obj.text).toBe(text);
        expect(typeof obj.createdAt).toBe('number');
        done();
    })
});

describe('generateLocationMessage', () => {
    it('should generate correct location object', done => {
        var data = {
            latitude: -8.1199766,
            longitude: -34.8989622
        };
        var message = generateMessage('Admin', data);
        console.log(message);
        expect(message.text.latitude).toBe(data.latitude);
        expect(message.text.longitude).toBe(data.longitude);
        done();
    })
});