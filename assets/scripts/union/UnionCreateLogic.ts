// // Learn TypeScript:
// //  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, EditBox } from 'cc';
const { ccclass, property } = _decorator;

import UnionCommand from "./UnionCommand";
import { EventMgr } from '../utils/EventMgr';
import { AudioManager } from '../common/AudioManager';
import { createName } from '../libs/NameDict';

@ccclass('UnionCreateLogic')
export default class UnionCreateLogic extends Component {
    @property(EditBox)
    editName: EditBox | null = null;
    protected onLoad():void{
        EventMgr.on("create_union_success",this.onUnCreateOk,this)
        this.editName.string = this.getRandomName();
    }

    protected onCreate() {
        AudioManager.instance.playClick();
        UnionCommand.getInstance().unionCreate(this.editName.string);
    }

    protected onRandomName():void{
        AudioManager.instance.playClick();
        this.editName.string = this.getRandomName();
    }
    protected getRandomName():string{
        let name = createName("boy");
        return name
     }

    protected onDestroy():void{
        EventMgr.targetOff(this);
    }

    protected onUnCreateOk(){
        this.node.active = false;
    }

    protected onClickClose(): void {
        this.node.active = false;
        AudioManager.instance.playClick();
    }
}
