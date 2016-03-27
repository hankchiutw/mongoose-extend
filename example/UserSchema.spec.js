'use strict';

const assert = require('chai').assert;
const co = require('co');

const userSchema = require('./UserSchema');
const mongoose = userSchema.mongoose;

mongoose.connect('mongodb://localhost/test');
const User = mongoose.model('User', userSchema, 'User');

describe('UserSchema', function(){
    it('should be an extended instance', function(){
        assert.instanceOf(userSchema, mongoose.BaseSchema);
    });

    describe('#password related', function(){
        const obj = {
            username: 'testuser1',
            password: 'testpassword'
        };

        beforeEach(co.wrap(function*(){
            const user = yield User.create(obj);
        }));

        afterEach(co.wrap(function*(){
            // safely clear data
            yield User.remove({username: obj.username});
            const emptyUser = yield User.findOne({username: obj.username});
            assert.isNotOk(emptyUser);
        }));


        it('should auto encrypt password', co.wrap(function*(){
            const user = yield User.findOne({username: obj.username}).select('+password');
            assert.equal(user.username, obj.username);
            assert.isTrue(user.validatePassword(obj.password));
        }));

        it('should not return password attribute', co.wrap(function*(){
            const user = yield User.findOne({username: obj.username});
            assert.isNotOk(user.password);
        }));
    });
});
