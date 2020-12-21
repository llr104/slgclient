// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property } = cc._decorator;

@ccclass
export default class ChatLogic extends cc.Component {


    @property(cc.ScrollView)
    chatView:cc.ScrollView = null;

    protected onLoad():void{
    }


    protected updateMember(data:any[]){
        var comp = this.chatView.node.getComponent("ListLogic");
        comp.setData([]);

    }
    protected onClickClose(): void {
        this.node.active = false;
    }


    protected onClickChat(): void {
    }

}
