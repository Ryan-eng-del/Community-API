import {getValue} from "../config/RedisConfig";

export const checkCode = async (sid, code) => {
    const redisCode = await getValue(sid);
    let resultBoolean;
    if (!redisCode) {
        resultBoolean = false;
    } else if (redisCode.toLowerCase() === code.toLowerCase()) {
        resultBoolean = true;
    } else {
        resultBoolean = false;
    }
    return resultBoolean;
}