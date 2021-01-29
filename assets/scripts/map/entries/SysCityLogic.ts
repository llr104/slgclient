
import { MapResData } from "../MapProxy";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SysCityLogic extends cc.Component {

    protected _data: MapResData = null;


    protected onDisable(): void {
        this._data = null;
        cc.systemEvent.targetOff(this);
    }



    public setCityData(data: MapResData): void {
        this._data = data;
        this.updateUI();
    }

    public updateUI(): void {
        this._data.level = 8;

        if(this._data.level >= 10){
                this.node.scale = 1.0;
        }else if(this._data.level >= 8){
                this.node.scale = 0.9;
        }else if(this._data.level >= 7){
            this.node.scale = 0.8;
        }else if(this._data.level >= 5){
            this.node.scale = 0.6;
        }else if(this._data.level >= 3){
            this.node.scale = 0.5;
        }else {
            this.node.scale = 0.4;
        }
    }
}