import { Meteor } from 'meteor/meteor';
import Answers from "../collections/Answers";

Meteor.publish('Answers', function () {
  return Answers.find({});
});
