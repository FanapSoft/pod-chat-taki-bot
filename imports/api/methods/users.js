import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Meteor.methods({
    'usersList'() {
        return Meteor.users.find({}).fetch()
    },
    'usersCreate'(username, password) {
        check(username, String);
        check(password, String);
        return Accounts.createUser({
            username: username,
            password: password
        }, )
    },
    'usersUpdate'(id, username, password) {
        check(username, String);
        check(password, String);
        const user = Meteor.users.findOne({_id: id});

        if(!user) {
            throw new Meteor.Error('500', 'Not found', 'the user is not found');
        }

        user.username = username;
        user.password = password;
        Accounts.setUsername(id,username);
        Accounts.setPassword(id,password);
        return {
            result: 'success'
        }
        /*Meteor.users.update(user._id, {
            $set: {
                username: username,
                password: password
            }
        }, (error, result) => {
            if(error)
                return error
            else
                return result
        })*/
    },

});


Meteor.users.allow({
    remove: function (userId, doc) {
        /*var currentUser, userRole;
        currentUser = Meteor.users.findOne({ _id: userId }, { fields: { 'profile.role': 1 } });
        userRole = currentUser.profile && currentUser.profile.role;*/
        if (Meteor.userId) {//userRole === "administrator" && userId !== doc._id
            console.log("Access granted. :)");
            return true;
        } else {
            console.log("Access denied. :(");
            return false;
        }
    },
    fetch: []
});

Accounts.config({
    forbidClientAccountCreation: true
});
