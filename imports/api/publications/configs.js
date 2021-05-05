import { Meteor } from 'meteor/meteor';
import Configs from "../collections/Configs";

Meteor.publish('Configs', function () {
  return Configs.find({});
});
