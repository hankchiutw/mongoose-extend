'use strict';

const mongoose = require('mongoose');
const Mixed = mongoose.Schema.Types.Mixed;

const queryHelper = require('./queryHelper');

const validConfigs = ['queryDecorator'];

/**
 * Basic schema of mongoose with extended attributes and method.
 * @extends mongoose.Schema
 */
class BaseSchema extends mongoose.Schema {
    /**
     * Create schema from fields
     * @param {Object} fields Key-value structure as defined in {@link http://mongoosejs.com/docs/schematypes.html|SchemaTypes}
     * @constructs BaseSchema
     */
    constructor(fields){
        /**
         * Extend with basic schema attributes
         */
        Object.assign(fields, {
            disabled: { type: Boolean, default: false }
        });

        /** Disable id getter. Enable createdAt, updateAt attributes */
        super(fields, { id: false, timestamps: true });

        let schema = this;

        schema.virtual('objectId').get(function(){ return this._id;});
        schema.set('toJSON', {virtuals: true});

        schema.mongoose = mongoose;
        schema.defineStatics(queryHelper);

        /** helpers for creating hooks */
        schema.preHook = _hookBuilder('pre');
        schema.postHook = _hookBuilder('post');
    }

    /** set instance config */
    config(attr, value){
        if(!attr in validConfigs) return;
        this[attr] = value;
    }

    /** get instance config */
    config(attr){
        return this[attr];
    }

    /** helpers to define instance methods and static methods of Model */
    defineMethods(obj){ Object.assign(this.methods, obj); }
    defineStatics(obj){ Object.assign(this.statics, obj); }

}

/**
 * Builder for `pre` or `post` hooks
 * @private
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
module.exports = BaseSchema;
