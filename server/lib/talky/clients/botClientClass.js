import ChatClientBaseClass from "../chatClientBaseClass"
import bound from "../../../../imports/lib/bound";
import Configs from "../../../../imports/api/collections/Configs";
import SSOUsers, {SSOUsersClass} from "../../../../imports/api/collections/SSOUsers";
import Answers, {AnswersClass} from "../../../../imports/api/collections/Answers";
import QuestionPacks, {QuestionPackClass} from "../../../../imports/api/collections/QuestionPacks";
import Questions from "../../../../imports/api/collections/Questions";
import moment from 'jalali-moment'
import BotLogs, {BotLogsClass} from "../../../../imports/api/collections/BotLogs";

class BotClientClass extends ChatClientBaseClass {
    constructor() {
        let defaultConfig = {
            statusKey: 'botClientStatus',
            tokenKey: 'botToken',
            clientProfileKey: 'botClientProfile',
        }
        super(defaultConfig);

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
                149486, // تاک قد کشیده
                473534
            ],
            admins: [
                'f.naysee', 'ma.amjadi'
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
        if(this.questionPack) {
            this.questionsList = Questions.find({packId: this.questionPack._id}, {sort: {order: 1}}).fetch();
            this.Game.title = this.questionPack.title;
        }

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

        if (message.participant.username !== Configs.botUsername){
            QuestionPackClass.increaseTotalMessagesBotReceived(this.questionPack._id);
        }

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

        // Game BOT Management Commands
        const managementCommands = message.message.match(/^\/\/(load|unload|time|threads|addThread|removeThread|getGame|setGameStart|setGameEnd|setGameTreshold|setGameTitle)(\s(.*))?$/);
        if (managementCommands && managementCommands[1]) {
            this.handleManagementCommand(message, managementCommands, userData);
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

    handleManagementCommand = function (message, managementCommands, userData){

        if (this.Game.gods.includes(message.participant.username)) {
                switch (managementCommands[1]) {
                    case 'load':
                        let tempInterval = setInterval(function () {
                            BotClient.botSender(BotClient.client.sendTextMessage({
                                threadId: message.threadId,
                                textMessage: 'Load test at ' + new Date()
                            }, {}));
                        }, 50);
                        BotClient.loadIntervals.push(tempInterval);
                        break;

                    case 'unload':
                        for (let i = 0; i < BotClient.loadIntervals.length; i++) {
                            BotClient.loadIntervals[i] && clearInterval(BotClient.loadIntervals[i]);
                        }
                        break;

                    case 'time':
                        BotClient.botSender(BotClient.client.sendTextMessage({
                            threadId: message.threadId,
                            textMessage: moment().format('jYYYY/jMM/jDD HH:mm:ss')
                        }, {}));
                        break;
                    case 'threads':
                        BotClient.botSender(BotClient.client.sendTextMessage({
                            threadId: message.threadId,
                            textMessage: JSON.stringify(BotClient.Game.threads)
                        }, {}));
                        break;

                    case 'addThread':
                        if (managementCommands[3].length) {
                            BotClient.Game.threads.push(...managementCommands[3].split(',').map(t => +t));

                            BotClient.botSender(BotClient.client.sendTextMessage({
                                threadId: message.threadId,
                                textMessage: JSON.stringify(BotClient.Game.threads)
                            }, {}));
                        }
                        break;
                    case 'removeThread':
                        if (managementCommands[3].length) {
                            BotClient.Game.threads = BotClient.Game.threads.filter((thread) => {
                                return ![...managementCommands[3].split(',').map(t => +t)].includes(thread)
                            });

                            BotClient.botSender(BotClient.client.sendTextMessage({
                                threadId: message.threadId,
                                textMessage: JSON.stringify(BotClient.Game.threads)
                            }, {}));
                        }
                        break;

                    case 'getGame':
                        BotClient.botSender(BotClient.client.sendTextMessage({
                            threadId: message.threadId,
                            textMessage: JSON.stringify(BotClient.Game)
                        }, {}));
                        break;

                    case 'setGameTreshold':
                        BotClient.Game.threshold = +managementCommands[3];

                        BotClient.botSender(BotClient.client.sendTextMessage({
                            threadId: message.threadId,
                            textMessage: BotClient.Game.threshold
                        }, {}));
                        break;

                    case 'setGameTitle':
                        BotClient.Game.title = managementCommands[3];

                        BotClient.botSender(BotClient.client.sendTextMessage({
                            threadId: message.threadId,
                            textMessage: BotClient.Game.title
                        }, {}));
                        break;

                    default:
                        break;
                }
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
                BotLogsClass.Log(userData.user.name + ' ربات را استارت کرد');
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
                break;
            case 'finish':
                BotLogsClass.Log(userData.user.name + ' دستور finish رو زد')

                userData.answer.finishedAt = new Date();
                break;
            case 'scoreboard':
                BotLogsClass.Log(userData.user.name + ' درخواست scoreboard کرد')

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
        if(!userData.answer.originThreadId || !Configs.findOne('botPermittedThreads').value.includes(userData.answer.originThreadId) ) {
            BotClient.botSender(BotClient.client.sendTextMessage({
                threadId: message.threadId,
                textMessage: "برای شروع بازی باید بری داخل گروه تاک قد کشیده و دستور /start@takiBOT رو اجرا کنی تا یه بار دیگه مسابقه برات شروع بشه 😎"
            }, {}));

            return;
        }
        switch (nextLevelCommands[1]) {
            case 'شروع':
                BotLogsClass.Log(userData.user.name + ' بازی رو شروع کرد  ')

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
                    BotClient.sendQuestion(message.threadId, BotClient.questionsList[0], 0, message.participant.id, userData);
                }
                break;

            case 'بعدی':
                BotLogsClass.Log(userData.user.name + ' درخواست سوال ' + userData.answer.currentQuestion + 1 + ' را کرد.' )

                if (userData.answer.currentQuestion > -1) {
                    if (BotClient.questionsList.length > userData.answer.currentQuestion + 1) {
                        userData.answer.currentQuestion += 1;
                        //userData.updateAnswer({currentQuestion: userData.answer.currentQuestion + 1})

                        BotClient.sendQuestion(message.threadId, BotClient.questionsList[userData.answer.currentQuestion], userData.answer.score, message.participant.id, userData);
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
                BotLogsClass.Log(userData.user.name + ' درخواست اتمام بازی کزد ')

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
                BotLogsClass.Log(userData.user.name + ' میخواد ببینه چند امتیاز داره!')

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
    }
    handleReplyMessages = function (message, userData) {
        try {
            const messageMeta = JSON.parse(message.replyInfo.systemMetadata);
            const questionUnique = messageMeta.id;
            const question = BotClient.questionsList.find(q => q._id === questionUnique);

            if (question && Array.isArray(question.correctAnswers)) {
                if (question.order - 1 < userData.answer.currentQuestion) {
                    BotClient.botSender(BotClient.client.sendTextMessage({
                        threadId: message.threadId,
                        textMessage: "جواب این سوال رو قبلا مشخص کردی، امتیازش هم ثبت شده، برو سراغ سوال های بعدی 😏 ...\nبرای گرفتن سوال بعدی کافیه دستور /بعدی رو بفرستی واسم تا سوال جدیدی دریافت کنی."
                    }, {}));
                } else {
                    if (question.correctAnswers.includes(message.message.trim()) || question.correctAnswers.includes(message.message.trim().toLowerCase())) {
                        if (userData.answer.currentQuestion === userData.answer.lastAnsweredQuestion) {
                            userData.answer.score += question.positiveScore - 1;
                        } else {
                            userData.answer.score += question.positiveScore;
                        }
                        userData.answer.lastAnsweredQuestion = userData.answer.currentQuestion;

                        if (!BotClient.Game.firstToReachTreshold.hasOwnProperty('score') && userData.answer.score >= BotClient.questionPack.threshold) {

                            BotClient.Game.firstToReachTreshold = {
                                name: userData.user.name,
                                username: message.participant.name,
                                score: userData.answer.score
                            };

                            BotLogsClass.Log(userData.user.name + ' **** حذاقل امتیاز رو کسب کرد. امتیاز کسب شده:' + userData.answer.score);

                            BotClient.botSender(BotClient.client.replyTextMessage({
                                threadId: userData.answer.originThreadId,
                                repliedTo: userData.answer.originMessageId,
                                textMessage: "تا اینجا "
                                    + BotClient.Game.firstToReachTreshold.name
                                    + " اولین نفری بوده که حداقل امتیاز رو تونسته کسب کنه، امتیازش الان "
                                    + BotClient.Game.firstToReachTreshold.score
                                    + " تا شده.\n\nزمان دقیق ارسال:\n"
                                    + moment().format('jYYYY/jMM/jDD HH:mm:ss') /*new Intl.DateTimeFormat('fa-IR', {
                                    dateStyle: 'short',
                                    timeStyle: 'medium',
                                    hour12: false
                                }).format(new Date())*/
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
                                bound(()=> {
                                    userData.answer.currentQuestion += 1;
                                    BotClient.updateUserData(userData);

                                    BotClient.sendQuestion(message.conversation.id, BotClient.questionsList[userData.answer.currentQuestion], userData.answer.score, message.participant.id, userData);
                                });
                            }
                        }));
                    } else {
                        userData.answer.score -= question.negativeScore;
                        userData.answer.lastAnsweredQuestion = userData.answer.currentQuestion;

                        if (userData.answer.score <= -10) {
                            let userId = message.participant.id;
                            let finishTime = new Date();

                            BotLogsClass.Log(userData.user.name + ' * خیلی منفی خورد و حذف شد')

                            BotClient.botSender(BotClient.client.sendTextMessage({
                                threadId: message.conversation.id,
                                messageType: 'text',
                                textMessage: "🔴😓\nمتاسفم، جوابت اشتباه بود. امتیازهای منفی ات هم خیلی زیاد شد.\n\nاز مسابقه حذف شدی و توی قرعه کشی هم شرکت داده نخواهی شد. امیدوارم تو مسابقه ی بعدی برنده باشی\nتا چهارشنبه هفته ی بعدی، خدانگهدار 😄"
                            }, {
                                onSent: function () {
                                    // userData.updateAnswer({finishedAt: finishTime});
                                    userData.answer.finishedAt = finishTime;
                                    BotClient.updateUserData(userData);
                                }
                            }));

                            BotClient.botSender(BotClient.client.replyTextMessage({
                                threadId: userData.answer.originThreadId,
                                repliedTo: userData.answer.originMessageId,
                                textMessage: "😈😈😈😈😈😈😈😈😈😈\n"
                                    + userData.user.name
                                    + " یکی از رقبای اصلیتون با امتیاز "
                                    + userData.user.score
                                    + " از دور بازی حذف شد.\n\nزمان دقیق ارسال:\n"
                                    + moment(finishTime).format('jYYYY/jMM/jDD HH:mm:ss')
                                /*new Intl.DateTimeFormat('fa', {
                                    dateStyle: 'long',
                                    timeStyle: 'medium'
                                }).format(finishTime)*/
                            }, {
                                onSent: function () {
                                    userData.answer.finishedAt = finishTime;
                                    BotClient.updateUserData(userData);
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
                                textMessage: "🔴😓\nمتاسفم، جوابت اشتباه بود. بخاطر همین " + question.negativeScore + " امتیاز منفی گرفتی.\n\nحالا دوتا کار میتونی بکنی:\n1. یا دوباره برو همین سوال رو ریپلای کن و جواب بده\n2. یا دستور /بعدی رو بفرست که سوال بعدی رو بفرستم واست.\n\nحواست باشه که بری سوال بعدی، امتیاز این سوال از دستت می پره"
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
    }

    increaseTotalMessagesCount(){
        //TODO: Store total sent messages in current active Competition
        //BotClient.Game.stat.msgSendCount++;
        QuestionPackClass.increaseTotalMessagesSent(this.questionPack._id)
    }

    sendQuestion(thread, question, score, userId, userData) {
        if (question && new Date().getTime() < this.questionPack.endsAt && !userData.answer.finishedAt) {
            let msg = "⚪ سوال "
                + (parseInt(question.order) )
                + "\n\n"
                + question.question
                + "\n("
                + question.positiveScore
                + "+ , "
                + question.positiveScore
                + "-)\n";

            if(question.showAnswersToUser) {
                question.answers.forEach(item => {
                    msg += "\n" + `${item.key}. ` + item.text
                });
            }
            msg += "\n\n"
            msg +=  "برای جواب دادن به سوال و رفتن به مرحله ی بعدی کافیه جواب درست رو توی ریپلای این پیام به من بگی. منتظرم ..."

            BotClient.botSender(BotClient.client.sendTextMessage({
                    threadId: thread,
                    systemMetadata: {
                        id: question._id//question.unique
                    },
                    textMessage: msg
                }, {
                    onSent: function () {
                    }
                })
            );
        } else {
            BotClient.gameEnded(thread, score, userId, userData);
        }
    }

    gameEnded = function (thread, score, userId, userData) {
        if (!userData.answer.finishedAt) {
            let finishTime = new Date();

            BotClient.botSender(BotClient.client.sendTextMessage({
                threadId: thread,
                textMessage: "بازی تموم شد 😅\n\nامتیازت در نهایت شد " + score + " تا\n\nالان امتیازت رو توی گروه تاک قد کشیده ارسال میکنم تا بقیه هم ببینن و توی قرعه کشی مسابقه ی این هفته هم شرکت داده بشی.\nخسته نباشی 🏅"
            }, {}));

            BotClient.botSender(BotClient.client.replyTextMessage({
                threadId: userData.answer.originThreadId,
                repliedTo: userData.answer.originMessageId,
                textMessage: userData.user.name
                    + " در مسابقه ی این هفته امتیاز "
                    + score + " را بدست آورد.\n\nزمان دقیق ارسال:\n"
                    + moment(finishTime).format('jYYYY/jMM/jDD HH:mm:ss')
            }, {
                onSent: function () {
                    bound(()=> {
                        userData.answer.finishedAt = finishTime;
                        BotClient.updateUserData(userData);

                        console.log('im here', finishTime)
                    })

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
