// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import LoginCommand from "./LoginCommand";


const {ccclass, property} = cc._decorator;

@ccclass
export default class LoginLogic extends cc.Component {

    @property(cc.Label)
    labelName: cc.Label = null;

    @property(cc.Label)
    labelPass: cc.Label = null;

    start () {
        cc.systemEvent.on("create", this.enter, this);
    }


    onRegister(){
        LoginCommand.getInstance().register(this.labelName.string,this.labelPass.string);
    }


    onLogin(){
        LoginCommand.getInstance().accountLogin(this.labelName.string,this.labelPass.string)
    }


    enter(data){
        this.node.destroy();
    }

    onDestroy(){
        cc.systemEvent.targetOff(this);
    }
}
