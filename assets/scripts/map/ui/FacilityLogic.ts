// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import MapCommand from "../MapCommand";
import MapUICommand from "./MapUICommand";


const { ccclass, property } = cc._decorator;

@ccclass
export default class FacilityLogic extends cc.Component {


    @property(cc.Node)
    facilityNode: cc.Node = null;

    @property(cc.Layout)
    srollLayout:cc.Layout = null;

    protected onLoad():void{
        cc.systemEvent.on("getCityFacilities", this.onQryCityFacilities, this);
    }



    protected onDestroy():void{
        cc.systemEvent.targetOff(this);
    }

    protected onClickClose(): void {
        this.node.active = false;
    }


    protected onEnable():void{
        this.onQryCityFacilities();
        var cityId = MapCommand.getInstance().proxy.getMyMainCity().cityId;
        MapUICommand.getInstance().qryCityFacilities(cityId);
    }


    protected onQryCityFacilities():void{
        var facility = MapUICommand.getInstance().proxy.getMyFacility();
        console.log("facility:",facility);
        this.srollLayout.node.removeAllChildren();
        if(facility){
            for(var i = 0;i < facility.length; i++){
                var item = cc.instantiate(this.facilityNode);
                item.active = true;
                item.getChildByName("facilityname").getComponent(cc.Label).string = facility[i].name;
                item.getChildByName("facilitylv").getComponent(cc.Label).string = "Lv:"+facility[i].cLevel;
                item.parent = this.srollLayout.node;
                item.otherData = facility[i];
            }
        }

    }


    protected onClickFacility(event:any): void {
        console.log("onClickFacility:",event.currentTarget);
    }

}
