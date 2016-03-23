'use strict';

const mongoose = require('mongoose');

const ModelMethods = require('./model/methods');
const ModelStatics = require('./model/statics');

const SchemaMethods = require('./schema/methods');
const SchemaStatics = require('./schema/statics');
const SchemaHooks = require('./schema/hooks');

/**
 * Basic schema of mongoose with extended attributes and method.
 * @extends mongoose.Schema
 */
class BaseSchema extends mongoose.Schema { }

BaseSchema.constructor = require('./schema/constructor')(ModelMethods, ModelStatics, SchemaHooks);

Object.assign(BaseSchema.prototype, SchemaMethods);
Object.assign(BaseSchema, SchemaStatics);

/**
 * Expose
 */
module.exports = BaseSchema;
