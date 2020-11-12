// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { LocalCache } from "../utils/LocalCache";
import LoginCommand from "./LoginCommand";


const { ccclass, property } = cc._decorator;

@ccclass
export default class LoginLogic extends cc.Component {

    @property(cc.EditBox)
    editName: cc.EditBox = null;

    @property(cc.EditBox)
    editPass: cc.Label = null;

    protected onLoad(): void {
        cc.systemEvent.on("loginComplete", this.onLoginComplete, this);

        var data = LocalCache.getLoginValidation();
        console.log("LoginLogic  data:",data)
        if(data){
            this.editName.string = data.username;
            this.editPass.string = data.password;
        }
    }

    protected onDestroy(): void {
        cc.systemEvent.targetOff(this);
    }

    protected onLoginComplete():void {
        this.node.active = false;
    }

    protected onClickRegister(): void {
        LoginCommand.getInstance().register(this.editName.string, this.editPass.string);
    }

    protected onClickLogin(): void {
        LoginCommand.getInstance().accountLogin(this.editName.string, this.editPass.string)
    }

    protected onClickClose(): void {
        this.node.active = false;
    }
}
