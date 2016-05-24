# mongoose-extend
[![npm version](https://badge.fury.io/js/mongoose-extend.svg)](https://badge.fury.io/js/mongoose-extend)

Extended [mongoose](https://www.npmjs.com/package/mongoose) module with serveral useful features.

### Features
- Fully compatible with original mongoose.
- Handy functions to define hooks.
- Able to customize query results in a uniform way.

### How to use

Create a schema:
```js
const mongoose = require('mongoose-extend');

const userSchema = new mongoose.BaseSchema({
    username: 'string',
    password: {type: String, select: false}
});

// register the model:
mongoose.model('User', userSchema, 'User');
// or
userSchema.mongoose.model('User', userSchema, 'User');
```

Override the queryDecorator:
```js
userSchema.defineStatics({
    queryDecorator: function(q){
        return q.select('-password');
    }
});

// the result objects will not have password attribute
mongoose.model('User').dFind();
```

Define a hook:
```js
userSchema.preHook('save', function(){
    // `this` is a model instance
    if(this.password) this.password = bcrypt.hashSync(this.password, 1);
});
```

### APIs

##### mongoose.BaseSchema
> Extend `mongoose.Schema`


#### BaseSchema APIs
##### schema.defineMethods
> Define Model instance methods

##### schema.defineStatics
> Define Model static methods

##### schema.preHook
> Handy function to define `pre` hook
##### schema.postHook
> Handy function to define `post` hook

##### schema.mongoose
> Equals to `mongoose` object 


#### Default model attributes
##### model.objectId
> Virtual, equals to `model._id`
##### model.disabled
##### model.createdAt
##### model.updatedAt


#### Decorated Model query methods(static)
Original query methods(`find`, `findOne`, etc) have corresponding decorated methods which applied `Model.queryDecorator` to the query object before return.
##### Model.dFind
##### Model.dFindOne

##### Model.queryDecorator
> Used in all decorated query methods

### ToDos
- More decorated functions
- Handle errors in preHook, postHook.
- Handle preHook, postHook as query middleware and document middleware.
