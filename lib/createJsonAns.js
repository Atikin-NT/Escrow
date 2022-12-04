function createJsonAnswer(statusCode, msg, list = []){
    return JSON.stringify({
        code: statusCode,
        msg: msg,
        list: list,
    });
}

module.exports = { createJsonAnswer };