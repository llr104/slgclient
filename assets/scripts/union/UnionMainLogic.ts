import { _decorator, Component, Label, Node, EditBox, Button } from 'cc';
const {ccclass, property} = _decorator;

import UnionCommand from "./UnionCommand";
import { Union } from "./UnionProxy";
import { MapCityData } from "../map/MapCityProxy";
import MapCommand from "../map/MapCommand";
import { EventMgr } from '../utils/EventMgr';

@ccclass('UnionMainLogic')
export default class UnionMainLogic extends Component {
    @property(Label)
    nameLab: Label | null = null;
    @property(Label)
    mengZhuLab: Label | null = null;
    @property(Label)
    noticeLab: Label | null = null;
    @property(Node)
    editNode: Node | null = null;
    @property(EditBox)
    editBox: EditBox | null = null;
    @property(Button)
    modifyBtn: Button | null = null;
    @property(Button)
    applyBtn: Button | null = null;
    @property(Node)
    applyRedDot: Node | null = null;
    
    onLoad () {
        EventMgr.on("union_notice",this.onUnionNotice,this);
        EventMgr.on("union_info",this.onInfo, this);
        EventMgr.on("update_union_apply", this.onUnionApply, this);
    }
    
    protected onDestroy():void{
        EventMgr.targetOff(this);
    }
    onEnable() {
        let city:MapCityData = MapCommand.getInstance().cityProxy.getMyMainCity();
        UnionCommand.getInstance().unionInfo(city.unionId);
        this.updateRedDot()
    }
    updateRedDot(){
        let city:MapCityData = MapCommand.getInstance().cityProxy.getMyMainCity();
        let cnt = UnionCommand.getInstance().proxy.getApplyCnt(city.unionId);
        this.applyRedDot.active = cnt > 0;
    }
    onInfo(){
        let city:MapCityData = MapCommand.getInstance().cityProxy.getMyMainCity();
        let unionData:Union = UnionCommand.getInstance().proxy.getUnion(city.unionId);
        this.nameLab.string = "联盟:" + unionData.name;
        if (unionData.notice == ""){
        this.noticeLab.string = "暂无公告";
        }else{
        this.noticeLab.string = unionData.notice;
        }
        this.mengZhuLab.string = "盟主:" + unionData.getChairman().name
        this.editNode.active = false;

        let ok = unionData.isMajor(city.rid);
        this.modifyBtn.node.active = ok;
        this.applyBtn.node.active = ok;
    }
    onUnionNotice(data){
        this.noticeLab.string = data.text;
    }
    onUnionApply(){
        this.updateRedDot();
    }
    onEditSubmit(){
        this.noticeLab.node.active = true;
        this.editNode.active = false;
        this.modifyBtn.node.active = true;

        var str = this.editBox.string
        UnionCommand.getInstance().modNotice(str);
    }
    onModify(){
        this.noticeLab.node.active = false;
        this.editNode.active = true;
        this.modifyBtn.node.active = false;
    }
    onCancel(){
        this.noticeLab.node.active = true;
        this.editNode.active = false;
        this.modifyBtn.node.active = true;
    }
}
