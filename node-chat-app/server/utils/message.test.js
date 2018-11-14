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