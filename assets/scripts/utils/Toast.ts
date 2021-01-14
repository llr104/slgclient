// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html




const { ccclass, property } = cc._decorator;

@ccclass
export default class Toast extends cc.Component {


    @property(cc.Label)
    msgLabel: cc.Label = null;


    protected onRemove():void{
        this.node.active = false;
    }


    public setText(text:string):void{
        this.unschedule(this.onRemove);
        this.schedule(this.onRemove, 2);
        this.msgLabel.string = text;
    }
}
