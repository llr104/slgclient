// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


import LoginCommand from "../../login/LoginCommand";
const { ccclass, property } = cc._decorator;

@ccclass
export default class MapUILogic extends cc.Component {



    protected onLoad():void{
    }


    protected onDestroy():void{
    }

    protected onBack():void{
        LoginCommand.getInstance().account_logout();
    }
}
