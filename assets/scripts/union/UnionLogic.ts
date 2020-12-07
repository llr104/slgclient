// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import UnionCommand from "./UnionCommand";


const { ccclass, property } = cc._decorator;

@ccclass
export default class UnionLogic extends cc.Component {

    @property(cc.Node)
    createNode:cc.Node = null;

    @property(cc.ScrollView)
    scrollView:cc.ScrollView = null;

    protected onLoad():void{
        cc.systemEvent.on("upate_union_list",this.updateUnion,this)
        
    }



    protected updateUnion(data:any[]){
        var comp = this.scrollView.node.getComponent("ListLogic");
        comp.setData(data);
    }


    protected onDestroy():void{
        cc.systemEvent.targetOff(this);
    }

    protected onClickClose(): void {
        this.node.active = false;
    }

    protected openCreate():void{
        this.createNode.active = true;
    }

    protected onEnable():void{
        UnionCommand.getInstance().coalitionList();
    }
}
