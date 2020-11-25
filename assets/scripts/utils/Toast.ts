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


    protected onLoad():void{
        this.schedule( this.onRemove, 2 );
    }


    protected onRemove():void{
        this.node.destroy();
    }



    protected setText(text:string):void{
        this.msgLabel.string = text;
        var height = this.node.height;
    }
}
