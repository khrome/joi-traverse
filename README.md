joi-traverse
============

[joi](https://github.com/sideway/joi) has [no internal api](), but it's utility for generative tasks is undeniable. I built some joi utilities but using an undocumented interfaces means, evetually, something will break. binding a specific joi version to a traversal API allows me to prevent this by upgrading the traversal code in lock step with the joi version.

Usage
-----

```javascript
const {Walker} = require('joi-traverse');
const Subwalker = Walker.extend({
    //creates leaf nodes (objects/arrays automatically handled)
    make : function(schema, generator, fieldName){
        //return value;
    }
});
let walker = new Subwalker(joiDefinition);
let processed = walker.traverse('SEED');

```
