// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { ArmyData } from "../../general/ArmyProxy";
import GeneralCommand from "../../general/GeneralCommand";
import { GeneralData } from "../../general/GeneralProxy";


const { ccclass, property } = cc._decorator;

@ccclass
export default class GeneralLogic extends cc.Component {

    // @property(cc.Layout)
    // srollLayout:cc.Layout = null;

    @property(cc.ScrollView)
    scrollView:cc.ScrollView = null;

    // @property(cc.Prefab)
    // generalItemPrefab: cc.Prefab = null;



    private _cunGeneral:number[] = [];
    private _type:number = 0;
    private _position:number = 0;

    protected onLoad():void{
        cc.systemEvent.on("update_my_generals", this.initGeneralCfg, this);
        cc.systemEvent.on("chosed_general", this.onClickClose, this); 
    }


    protected onDestroy():void{
        cc.systemEvent.targetOff(this);
    }

    protected onClickClose(): void {
        this.node.active = false;
    }



    protected initGeneralCfg():void{
        let list:any[] = GeneralCommand.getInstance().proxy.getMyGenerals();
        let listTemp = list.concat();


        listTemp.forEach(item => {
            item.type = this._type;
            item.position = this._position;
        })


        for(var i = 0; i < listTemp.length ;i++){
            if(this._cunGeneral.indexOf(listTemp[i].id) >= 0 ){
                listTemp.splice(i,1);
                i--;
            }
        }

        var comp = this.scrollView.node.getComponent("ListLogic");
        comp.setData(listTemp);
    }



    public setData(data:number[],type:number = 0,position:number = 0):void{
        if(data && data.length > 0){
            this._cunGeneral = data;
        }
        
        this._type = type;
        this._position = position;

        console.log("GeneralLogic:",this._cunGeneral,data)

        this.initGeneralCfg();
        GeneralCommand.getInstance().qryMyGenerals();
    }




    protected drawGeneralOnce():void{
        GeneralCommand.getInstance().drawGenerals();
    }

    protected drawGeneralTen():void{
        GeneralCommand.getInstance().drawGenerals(10);
    }

    protected onEnable():void{

    }


}
