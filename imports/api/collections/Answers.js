import { Mongo } from 'meteor/mongo';

/**
 * Fields:
 * id,
 * SSOUserId,
 * packId,
 * answersList,
 * score,
 * startedAt,
 * finishedAt,
 * currentQuestion: -1,
 * lastAnsweredQuestion: -1,
 * originMessageId,
 * originThreadId
 */
class Answers {
    constructor() {
        this.collection = new Mongo.Collection('Answers');
    }

    saveAnswer(SSOUserId, packId, {
                   answersList = [],
                   score = 0,
                   startedAt = null,
                   finishedAt = null,
                   currentQuestion = -1,
                   lastAnsweredQuestion = -1,
                   originMessageId,
                   originThreadId
               }){
        return this.collection.insert({
            SSOUserId, packId, answersList, score, startedAt, finishedAt, currentQuestion, lastAnsweredQuestion, originMessageId, originThreadId
        });
    }

    updateAnswer(SSOUserId, packId, data) {
        return this.collection.update({SSOUserId: SSOUserId, packId: packId}, {
            $set: data
        });
    }
}

const ANSWERSCLASS = new Answers();

export default ANSWERSCLASS.collection;
export const AnswersClass = ANSWERSCLASS;
