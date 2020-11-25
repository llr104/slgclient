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



    public static getCodeStr(code:number = 0):string{
        let str = "";
        switch(code){
            case 2:
                str = "数据库异常";
            break;
            case 3:
                str = "用户已存在";
            break;
            case 4:
                str = "密码不正确";
            break;
            case 5:
                str = "用户不存在";
            break;
            case 6:
                str = "session无效";
            break;
            case 7:
                str = "Hardware错误";
            break;
            case 8:
                str = "已经创建过角色了";
            break;
            case 9:
                str = "角色不存在";
            break;
            case 10:
                str = "城市不存在";
            break;
            case 11:
                str = "城市不是自己的";
            break;
            case 12:
                str = "升级失败";
            break;
            case 13:
                str = "武将不存在";
            break;
            case 14:
                str = "武将不是自己的";
            break;
            case 15:
                str = "军队不存在";
            break;
            case 16:
                str = "资源不足";
            break;
            case 17:
                str = "超过带兵限制";
            break;
            case 18:
                str = "军队再忙";
            break;
            case 19:
                str = "将领再忙";
            break;
            case 20:
                str = "不能放弃";
            break;
            case 21:
                str = "领地不是自己的";
            break;
            case 22:
                str = "军队没有主将";
            break;
            case 23:
                str = "不可到达";
            break;

            default:
                str = "错误:"+code;
                break;

        }
        return str;
    }

}