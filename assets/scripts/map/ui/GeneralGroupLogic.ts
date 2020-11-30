// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ArmyCommand from "../../general/ArmyCommand";
import { ArmyData } from "../../general/ArmyProxy";
import GeneralCommand from "../../general/GeneralCommand";
import { GeneralData } from "../../general/GeneralProxy";


const { ccclass, property } = cc._decorator;

@ccclass
export default class GeneralGroupLogic extends cc.Component {


    @property(cc.Prefab)
    generalItemPrefab: cc.Prefab = null;

    
    @property([cc.Node])
    itemNode: cc.Node[] = [];

    private _curData:any = null;
    private _cityData:any = null;

    protected onLoad():void{

    }


    protected setData(curData:any,cityData:any,orderId:number = 1):void{
        this._curData = curData;
        this._cityData = cityData;

        // console.log("GeneralGroupLogic--this._curData:",curData,orderId)
        if(this._curData){
            for(var i = 0; i < this.itemNode.length ;i++){
                let item:cc.Node = this.itemNode[i].getChildByName("GeneralItem");
                let tip:cc.Node = this.itemNode[i].getChildByName("tip");
                let com = item.getComponent("GeneralItemLogic");
                var id = this._curData.generals[i];
                if(id > 0){
                    tip.active = false;
                    item.active = true;

                    if(com){
                        let general:GeneralData = GeneralCommand.getInstance().proxy.getMyGeneral(id);
                        com.setData(general,2);
                        com.setOtherData(cityData,orderId);

                    }

                }else{
                    tip.active = true;
                    item.active = false;
                }

            }
        }

    }



    protected onClickDisGeneral(event:any,index:number = 0): void {
        var generalArr = this.getAllGenerals();
        cc.systemEvent.emit("open_general_choose",generalArr,index);
    }


    private getAllGenerals():number[]{
        let cityArmyData: ArmyData[] = ArmyCommand.getInstance().proxy.getArmyList(this._cityData.cityId);
        let general:GeneralData = null;
        var arr = [];
        for(var i = 0; i < cityArmyData.length ;i++){
            if(cityArmyData[i]){
                arr = arr.concat(cityArmyData[i].generals);

                general = GeneralCommand.getInstance().proxy.getMyGeneral(cityArmyData[i].generals[0]);
                if(general){
                    arr = arr.concat(GeneralCommand.getInstance().proxy.getGeneralIds(general.cfgId));
                }


                general = GeneralCommand.getInstance().proxy.getMyGeneral(cityArmyData[i].generals[1]);
                if(general){
                    arr = arr.concat(GeneralCommand.getInstance().proxy.getGeneralIds(general.cfgId));
                }


                general = GeneralCommand.getInstance().proxy.getMyGeneral(cityArmyData[i].generals[2]);
                if(general){
                    arr = arr.concat(GeneralCommand.getInstance().proxy.getGeneralIds(general.cfgId));
                }


            }
            
        }
        return arr;
    }

}
