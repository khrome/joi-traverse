const extendClass = require('extend-interface');
const rand = require('seed-random');
const joi = require('joi');

const Random = {
    seed : function(seed){
        return rand(seed)
    },
    numSeed : (str) => str
                .split('')
                .map((a) => a.charCodeAt(0))
                .reduce((a, b) => a + b)
 };

 let randomInt = (from, to, fractionalGenerator) =>{
    let diff = to - from;
    let val = Math.floor(from + fractionalGenerator()*diff);
    return val;
}

const makeGenerator = (seed) => {
    let gen = Random.seed(Random.numSeed(seed));
    gen.randomInt = randomInt;
    return gen;
}

let Data = function(definition){
    if(definition['$_root']){
        //definition['_ids']['_byKey']
    }
    //todo: arrays
    if(definition.type == 'object' && definition['_ids']){
        this.children = {};
        definition['_ids']['_byKey'].forEach((value, key)=>{
            this.children[key] = this.createNode(value.schema);
            this.children[key].fieldName = key;
        });
    }else{
        if(
            definition &&
            definition['$_terms'] &&
            definition['$_terms']['_inclusions'] &&
            definition['$_terms']['_inclusions'][0]
        ){
            let subschema = definition['$_terms']['_inclusions'][0];
            this.subschema = this.createNode(subschema);
        }else{
            this.schema = definition;
        }
    }
}

Data.prototype.createNode = function(options){
    return new this.__proto__.constructor(options);
}

Data.prototype.map = function(value){
    return value;
}

Data.prototype.make = function(schema, generator, fieldName){
    throw new Error('.make() not implemented');
}

Data.prototype.traverse = function(seed){
    let generator = (typeof seed === 'string')?makeGenerator(seed):seed;
    /*RandExp.prototype.randInt = (from, to)=>{
        return randomInt(from, to, generator);
    }*/
    if(this.subschema){
        let results = [];
        results.push(this.subschema.traverse(generator))
        return this.map(results, generator);
    }else{
        if(this.schema){
            if(this.schema.type === 'array'){
                let results = [];
                results.push(this.subschema.traverse(generator))
                return this.map(results, generator);
            }else{
                return this.map(this.make(this.schema, generator, this.fieldName), generator);
            }
        }
    }

    if(this.children){
        let results = {};
        Object.keys(this.children).forEach((key)=>{
            results[key] = this.children[key].traverse(generator);
        });
        return results;
    }
};

Data.extend = function(cls, cns){
    var cons = cns || function(){
        Data.apply(this, arguments);
        return this;
    };
    return extendClass(cls, cons, Data);
};

module.exports = {
    Walker: Data,
    joi:joi
};
