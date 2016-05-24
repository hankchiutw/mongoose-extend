'use strict';

const mongoose = require('mongoose');
const Mixed = mongoose.Schema.Types.Mixed;

const queryHelper = require('./queryHelper');

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

        // standard query statics
        schema.defineStatics(queryHelper);

        // config related statics
        schema.defineStatics({
            _configFields: [],
            _config: {},
            bindConfig,
            config
        });

        /** helpers for creating hooks */
        schema.preHook = _hookBuilder('pre');
        schema.postHook = _hookBuilder('post');
    }

    /** helpers to define instance methods and static methods of Model */
    defineMethods(obj){ Object.assign(this.methods, obj); }
    defineStatics(obj){ Object.assign(this.statics, obj); }

    /**
     * Set Model internal static _configFields object
     */
    setConfigFields(ar){
        if(typeof ar == 'string') ar = ar.split(' ');
        this.defineStatics({ _configFields: ar });
    }

    /**
     * Set Model internal static _config object
     */
    setConfig(config){
        let obj = {_config: {}};
        this.statics._configFields.forEach( attr => {
           obj._config[attr] = config[attr]; 
        });
        this.defineStatics(obj);
    }
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
 * Bind Model internal static _config to config
 * Input config attribute value will override original _config attribute value
 */
function bindConfig(config){
    Object.assign(this._config, config);
    Object.assign(config, this._config);
    this._config = config;
}

/**
 * Model static config setter and getter
 * @param {String} attr No action if not in _configFields
 * @param {Mix} value
 */
function config(attr, value){
    // invalid attr
    if(this._configFields.indexOf(attr) < 0) return;

    if(value === undefined) return this._config[attr];
    this._config[attr] = value;
}


/**
 * Expose
 */
module.exports = BaseSchema;
