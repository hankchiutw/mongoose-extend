'use strict';

const Mixed = require('mongoose').Schema.Types.Mixed;

function ConstructorBuilder(ModelMethods, ModelStatics, SchemaHooks){

    /**
     * Create schema from fields
     * @param {Object} fields Key-value structure as defined in {@link http://mongoosejs.com/docs/schematypes.html|SchemaTypes}
     * @constructs BaseSchema
     */
    return function(field){
        /**
         * Extend with basic schema attributes
         */
        Object.assign(fields, {
            _objectId: { type: String, unique: true, sparse: true },
            _source: { type: Mixed },
            disabled: { type: Boolean, default: false }
        });

        /** Disable id getter. Enable createdAt, updateAt attributes */
        super(fields, { id: false, timestamps: true });

        let schema = this;

        schema.methods = ModelMethods;
        schema.statics = ModelStatics;

        Object.keys(SchemaHooks).forEach( name => schema.pre(name, SchemaHooks[name]) );
    };
}

/**
 * Expose
 */
module.exports = ConstructorBuilder;
