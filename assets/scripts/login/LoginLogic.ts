// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import LoginCommand from "./LoginCommand";


const { ccclass, property } = cc._decorator;

@ccclass
export default class LoginLogic extends cc.Component {

    @property(cc.Label)
    labelName: cc.Label = null;

    @property(cc.Label)
    labelPass: cc.Label = null;

    protected onLoad(): void {
        cc.systemEvent.on("loginComplete", this.onLoginComplete, this);
    }

    protected onDestroy(): void {
        cc.systemEvent.targetOff(this);
    }

    protected onLoginComplete():void {
        this.node.active = false;
    }

    protected onClickRegister(): void {
        LoginCommand.getInstance().register(this.labelName.string, this.labelPass.string);
    }

    protected onClickLogin(): void {
        LoginCommand.getInstance().accountLogin(this.labelName.string, this.labelPass.string)
    }

    protected onClickClose(): void {
        this.node.active = false;
    }
}
