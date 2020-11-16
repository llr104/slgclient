// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


import { ServerConfig } from "../config/ServerConfig";
import LoginCommand from "./LoginCommand";
const { ccclass, property } = cc._decorator;

@ccclass
export default class CreateLogic extends cc.Component {

    @property(cc.EditBox)
    editName: cc.EditBox = null;


    @property(cc.Toggle)
    manToggle: cc.Toggle = null;
    

    @property(cc.Toggle)
    girlToggle: cc.Toggle = null;


    protected onLoad():void{
        cc.systemEvent.on(ServerConfig.role_create, this.create, this);
        this.editName.string = this.getRandomName(4);
    }

    protected onCreate() {
        var sex = this.manToggle.isChecked?0:1;
        var loginData: any = LoginCommand.getInstance().proxy.loginData;
        LoginCommand.getInstance().role_create(loginData.uid, this.editName.string, sex,LoginCommand.getInstance().proxy.serverId, 0)
    }


    protected create(data):void{
        console.log("create:", data);
        if(data.code == 0){
            this.node.active = false;
        }
    }

    protected onRandomName():void{
        this.editName.string = this.getRandomName(4);
    }
    // 获取指定范围内的随机数
    protected randomAccess(min,max):number{
        return Math.floor(Math.random() * (min - max) + max)
    }
    // 解码
    protected decodeUnicode(str) :string{
        //Unicode显示方式是\u4e00
        str = "\\u"+str
        str = str.replace(/\\/g, "%");
        //转换中文
        str = unescape(str);
        //将其他受影响的转换回原来
        str = str.replace(/%/g, "\\");
        return str;
    }

    /*
    *@param Number NameLength 要获取的名字长度
    */
   protected getRandomName(NameLength):string{
       let name = ""
       for(let i = 0;i<NameLength;i++){
           let unicodeNum  = ""
           unicodeNum = this.randomAccess(0x4e00,0x9fa5).toString(16)
           name += this.decodeUnicode(unicodeNum)
        }
        return name
    }



    protected onDestroy():void{
        cc.systemEvent.targetOff(this);
    }
}
