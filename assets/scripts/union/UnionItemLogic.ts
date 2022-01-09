import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;
import UnionCommand from "./UnionCommand";
import { Union } from "./UnionProxy";
import { EventMgr } from '../utils/EventMgr';

@ccclass('UnionItemLogic')
export default class UnionItemLogic extends Component {
    @property(Label)
    nameLabel: Label | null = null;
    @property(Node)
    joinButtonNode: Node | null = null;
    protected _unionData:Union = null;
    protected onLoad():void{
        this.joinButtonNode.active = false;
    }
    protected updateItem(data:Union):void{
        this._unionData = data;
        this.nameLabel.string = this._unionData.name;
        this.joinButtonNode.active = this.isCanJoin();


    }
    protected isCanJoin():boolean{
        return !UnionCommand.getInstance().proxy.isMeInUnion();
    }
    protected join():void{
        UnionCommand.getInstance().unionJoin(this._unionData.id)
    }
    protected click():void{
        var isCanjoin:boolean = this.isCanJoin();
        if(!isCanjoin){
            EventMgr.emit("open_my_union",this._unionData)
        }
    }
}
