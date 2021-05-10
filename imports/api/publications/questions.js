import { Meteor } from 'meteor/meteor';
import Questions from "../collections/Questions";

Meteor.publish('Questions', function () {
  return Questions.find({});
});
