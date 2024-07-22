//sare event ham es file me rakhenge

//object
const ACTIONS = {
    JOIN: 'join',
    JOINED: 'joined', //confirmation from server
    DISCONNECTED: 'disconnected',
    CODE_CHANGE: 'code-change',
    SYNC_CODE: 'sync-code',
    LEAVE: 'leave',
    CHAT_MESSAGE: 'chat_message',
};

module.exports = ACTIONS; //same file we will use on server side also thats why this syntax we are using