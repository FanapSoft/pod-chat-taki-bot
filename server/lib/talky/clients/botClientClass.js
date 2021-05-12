import ChatClientBaseClass from "../chatClientBaseClass"
import bound from "../../../../imports/lib/bound";
import Configs from "../../../../imports/api/collections/Configs";
import SSOUsers, {SSOUsersClass} from "../../../../imports/api/collections/SSOUsers";
import Answers, {AnswersClass} from "../../../../imports/api/collections/Answers";
import QuestionPacks from "../../../../imports/api/collections/QuestionPacks";
import Questions from "../../../../imports/api/collections/Questions";

class BotClientClass extends ChatClientBaseClass {
    constructor() {
        let defaultConfig = {
            statusKey: 'botClientStatus',
            tokenKey: 'botToken',
            clientProfileKey: 'botClientProfile',
        }
        super(defaultConfig);

        this.Users = {};
        this.Questions = [
            {
                id: '0',
                unique: '4ac6320d-1649-453c-80f6-790fc39795b5',
                title: 'واسه دست گرمی سال تاسیس فناپ رو بهم بگو!',
                positive: 10,
                negative: 3,
                answers: ['۸۴', '84', '۱۳۸۴', '1384', 'هشتاد و چهار', 'هزار و سیصد و هشتاد و چهار']
            },
            {
                id: '1',
                unique: 'abe0019e-50bb-40e1-919f-87689fb6cab5',
                title: 'یکم از مسائل روز بگیم، چطوره؟ آصفی در صف مرغ ایستاده. جالب اینکه هم از اول هم از آخر صف نفر یازدهمه. چند نفر توی صف مرغ هستن؟!',
                positive: 10,
                negative: 3,
                answers: ['21', '۲۱', '۲۱ نفر', '21 nafar', '۲۱ nafar', '21 نفر']
            },
            {
                id: '2',
                unique: '414ddecf-19e2-4639-b052-d2e985e1706d',
                title: "کم کم سختش کنیم.چطوره؟\nیادگاری و احمدی نیا از یه نقطه ی مشترک شروع به حرکت میکنن و ۴ متر از همدیگه دور میشن. بعد به سمت چپ خودشون سه متر دیگه هم حرکت میکنن. الان فاصله ی یادگاری و احمدی نیا چند متره؟!",
                positive: 10,
                negative: 3,
                answers: ['10', '۱۰', '10 m', '10 متر', '10 metr', '۱۰ m', '۱۰ متر', '۱۰ metr', 'ده', 'ده متر']
            },
            {
                id: '3',
                unique: 'b36e718f-3d62-442f-b334-92c5e0b421cc',
                title: "عجله کن که عقب نیفتی!\nتیم آقای مهرآرا هفت تا نیروی آقا داره که هر کودوم از اونها یک همکار خانم دارن.تیم آقای مهرآرا حداقل چند نفرن؟! (آقای مهرآرا رو هم حساب کنا)",
                positive: 10,
                negative: 3,
                answers: ['۹', '۹ نفر', '9', '9 nafar', '9 ta', '۹ تا']
            },
            {
                id: '4',
                unique: '68e29e0c-b90c-4c7e-a0af-5b90b2434cf1',
                title: 'در تیم آقای فرهادی 14 نفر خانم هستن و هشت نفر از اعضای تیم لپ تاپ دارن‌. 2 نفر نه خانم هستن نه لپ تاپ دارن! اگه پنج نفر از کسایی که لپ تاپ دارن خانم باشن آقای فرهادی چند نفر نیرو داره؟ (آقای فرهادی نیروی خودش نیستا)',
                positive: 10,
                negative: 3,
                answers: ['۱۹', '۱۹ تا', '۱۹ نفر', '19', '19 ta', '19 nafar']
            },
            {
                id: '5',
                unique: 'fa3cee28-a4d3-453c-9ae7-aa5e4299091a',
                title: "برادری به برادر کوچک ترش میگه دوسال پیش من سه برابر تو سن داشتم! ولی سه سال دیگه دو برابر تو سن خواهم داشت. برادر کوچیکه میگه ایول!\nبرادر کوچیکه الان چند سالشه؟!",
                positive: 10,
                negative: 3,
                answers: ['7 sal', '7', '۷', '۷ سال']
            },
            {
                id: '6',
                unique: 'e9647760-da07-4e72-86b7-54e3ee55919f',
                title: 'آقای باقری ۱۶ ساله توی فناپه و چهار برابر آقای واعظی سابقه کار داره. وقتی آقای باقری دوبرابر آقای واعظی سابقه کار داشته باشه یعنی چند ساله توی فناپه؟!',
                positive: 10,
                negative: 3,
                answers: ['۲۴', '۲۴ سال', '24', '24 sal']
            },
            {
                id: '7',
                unique: '7e3e5382-9ebc-4086-a010-ac25d91a440e',
                title: "این سوال آسونه. گذاشتمش اینجا یکم ریکاوری بشه مغزت. عدد بعدی رو بهم بگو:\n\n۱۲۱ - ۱۴۴ - ۱۶۹ - ۱۹۶- ؟؟\n",
                positive: 10,
                negative: 3,
                answers: ['225', '۲۲۵']
            },
            {
                id: '8',
                unique: '300d62cc-159a-4de1-a06a-c94145727bf3',
                title: "ماشین بازا این معادله رو حل کنن.\n" +
                    "5 . 3 . 1\n" +
                    "? . 4 . 2\n" +
                    "این سوال نهمه ها. جواب شش نمیشه ها! دقت کن 😎",
                positive: 10,
                negative: 3,
                answers: ['r', 'R']
            },
            {
                id: '9',
                unique: 'bc8a3042-a2c2-4b51-a858-2bf733ddd227',
                title: "این سوالو جواب بدی نه تنها خیلی باهوشی بلکه به احتمال زیاد توی لیست برنده ها هم هستی. فقط به من بگو جای علامت سوال چه عددی بگذارم:\n\n" +
                    "12 = 4 [] 2\n" +
                    "72 = 3 [] 9\n" +
                    "24 = 7 [] 5\n" +
                    " ? = 8 [] 7\n",
                positive: 10,
                negative: 3,
                answers: ['۱۵', '15']
            }
        ];
        this.Game = {
            god: 'f.naysee', // 😈
            gods: ['ma.amjadi', 'poddraw', 'n.soltani', 'f.naysee'],
            duration: 10,
            threshold: 50,
            firstToReachTreshold: {},
            title: 'چالش تاکی',
            start: new Date(),//Date.parse('04/28/2021 18:00:00'),
            end: new Date().setTime(new Date().getTime() + (1*60*60*1000)),//Date.parse('05/05/2021 18:15:00'),
            threads: [
                475387, // تاک قد کشیده تستی
                149486 // تاک قد کشیده
            ],
            admins: [
                'f.naysee'
            ],
            stat: {
                msgSendCount: 0,
                msgReceiveCount: 0,
                userCount: 0
            }
        };

        this.questionPack = null;
        this.questionsList = null;
        this.loadIntervals = []
        this.Result = [];
        this.botSecondLevelCommands = ['شروع', 'پایان', 'بعدی', 'امتیاز', 'دستورها'];
    }

    startListeningToMessages() {
        if(!this.client)
            return;

        /**
         * Only one question pack could be active at a time
         */
        this.questionPack = QuestionPacks.findOne({active: true});
        this.questionsList = Questions.find({packId: this.questionPack._id, sort: {order: 1}});

        this.client.on('messageEvents', function (event) {
            bound(()=>{
                switch (event.type) {
                    case 'MESSAGE_NEW':
                        BotClient.handleNewMessage(event)
                        break;
                }
            })

        });
    }
    getUser(message) {
        let res = null;
        if(message.participant) {
            res = SSOUsers.findOne({SSOId: message.participant.id});
            if(res == undefined) {
                SSOUsersClass.saveUser({
                    SSOId: message.participant.id,
                    username: message.participant.username,
                    name: message.participant.name,
                    firstName: message.participant.firstName,
                    lastName: message.participant.lastName,
                    joinedFromThread: message.threadId,
                });
                return SSOUsers.findOne({SSOId: message.participant.id});
            } else
                return res
        }

        return null;
    }
    getAnswer(user, pack) {
        const answer = Answers.findOne({SSOUserId: user.SSOId, packId: pack._id});
        if(answer == undefined){
            AnswersClass.saveAnswer(user.SSOId, pack._id, {});
            return Answers.findOne({SSOUserId: user.SSOId, packId: pack._id});
        }

        else
            return answer;
    }
    handleNewMessage(event) {
        const message = event.result.message;

        const userData = {
        };
        userData.user = this.getUser(message);

        if(this.questionPack) {
            userData.answer = this.getAnswer(userData.user, this.questionPack);
        } else {
            BotClient.botSender(BotClient.client.replyTextMessage({
                threadId: message.conversation.id,
                repliedTo: message.id,
                textMessage: "هنوز مسابقه ای برام تعریف نشده. بعدا باز امتحان کن"
            }, {
                onSent: function () {
                }
            }));
            return;
        }

        if(BotClient.messageIsOuterCommand(message.message)) {
            this.handleOuterCommand(message, userData);
            this.updateUserData(userData);
        }

        const nextLevelCommands = message.message.match(/^\/(شروع|پایان|بعدی|امتیاز|دستورها)$/);
        if (nextLevelCommands && nextLevelCommands[1]) {
            BotClient.handleNextLevelCommand(message, nextLevelCommands, userData);
            this.updateUserData(userData);
        }

        if (message.replyInfo && message.replyInfo.systemMetadata && typeof message.replyInfo.systemMetadata === 'string') {
            this.handleReplyMessages(message, userData);
            this.updateUserData(userData);
        }
    }
    updateUserData(userData) {
        SSOUsersClass.updateUserBySSOId(userData.user.SSOId, userData.user);
        AnswersClass.updateAnswer(userData.user.SSOId, this.questionPack._id, userData.answer);
    }
    handleOuterCommand = function (message, userData) {
        //console.log(message)
        const botUsername = Configs.findOne('botUsername');
        let string =  '\/(\\w+)@' + botUsername.value
        let ex = new RegExp(string.trim());
        const command = message.message.match(ex);

        switch (command[1]) {
            case 'start':
                console.log('message:', message)
                userData.answer.originThreadId = message.threadId;
                userData.answer.originMessageId = message.id;
                if (new Date().getTime() < this.questionPack.startsAt) {
                    const rtf2 = new Intl.RelativeTimeFormat('fa', {numeric: 'auto'});
                    let timeDiff = Math.round((this.questionPack.startsAt - new Date().getTime()) / 1000);
                    let remainingTime = '';
                    if (timeDiff < 60) {
                        remainingTime = rtf2.format(timeDiff, 'second');
                    } else if (timeDiff < 3600) {
                        remainingTime = rtf2.format(Math.round(timeDiff / 60), 'minute');
                    } else if (timeDiff < 86400) {
                        remainingTime = rtf2.format(Math.round(timeDiff / 3600), 'hour');
                    } else {
                        remainingTime = rtf2.format(Math.round(timeDiff / 86400), 'day');
                    }
                    BotClient.botSender(BotClient.client.replyTextMessage({
                        threadId: message.conversation.id,
                        repliedTo: message.id,
                        textMessage: "🕐🕑🕒🕓🕕🕖🕗🕘🕙\n\nمسابقه هنوز شروع نشده، راس ساعت " + new Date(this.questionPack.startsAt).getHours() + ':' + new Date(this.questionPack.startsAt).getMinutes() + " میتونی دوباره همین دستور رو بزنی و مسابقه رو شروع کنی 😉\n\nتا " + remainingTime + " باید منتظر بمونی"
                    }, {
                        onSent: function () {}
                    }));
                } else if (new Date().getTime() > this.questionPack.endsAt) {
                    BotClient.botSender(BotClient.client.replyTextMessage({
                        threadId: message.conversation.id,
                        repliedTo: message.id,
                        textMessage: message.participant.firstName + " عزیز، مسابقه ی این هفته تموم شده  🙄 \nتا ساعت " + new Date(this.questionPack.endsAt).getHours() + ':' + new Date(this.questionPack.endsAt).getMinutes() + " بیشتر وقتی نداشتی. چهارشنبه هفته ی بعدی همین موقع دوباره مسابقه خواهیم داشت.\n @" + userData.user.username
                    }, {
                        onSent: function () {}
                    }));
                } else {
                    let commandsList = BotClient.botSecondLevelCommands.reduce((acc, command) => acc + '/' + command + "\n", '');

                    if(!userData.user.p2pThread || !userData.answer.startedAt) {//user == undefined
                        BotClient.client.createThread({
                            title: 'takiBOT',
                            type: 'NORMAL',
                            invitees: [{id: userData.user.username, idType: 'TO_BE_USER_USERNAME'}],
                            message: {
                                uniqueId: new Date().getTime() * Math.random(),
                                text: "سلام " + message.participant.firstName + "،\nبه مسابقه ی این هفته خوش اومدی. موضوع مسابقه ی این هفته " + BotClient.Game.title + " هست. \nیادت نره تا ساعت " + new Date(BotClient.Game.end).getHours() + ':' + new Date(BotClient.Game.end).getMinutes() + " بیشتر وقت نداری برای تموم کردن بازی. هر کجای بازی که باشی و وقت تموم بشه امتیاز آخرت رو توی گروه میفرستم و به اسمت ثبت میکنم. سعی کن جواب سوال هارو با دقت و سرعت بفرستی که همه ی مراحل رو باهم پیش بریم.\n\rبرای ارتباط با من میتونی از لیست پایین استفاده کنی. کافیه یکی از دستورات زیر رو برام بفرستی تا بقیه ی راه رو نشونت بدم. \n\n" + commandsList + "\nحالا برای شروع بازی دستور /شروع رو تایپ کن و بفرست واسم. به همین سادگی \nLet's Go 😉",
                                metadata: {},
                                systemMetadata: {
                                    messageId: message.id,
                                    threadId: message.conversation.id,
                                    userId: message.participant.id,
                                    name: message.participant.firstName || message.participant.name || message.participant.username,
                                    username: message.participant.username,
                                    fullName: message.participant.name
                                },
                                type: 1
                            }
                        }, function (res) {
                            bound(()=> {
                                SSOUsersClass.updateUserBySSOId(userData.user.SSOId, {p2pThread: (!res.hasError ? res.result.thread.id: null)})
                            })
                        });
                    } else {

                        BotClient.botSender(BotClient.client.replyTextMessage({
                            threadId: message.conversation.id,
                            repliedTo: message.id,
                            textMessage: userData.user.name + " عزیز، قبلا تو مسابقه ی این هفته شرکت کردی و امتیاز " + userData.answer.score + " را بدست آوردی.\n منتظر مسابقه ی بعدی باش 😉."
                        }, {
                            onSent: function () {
                            }
                        }));
                    }
                }
                // const use = SSOUsers.findOne({username: message.participant.username});
                // BotClient.sendTextMessage(use.p2pThread, 'salaam')
                break;

            case 'finish':
                //userData.updateAnswer({finishedAt: new Date()})
                userData.answer.finishedAt = new Date();
                //delete BotClient.Users[message.participant.id];
                break;
            case 'scoreboard':
                if (message.participant.username === BotClient.Game.god) {
                    if (BotClient.Result.length) {
                        const SortedResults = BotClient.Result.sort((a, b) => b.score - a.score || a.time - b.time).slice(0, 10);
                        const MappedResults = SortedResults.map((user, index) => {
                            return `${new Intl.NumberFormat('fa').format(++index)}) ${user.name} با ${new Intl.NumberFormat('fa').format(user.score)} امتیاز در ساعت ${new Intl.DateTimeFormat('fa', {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit'
                            }).format(user.time)}\n`;
                        }).reduce((acc, cur) => acc += cur);

                        BotClient.botSender(BotClient.client.replyTextMessage({
                            threadId: message.threadId,
                            repliedTo: message.id,
                            textMessage: "🏆🏆 جدول رده بندی 🏆🏆 \n\n" + MappedResults,
                        }, {
                            onSent: function (result) {
                            }
                        }));
                    } else {
                        BotClient.botSender(BotClient.client.replyTextMessage({
                            threadId: message.conversation.id,
                            repliedTo: message.id,
                            textMessage: "🏆 جدول امتیازات 🏆 \n\n هنوز امتیازی ثبت نشده است!"
                        }, {
                            onSent: function () {
                            }
                        }));
                    }
                }
                break;
            default:
                break;
        }
    }
    handleNextLevelCommand = function (message, nextLevelCommands, userData) {
        if(!userData.answer.originThreadId) {
            BotClient.botSender(BotClient.client.sendTextMessage({
                threadId: message.threadId,
                textMessage: "برای شروع بازی باید بری داخل گروه تاک قد کشیده و دستور /start@takiBOT رو اجرا کنی تا یه بار دیگه مسابقه برات شروع بشه 😎"
            }, {}));

            return;
        }
        switch (nextLevelCommands[1]) {
            case 'شروع':
                if (userData.answer.currentQuestion >= 0) {
                    BotClient.botSender(BotClient.client.sendTextMessage({
                        threadId: message.threadId,
                        textMessage: "قبلا بازی رو شروع کردی🤔،\nامتیازت هم تا اینجا " + userData.answer.score + " شده. اگه میخوای بازی رو ادامه بدی دستور /بعدی رو بفرست واسم. اگر هم مطمئنی که میخوای بازی رو تموم کنی دستور /پایان رو بفرست واسم تا امتیازهاتو ثبت کنم."
                    }, {}));
                } else if (userData.answer.finishedAt) {
                    BotClient.gameEnded(message.threadId, userData.answer.score, message.participant.id, userData);
                } else {
                    userData.answer.currentQuestion = 0;
                    userData.answer.score = 0;
                    userData.answer.startedAt = new Date();
                    BotClient.sendQuestion(message.threadId, BotClient.Questions[0], 0, message.participant.id, userData);
                }
                break;

            case 'بعدی':
                if (userData.answer.currentQuestion > -1) {
                    if (BotClient.Questions.length > userData.answer.currentQuestion + 1) {
                        userData.answer.currentQuestion += 1;
                        //userData.updateAnswer({currentQuestion: userData.answer.currentQuestion + 1})

                        BotClient.sendQuestion(message.threadId, BotClient.Questions[userData.answer.currentQuestion], userData.answer.score, message.participant.id, userData);
                    } else {
                        BotClient.gameEnded(message.threadId, userData.answer.score, message.participant.id, userData);
                    }
                } else {
                    BotClient.botSender(BotClient.client.sendTextMessage({
                        threadId: message.threadId,
                        textMessage: "هنوز بازی رو شروع نکردی، برای شروع بازی دستور /شروع رو ارسال کن برام."
                    }, {}));
                }
                break;

            case 'پایان':
                BotClient.gameEnded(message.threadId, userData.answer.score, message.participant.id, userData);
                break;

            case 'دستورها':
                let commandsList = BotClient.botSecondLevelCommands.reduce((acc, command) => acc + '/' + command + "\n", '');
                BotClient.botSender(BotClient.client.sendTextMessage({
                    threadId: message.threadId,
                    textMessage: "لیست دستورهایی که برای من تعریف شده شامل این موارده: \n\n" + commandsList + "\nاگه نمیدونی الان باید چطوری با دستورهای من کار کنی یا توی مسابقه شرکت کنی، میتونی از دوستان پشتیبانی مسابقه، مثلا آقای وحید آصفی یا هادی یادگاری راهنمایی بگیری."
                }, {}));
                break;

            case 'امتیاز':
                BotClient.botSender(BotClient.client.sendTextMessage({
                    threadId: message.threadId,
                    textMessage: "امتیاز تا این لحظه\n" + userData.answer.score + "\n"
                }, {}));
                break;

            default:
                BotClient.botSender(BotClient.client.sendTextMessage({
                    threadId: message.threadId,
                    textMessage: "این دستور برای من تعریف نشده، لیست دستورهای من رو میتونی با فرستادن یه پیام حاوی /دستورها بگیری.\n\nمثلا برای شروع بازی میتونی دستور /شروع رو ارسال کنی واسم."
                }, {}));
                break;
        }
        //}
    }
    handleReplyMessages = function (message, userData) {
        try {
            const messageMeta = JSON.parse(message.replyInfo.systemMetadata);
            const questionUnique = messageMeta.id;
            const question = BotClient.Questions.find(q => q.unique === questionUnique);

            if (question && Array.isArray(question.answers)) {
                if (question.id != userData.answer.currentQuestion) {
                    BotClient.botSender(BotClient.client.sendTextMessage({
                        threadId: message.threadId,
                        textMessage: "جواب این سوال رو قبلا مشخص کردی، امتیازش هم ثبت شده، برو سراغ سوال های بعدی 😏 ...\nبرای گرفتن سوال بعدی کافیه دستور /بعدی رو بفرستی واسم تا سوال جدیدی دریافت کنی."
                    }, {}));
                } else {
                    if (question.answers.includes(message.message) || question.answers.includes(message.message.toLowerCase())) {

                        if (userData.answer.currentQuestion === userData.answer.lastAnsweredQuestion) {
                            //userData.updateAnswer({score: userData.answer.score + question.positive - 1})
                            userData.answer.score += question.positive - 1;
                        } else {
                            //userData.updateAnswer({score: userData.answer.score + question.positive})
                            userData.answer.score += question.positive;
                        }
                        //serData.updateAnswer({lastAnsweredQuestion: userData.answer.currentQuestion})
                        userData.answer.lastAnsweredQuestion = userData.answer.currentQuestion;

                        if (!BotClient.Game.firstToReachTreshold.hasOwnProperty('score') && userData.answer.score >= BotClient.Game.threshold) {

                            BotClient.Game.firstToReachTreshold = {
                                name: userData.answer.name,
                                username: message.participant.name,
                                score: userData.answer.score
                            };

                            BotClient.botSender(BotClient.client.replyTextMessage({
                                threadId: userData.answer.originThreadId,
                                repliedTo: userData.answer.originMessageId,
                                textMessage: "تا اینجا " + BotClient.Game.firstToReachTreshold.name + " اولین نفری بوده که نصف بیشتر امتیازها رو تونسته کسب کنه، امتیازش الان " + BotClient.Game.firstToReachTreshold.score + " تا شده.\n\nزمان دقیق ارسال:\n" + new Intl.DateTimeFormat('fa', {
                                    dateStyle: 'long',
                                    timeStyle: 'medium'
                                }).format(new Date())
                            }, {
                                onSent: function () {
                                }
                            }));
                        }

                        BotClient.botSender(BotClient.client.sendTextMessage({
                            threadId: message.conversation.id,
                            messageType: 'text',
                            textMessage: "🎉🎈😀\nآفرین، جوابت درست بود. چند لحظه صبر کن تا مرحله ی بعدی رو برات بیارم.\n\nامتیازت تا الان شده: " + userData.answer.score
                        }, {
                            onSent: function () {
                                //userData.updateAnswer({currentQuestion: userData.answer.currentQuestion + 1});
                                userData.answer.currentQuestion += 1;
                                BotClient.sendQuestion(message.conversation.id, BotClient.Questions[userData.answer.currentQuestion], userData.answer.score, message.participant.id);
                            }
                        }));
                    } else {
                        //userData.updateAnswer({score: userData.answer.score - question.negative});
                        //userData.updateAnswer({lastAnsweredQuestion: userData.answer.currentQuestion});

                        userData.answer.score -= question.negative;
                        userData.answer.lastAnsweredQuestion = userData.answer.currentQuestion;

                        if (userData.answer.score <= -10) {
                            let userId = message.participant.id;
                            let finishTime = new Date();

                            BotClient.botSender(BotClient.client.sendTextMessage({
                                threadId: message.conversation.id,
                                messageType: 'text',
                                textMessage: "🔴😓\nمتاسفم، جوابت اشتباه بود. امتیازهای منفی ات هم خیلی زیاد شد.\n\nاز مسابقه حذف شدی و توی قرعه کشی هم شرکت داده نخواهی شد. امیدوارم تو مسابقه ی بعدی برنده باشی\nتا چهارشنبه هفته ی بعدی، خدانگهدار 😄"
                            }, {
                                onSent: function () {
                                    userData.updateAnswer({finishedAt: finishTime});
                                    //userData.answer.finishedAt = new Date();
                                }
                            }));

                            BotClient.botSender(BotClient.client.replyTextMessage({
                                threadId: userData.answer.originThreadId,
                                repliedTo: userData.answer.originMessageId,
                                textMessage: "😈😈😈😈😈😈😈😈😈😈\n" + userData.user.name + " یکی از رقبای اصلیتون با امتیاز " + userData.user.score + " از دور بازی حذف شد.\n\nزمان دقیق ارسال:\n" + new Intl.DateTimeFormat('fa', {
                                    dateStyle: 'long',
                                    timeStyle: 'medium'
                                }).format(finishTime)
                            }, {
                                onSent: function () {
                                    userData.answer.finishedAt = finishTime;
                                    // userData.updateAnswer({finishedAt: finishTime});


                                    BotClient.Result.push({
                                        id: userId,
                                        name: userData.user.fullName || userData.user.name,
                                        username: userData.user.username,
                                        score: userData.answer.score,
                                        time: finishTime.getTime()
                                    });
                                }
                            }));
                        } else {
                            BotClient.botSender(BotClient.client.sendTextMessage({
                                threadId: message.conversation.id,
                                messageType: 'text',
                                textMessage: "🔴😓\nمتاسفم، جوابت اشتباه بود. بخاطر همین " + question.negative + " امتیاز منفی گرفتی.\n\nحالا دوتا کار میتونی بکنی:\n1. یا دوباره برو همین سوال رو ریپلای کن و جواب بده\n2. یا دستور /بعدی رو بفرست که سوال بعدی رو بفرستم واست.\n\nحواست باشه که بری سوال بعدی، امتیاز این سوال از دستت می پره"
                            }, {}));
                        }
                    }
                }
            }
        } catch (e) {
            console.log(e)
        }
    }
    messageIsOuterCommand(message) {
        // Game BOT Outer Commands
        const botUsername = Configs.findOne('botUsername');
        const botCommands = Configs.findOne('botCommands')
        let string =  '\/(\\w+)@' + botUsername.value
        let ex = new RegExp(string.trim());
        const command = message.match(ex);

        if(command && command[1]) {
            if(botCommands && botCommands.value && botCommands.value.includes(command[1])) {
                return true;
            }
        }
        return false;
        //console.log('command:', command, botUsername.value, string, ex.test(message.message), message.message)
        //return;
    }

    increaseTotalMessagesCount(){
        //TODO: Store total sent messages in current active Competition
        BotClient.Game.stat.msgSendCount++;
    }

    sendQuestion(thread, question, score, userId, userData) {
        if (question && question.id >= 0 && new Date().getTime() < this.questionPack.endsAt && !userData.answer.finishedAt) {
            BotClient.botSender(BotClient.client.sendTextMessage({
                    threadId: thread,
                    systemMetadata: {
                        id: question.unique
                    },
                    textMessage: "⚪ سوال " + (parseInt(question.id) + 1) + "\n\n" + question.title + "\n(" + question.positive + "+ , " + question.negative + "-)\n\nبرای جواب دادن به سوال و رفتن به مرحله ی بعدی کافیه جواب درست رو توی ریپلای این پیام به من بگی. منتظرم ..."
                }, {
                    onSent: function () {
                    }
                })
            );
        } else {
            BotClient.gameEnded(thread, score, userId, userData);
        }
    }

    gameEnded(thread, score, userId, userData) {
        if (!userData.answer.finishedAt) {
            let finishTime = new Date();

            BotClient.botSender(BotClient.client.sendTextMessage({
                threadId: thread,
                textMessage: "بازی تموم شد 😅\n\nامتیازت در نهایت شد " + score + " تا\n\nالان امتیازت رو توی گروه تاک قد کشیده ارسال میکنم تا بقیه هم ببینن و توی قرعه کشی مسابقه ی این هفته هم شرکت داده بشی.\nخسته نباشی 🏅"
            }, {}));

            BotClient.botSender(BotClient.client.replyTextMessage({
                threadId: userData.answer.originThreadId,
                repliedTo: userData.answer.originMessageId,
                textMessage: userData.user.name + " در مسابقه ی این هفته امتیاز " + score + " را بدست آورد.\n\nزمان دقیق ارسال:\n" + new Intl.DateTimeFormat('fa', {
                    dateStyle: 'short',
                    timeStyle: 'medium',
                    hour12: false,
                    timeZone: 'Asia/Tehran'
                }).format(finishTime)
            }, {
                onSent: function () {
                    userData.answer.finishedAt = new Date();
                    //BotClient.Users[userId].finished = true;

                    BotClient.Result.push({
                        id: userId,
                        name: userData.user.fullName || userData.user.name,
                        username: userData.user.username,
                        score: userData.answer.score,
                        time: finishTime.getTime()
                    });
                }
            }));
        } else {
            BotClient.botSender(BotClient.client.sendTextMessage({
                threadId: thread,
                textMessage: "قبلا بازی رو تموم کردی، امتیازت هم توی گروه اصلی ارسال شده. منتظر باش تا آقای آصفی برنده های این هفته رو اعلام کنه 😅"
            }, {}));
        }
    }

    botSender(fn){
        this.increaseTotalMessagesCount();
        fn;
    }
}

const BotClient = new BotClientClass()
export default BotClient;
