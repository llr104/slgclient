import { LocalCache } from "./LocalCache";

export class Tools{
    public static getUUID():string{
        let uuid_str = '';
        let cache = LocalCache.getUuid();
        if(cache == ""){
            var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
            var uuid = [];
            let radix = 16 | chars.length;
            for (let i = 0; i < 36; i++) uuid[i] = chars[0 | Math.random() * radix];
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid_str = uuid.join('');
            LocalCache.setUuid(uuid_str);
        }else{
            uuid_str = cache;
        }

        return uuid_str
    }
}