'use strict';
/** @module */

const queryHelper = {
    _defaultQueryDecorator,
    queryDecorator: _defaultQueryDecorator
};

/**
 * Original query actions
 */
const queries = [
    'find',
    'findOne'
];

/**
 * Produce decorated query function as ES6 generator from original one
 * ex. Model.find produces Model.dFind
 */
queries.forEach(function(act){
    const attr = `d${act[0].toUpperCase()}${act.slice(1)}`; // ex. dFind, dFindOne
    queryHelper[attr] = function*(conditions, projection, options){
        return yield this.queryDecorator(this[act](conditions, projection, options)).exec();
    };
});

/**
 * @param {Object} q Query object
 * @private
 */
function _defaultQueryDecorator(q){
    return q.limit(50).sort('-createdAt');
}

/**
 * Expose
 */
module.exports = queryHelper;
