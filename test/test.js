const should = require('chai').should();
const {Walker, joi} = require('../joi-traverse');

const simpleSchema = joi.object().keys({
    email: joi.string().email().required(),
    phone: joi.string().regex(/^\d{3}-\d{3}-\d{4}$/).required(),
    birthday: joi.date().max('1-1-2004').iso()
});

describe('joi traverse', ()=>{
    describe('executes traversal', ()=>{
        it('processes a simple joi definition', (done)=>{
            let leafNodeCount = 0;
            let cls = Walker.extend({
                make : function(schema, generator, field){
                    leafNodeCount++;
                }
            });
            let result = (new cls(simpleSchema)).traverse('dkfjdhas');
            leafNodeCount.should.equal(3);
            done();
        })
    })
})
