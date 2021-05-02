import { Meteor } from 'meteor/meteor';
import Links from './collections/Links.js';
import Configs from './collections/Configs'

Meteor.startup(() => {
  if(Configs.collection.find().count() === 0) {
    let data = [
      {
        name: 'botToken',
        value: "0bea561f71af4cc9829afce8ac472f2f",
      },
      {
        name: 'questionsDelayInSecond',
        value: {enabled: true, seconds: 60},
      },
      {
        name: 'botActive',
        value: true,
      }
    ];

    data.forEach(item => Configs.collection.insert(item))
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
