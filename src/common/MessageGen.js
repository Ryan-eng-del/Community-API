class MessageGen {
    msg;
    code;
    constructor(code, msg) {
        this.code = code;
        this.msg  = msg;
    }
}

export function genErrorMsg(code, msg, ctx) {
    ctx.status = code;
    return new MessageGen(code, msg);
}
