const {default : axios} = require('axios')
const bcrypt = require('bcrypt');
const generateId = require('generate-unique-id');

async function genUniqueChar(){
    const genId = generateId({length : 8});
    return genId;
}

async function genPassword(password,saltRounds = 10){
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password,salt);
}


async function createChatID(curID,selID){
    return `${curID}#${selID}`;
}


module.exports = {genPassword, genUniqueChar,createChatID}