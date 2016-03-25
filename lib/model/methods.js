'use strict';
/** @module ModelMethods */

const methods = {
    preHook: _hookBuilder('pre'),
    postHook: _hookBuilder('post')
};

/**
 * Builder for `pre` or `post` hooks
 */
function _hookBuilder(type){
    /**
     * Wrapper for schema.pre, schema.post.
     * Simplify input callback without worry about `next` parameter.
     */
    return function(act, fn){
        const schema = this;
        schema[type](act, function(next){
            fn.apply(this); // this = Model
            if(next) next();
        });
    };
}

/**
 * Expose
 */
module.exports = methods;

