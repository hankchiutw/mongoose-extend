'use strict';

const mongoose = require('../index');
const bcrypt = require('bcrypt');

/** init schema */
const userSchema = new mongoose.BaseSchema({
    username: 'string',
    password: {type: String, select: false}
});

userSchema.defineStatics({
    queryDecorator: function(q){
        return q.select('-password');
    }
});

userSchema.preHook('save', function(){
    // `this` is a model instance
    if(this.password) this.password = bcrypt.hashSync(this.password, 1);
});

userSchema.preHook('update', function(){
    // `this` is a query object
    const criteria = this.getUpdate();
    if(criteria.$set &&
        typeof criteria.$set.password === 'string' &&
        criteria.$set.password.length > 0)
            criteria.$set.password = bcrypt.hashSync(criteria.$set.password, 1);

    if(typeof criteria.password === 'string' &&
        criteria.password.length > 0)
            criteria.password = bcrypt.hashSync(criteria.password, 1);
});

/** define instance methods */
userSchema.defineMethods({
    validatePassword: function(password){
        if(password === undefined) return false;
        if(typeof password !== 'string') return false;
        return bcrypt.compareSync(password, this.password);
    }
});

/**
 * Expose
 */
module.exports = userSchema;
