// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import UnionCommand from "./UnionCommand";
import { Member, Union } from "./UnionProxy";
import { MapCityData } from "../map/MapCityProxy";
import MapCommand from "../map/MapCommand";
const {ccclass, property} = cc._decorator;

@ccclass
export default class UnionMainLogic extends cc.Component {

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Label)
    mengZhuLab: cc.Label = null;

    @property(cc.Label)
    noticeLab: cc.Label = null;

    @property(cc.Node)
    editNode: cc.Node = null;

    @property(cc.EditBox)
    editBox: cc.EditBox = null;

    @property(cc.Button)
    modifyBtn: cc.Button = null;

    @property(cc.Button)
    applyBtn: cc.Button = null;
    
    onLoad () {
        cc.systemEvent.on("union_notice",this.onUnionNotice,this);
    }

    onEnable() {
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
