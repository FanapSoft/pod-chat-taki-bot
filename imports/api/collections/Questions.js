import { Mongo } from 'meteor/mongo';

/**
 * Fields: id, packId, question, answers, correctAnswer, negativeScore, positiveScore
 */
class Questions {
    constructor() {
        this.collection = new Mongo.Collection('SSOUsers');
    }
}

const QUESTIONSCLASS = new Questions();

export default QUESTIONSCLASS.collection;
export const QuestionsClass = QUESTIONSCLASS;
