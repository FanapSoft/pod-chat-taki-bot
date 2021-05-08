import { Mongo } from 'meteor/mongo';

/**
 * Fields: id, startsAt, endsAt, duration, threshold, title, status
 * status: 1.started, 2.ended 3.will start
 */
class QuestionPacks {
    constructor() {
        this.collection = new Mongo.Collection('QuestionPacks');
    }
}

const QUESTIONPACKCLASS = new QuestionPacks();

export default QUESTIONPACKCLASS.collection;
export const QuestionPackClass = QUESTIONPACKCLASS;
