

import { _decorator, Component, Node, Event } from 'cc';
const {ccclass, property} = _decorator;

@ccclass('Modal')
export default class Modal extends Component {

    @property(Node)
    mask: Node = null;

    
    start () {

    }

    protected onEnable() :void{
        this.mask.active = true;
        this.mask.on(Node.EventType.TOUCH_START, this.stopPropagation, this, true);
        this.mask.on(Node.EventType.TOUCH_END, this.stopPropagation, this, true);
    } 

    protected onDisable():void{
        this.mask.active = false;
        this.mask.off(Node.EventType.TOUCH_START, this.stopPropagation, this, true);
        this.mask.off(Node.EventType.TOUCH_END, this.stopPropagation, this, true);
    }

    protected stopPropagation(event: Event):void {
        event.propagationStopped = true;
    }
}
