const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options');

const token = '7396683120:AAGehG5G_6g1p65jqg77R0zY4_G5ZMQwncc';
const bot = new TelegramApi(token, {polling: true});

const chats = {};

async function startGame (chatId) {
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, твоя задача будет заключатся в том, чтобы ты её отгадал');
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}

function init () {
    bot.setMyCommands([
        {command: '/start', description: 'Перезапустить бота'},
        {command: '/info', description: 'Узнать информацию о себе и chatID'},
        {command: '/game', description: 'Игра с ботом'},
    ]);

    bot.on('message', async message => {
        const text = message.text;
        const chatId = message.chat.id;
        const firstName = message.chat.first_name;
        const lastName = message.chat.last_name;

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/6ab/72c/6ab72caf-009b-4997-beeb-7f4901bade09/8.webp')
            return bot.sendMessage(chatId, `${firstName} ${lastName}, добро пожаловать в наш бот!`);
        }

        if (text === '/info') {
            const isBot = message.from.is_bot ? 'являетесь ботом' : 'не являетесь ботом'
            return bot.sendMessage(chatId, `Тебя зовут ${firstName} ${lastName}.\nID данного чата: ${chatId}.\nСудя по конструкции и манере общения вы ${isBot}`);
        }

        if (text === '/game') {
            return startGame(chatId);
        }

        return bot.sendMessage(chatId, 'Я тебя не понимаю.');
    });

    bot.on('callback_query',  async message => {
        const data = message.data;
        const chatId = message.message.chat.id;

        if (data === '/again') {
            return startGame(chatId);
        }

        if (Number(data) === chats[chatId]) {
            return await bot.sendMessage(chatId, `🎉 Ты выбрал верную цифру, да это ответ - ${chats[chatId]}`, againOptions);
        } else {
            return bot.sendMessage(chatId, `😣 К большему сожалению ты не угадал. Бот загадал цифру ${chats[chatId]}`, againOptions);
        }
    })
}

init();