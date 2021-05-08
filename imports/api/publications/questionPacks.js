import { Meteor } from 'meteor/meteor';
import QuestionPacks from "../collections/QuestionPacks";

Meteor.publish('QuestionPacks', function () {
  return QuestionPacks.find({});
});
