import { Meteor } from 'meteor/meteor';
import BotLogs from "../collections/BotLogs";

Meteor.publish('BotLogs', function () {
  return BotLogs.find({});
});
