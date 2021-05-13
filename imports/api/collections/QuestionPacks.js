import { Mongo } from 'meteor/mongo';

/**
 * Fields: id, startsAt, endsAt, duration, threshold, title, active,
 * totalMessagesSentByBot, totalMessagesBotReceived
 */
class QuestionPacks {
    constructor() {
        this.collection = new Mongo.Collection('QuestionPacks');
    }

    increaseTotalMessagesSent(id) {
        this.collection.update({_id: id},  { $inc: { totalMessagesSentByBot: 1 } })
    }
    increaseTotalMessagesBotReceived(id) {
        this.collection.update({_id: id},  { $inc: { totalMessagesBotReceived: 1 } })
    }

}

const QUESTIONPACKCLASS = new QuestionPacks();

export default QUESTIONPACKCLASS.collection;
export const QuestionPackClass = QUESTIONPACKCLASS;
