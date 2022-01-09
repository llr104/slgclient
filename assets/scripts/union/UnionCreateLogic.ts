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

@ccclass('UnionCreateLogic')
export default class UnionCreateLogic extends Component {
    @property(EditBox)
    editName: EditBox | null = null;
    protected onLoad():void{
        EventMgr.on("create_union_success",this.onClickClose,this)
        this.editName.string = this.getRandomName();
    }
    protected onCreate() {
        UnionCommand.getInstance().unionCreate(this.editName.string);
    }
    protected onRandomName():void{
        this.editName.string = this.getRandomName();
    }
    protected getRandomName():string{
        let name = ""
        var firstname:string[] = ["李","西门","沈","张","上官","司徒","欧阳","轩辕","咳咳","妈妈"];
        var nameq:string[] = ["彪","巨昆","锐","翠花","小小","撒撒","熊大","宝强"];
        var xingxing = firstname[Math.floor(Math.random() * (firstname.length))];
        var mingming = nameq[Math.floor(Math.random() * (nameq.length))];
        name = xingxing + mingming;
        return name
     }
    protected onDestroy():void{
        EventMgr.targetOff(this);
    }
    protected onClickClose(): void {
        this.node.active = false;
    }
}
