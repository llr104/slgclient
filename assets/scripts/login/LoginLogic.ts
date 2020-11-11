// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


import { LoginCommand } from "./LoginCommand";
var ServerConfig = require("ServerConfig");
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    labelName: cc.Label = null;

    @property(cc.Label)
    labelPass: cc.Label = null;

    start () {
        cc.systemEvent.on("create", this.enter, this);
    }


    onRegister(){
        new LoginCommand().register(this.labelName.string,this.labelPass.string);
    }


    onLogin(){
        new LoginCommand().accountLogin(this.labelName.string,this.labelPass.string)
    }


    enter(data){
        this.node.destroy();
    }

    onDestroy(){
        cc.systemEvent.targetOff(this);
    }
}
