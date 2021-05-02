import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Meteor.methods({
    'usersList'() {
        return Meteor.users.find({}).fetch()
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
