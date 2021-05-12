import { Meteor } from 'meteor/meteor';
import SSOUsers from "../collections/SSOUsers";

Meteor.publish('SSOUsers', function () {
  return SSOUsers.find({});
});
