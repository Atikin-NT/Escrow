/**
 * @param  {int} statusCode
 * @param  {string} msg
 * @param  {Object[]} list=[]
 * @returns {JSON.stringify} answer in json fromat
 */
exports.createJsonAnswer = (statusCode, msg, list = []) => {
    return JSON.stringify({
        code: statusCode,
        msg: msg,
        list: list,
    });
}