import { Meteor } from 'meteor/meteor';
import Configs from './collections/Configs';

Meteor.startup(() => {
  if(Configs.find().count() === 0) {
    let data = [
      {
        name: 'botToken',
        val: {value: "0bea561f71af4cc9829afce8ac472f3f"},
      },
      {
        name: 'questionsDelayInSecond',
        val: {value: {enabled: true, seconds: 60}},
      },
      {
        name: 'botActive',
        val: {value: true},
      },
      {
        name: 'adminToken',
        val: {value: '111'},
      },
      {
        name: 'botClientStatus',
        val: {value: {active: false, error: null}}
      },
      {
        name: 'adminClientStatus',
        val: {value: {active: false, error: null}}
      }
    ];
    data.forEach(item => Configs.upsert(item.name, {$set: item.val}));
  }

  // if the Links collection is empty
  /*if (Links.find().count() === 0) {
    const data = [
      {
        title: 'Do the Tutorial',
        url: 'https://www.meteor.com/try',
        createdAt: new Date(),
      },
      {
        title: 'Follow the Guide',
        url: 'http://guide.meteor.com',
        createdAt: new Date(),
      },
      {
        title: 'Read the Docs',
        url: 'https://docs.meteor.com',
        createdAt: new Date(),
      },
      {
        title: 'Discussions',
        url: 'https://forums.meteor.com',
        createdAt: new Date(),
      },
    ];

    data.forEach(link => Links.insert(link));
  }*/
});
