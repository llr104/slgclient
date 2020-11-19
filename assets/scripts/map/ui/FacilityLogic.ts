// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import LoginCommand from "../../login/LoginCommand";
import MapCommand from "../MapCommand";
import MapUICommand from "./MapUICommand";


const { ccclass, property } = cc._decorator;

@ccclass
export default class FacilityLogic extends cc.Component {


    @property(cc.Node)
    facilityNode: cc.Node = null;

    @property(cc.Layout)
    srollLayout:cc.Layout = null;

    protected _curCtiyId:number = 0;

    protected onLoad():void{
        cc.systemEvent.on("getCityFacilities", this.onQryCityFacilities, this);

        
    }


    protected onDestroy():void{
        cc.systemEvent.targetOff(this);
    }

    protected onClickClose(): void {
        this.node.active = false;
    }


    public setData(data:any):void{
        this._curCtiyId  = data.cityId;
        
        MapUICommand.getInstance().qryCityFacilities(this._curCtiyId);
        this.onQryCityFacilities();

    }

    protected onQryCityFacilities():void{
        var cityId = this._curCtiyId;
        var facility = MapUICommand.getInstance().proxy.getMyFacility(cityId);
        // console.log("facility:",facility);
        this.srollLayout.node.removeAllChildren();
        if(facility){
            for(var i = 0;i < facility.length; i++){
                var item = cc.instantiate(this.facilityNode);
                item.active = true;
                item.getChildByName("facilityname").getComponent(cc.Label).string = facility[i].name;
                item.getChildByName("facilitylv").getComponent(cc.Label).string = "Lv:"+facility[i].level;
                item.parent = this.srollLayout.node;
                item.otherData = facility[i];
            }
        }

    }


    protected onClickFacility(event:any): void {
        var otherData = event.currentTarget.otherData;
        otherData.cityId = this._curCtiyId;
        cc.systemEvent.emit("open_facility_des",otherData);
    }

}
