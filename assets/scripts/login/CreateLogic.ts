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


    start() {
        cc.systemEvent.on(ServerConfig.role_create, this.create, this);
    }



    onCreate() {
        var loginData: any = LoginCommand.getInstance().proxy.loginData;
        LoginCommand.getInstance().role_create(loginData.uid, this.labelName.string, 0, 0, 0)
    }


    create(data) {
        console.log("create:", data)
    }



    onDestroy() {
        cc.systemEvent.targetOff(this);
    }
}
