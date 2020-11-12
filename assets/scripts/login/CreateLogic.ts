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

    @property(cc.Label)
    labelName: cc.Label = null;


    @property(cc.Toggle)
    manToggle: cc.Toggle = null;
    

    @property(cc.Toggle)
    girlToggle: cc.Toggle = null;


    protected onLoad():void{
        cc.systemEvent.on(ServerConfig.role_create, this.create, this);
    }

    protected onCreate() {
        var sex = this.manToggle.isChecked?0:1;
        var loginData: any = LoginCommand.getInstance().proxy.loginData;
        LoginCommand.getInstance().role_create(loginData.uid, this.labelName.string, sex,0, 0)
    }


    protected create(data):void{
        console.log("create:", data);
        if(data.code == 0){
            this.node.active = false;
        }
    }



    protected onDestroy():void{
        cc.systemEvent.targetOff(this);
    }
}
