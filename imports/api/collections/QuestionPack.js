import { Mongo } from 'meteor/mongo';

/**
 * Fields: id, startsAt, endsAt, duration, threshold, title, status
 * status: 1.started, 2.ended, 3.done
 */
class QuestionPack {
    constructor() {
        this.collection = new Mongo.Collection('QuestionPacks');
    }
}

const QUESTIONPACKCLASS = new QuestionPack();

export default QUESTIONPACKCLASS.collection;
export const SSOUsersClass = QUESTIONPACKCLASS;
