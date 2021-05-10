import { Mongo } from 'meteor/mongo';

/**
 * Fields: id, packId, question, answers, correctAnswers, negativeScore, positiveScore, order, showAnswersToUser
 */
class Questions {
    constructor() {
        this.collection = new Mongo.Collection('Questions');
    }
}

const QUESTIONSCLASS = new Questions();

export default QUESTIONSCLASS.collection;
export const QuestionsClass = QUESTIONSCLASS;
