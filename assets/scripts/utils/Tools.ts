
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

        var codeObj = {};
        codeObj[-4] = "代理连接失败";
        codeObj[-3] = "代理错误";
        codeObj[-2] = "链接没有找到用户";
        codeObj[-1] = "链接没有找到角色";
        codeObj[0] = "成功";

        codeObj[1] = "参数有误";
        codeObj[2] = "数据库异常";
        codeObj[3] = "用户已存在";
        codeObj[4] = "密码不正确";
        codeObj[5] = "用户不存在";
        codeObj[6] = "session无效";
        codeObj[7] = "Hardware错误";
        codeObj[8] = "已经创建过角色了";
        codeObj[9] = "角色不存在";
        codeObj[10] = "城市不存在";

        codeObj[11] = "城市不是自己的";
        codeObj[12] = "升级失败";
        codeObj[13] = "武将不存在";
        codeObj[14] = "武将不是自己的";
        codeObj[15] = "军队不是自己的";
        codeObj[16] = "资源不足";
        codeObj[17] = "超过带兵限制";
        codeObj[18] = "军队再忙";
        codeObj[19] = "将领再忙";
        codeObj[20] = "不能放弃";

        codeObj[21] = "领地不是自己的";
        codeObj[22] = "军队没有主将";
        codeObj[23] = "不可到达";
        codeObj[24] = "体力不足";
        codeObj[25] = "政令不足";
        codeObj[26] = "金币不足";
        codeObj[27] = "重复上阵";
        codeObj[28] = "cost不足";
        codeObj[29] = "没有该合成武将";
        codeObj[30] = "合成武将非同名";

        codeObj[31] = "统帅不足";
        codeObj[32] = "升级失败";
        codeObj[33] = "升级到最大星级";
        codeObj[34] = "联盟创建失败";
        codeObj[35] = "联盟不存在";
        codeObj[36] = "权限不足";
        codeObj[37] = "已经有联盟";
        codeObj[38] = "不允许退出";
        codeObj[39] = "内容太长";
        codeObj[40] = "不属于该联盟";

        codeObj[41] = "用户已满";
        codeObj[42] = "已经申请过了";
        codeObj[43] = "不能驻守";
        codeObj[44] = "不能占领";
        codeObj[45] = "没有募兵所";
        codeObj[46] = "免战中";
        codeObj[47] = "征兵中";
        codeObj[48] = "领地已经在放弃了";
        codeObj[49] = "不能再新建建筑在领地上";
        codeObj[50] = "不能调兵";

        codeObj[51] = "坑位已满";
        codeObj[52] = "队伍在城外";
        codeObj[53] = "不能升级建筑";
        codeObj[54] = "不能拆除建筑";
        codeObj[55] = "超过征收次数";
        codeObj[56] = "cd内不能操作";
        codeObj[57] = "武将超过上限了";
        codeObj[58] = "没有集市";
        codeObj[59] = "超过了收藏上限";

        codeObj[60] = "超过了技能上限";
        codeObj[61] = "装备技能失败";
        codeObj[62] = "取下技能失败";
        codeObj[63] = "兵种不符";
        codeObj[64] = "该位置没有技能";
        codeObj[65] = "技能等级已满";

        if (codeObj[code] == null){
            str = "错误:" + code;
        }else{
            str = codeObj[code]
        }
        return str;
    }

    public static numberToShow(num:number = 0):string{
        if (num >= 100000000){
            return Math.floor(num/100000000) + "亿"
        }
        else if (num >= 10000){
            return Math.floor(num/10000) + "万"
        }else{
            return num + ""
        }
    }

}
