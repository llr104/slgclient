// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Modal extends cc.Component {

    @property(cc.Node)
    mask: cc.Node = null;



    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}


    protected onEnable() :void{
        this.mask.active = true;
        this.mask.on(cc.Node.EventType.TOUCH_START, this.stopPropagation, this, true);
        this.mask.on(cc.Node.EventType.TOUCH_END, this.stopPropagation, this, true);
    } 

    protected onDisable():void{
        this.mask.active = false;
        this.mask.off(cc.Node.EventType.TOUCH_START, this.stopPropagation, this, true);
        this.mask.off(cc.Node.EventType.TOUCH_END, this.stopPropagation, this, true);
    }

    protected stopPropagation(event: cc.Event.EventTouch):void {
        event.stopPropagation();
    }
}
