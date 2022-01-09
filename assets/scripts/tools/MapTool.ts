import { _decorator, Component, TiledMap, EditBox, Label, Size } from 'cc';
const { ccclass, property } = _decorator;

import { MapResType } from "../map/MapProxy";
import { JSB } from 'cc/env';

@ccclass('MapTool')
export default class MapTool extends Component {

    @property(TiledMap)
    tiledMap: TiledMap = null;

    @property(EditBox)
    editBox: EditBox = null;

    @property(Label)
    tipsLab: Label = null;

    protected _mapSize: Size = null;
    protected _mapGroundIds: number[] = null;
    protected _resList: any[] = null;

    protected onLoad(): void {
        console.log("tiledMap", this.tiledMap);
    }

    protected getRandomResData(): number[] {
        let randomType: number = Math.floor(Math.random() * 4) + 52;
        let randomValue: number = Math.floor(Math.random() * 100);
        let randomLevel: number = 1;
        if (randomValue < 20) {
            randomLevel = 1;
        } else if (randomValue >= 20 && randomValue < 40) {
            randomLevel = 2;
        } else if (randomValue >= 40 && randomValue < 55) {
            randomLevel = 3;
        } else if (randomValue >= 55 && randomValue < 65) {
            randomLevel = 4;
        } else if (randomValue >= 65 && randomValue < 75) {
            randomLevel = 5;
        }else if (randomValue >= 75 && randomValue < 85) {
            randomLevel = 6;
        }else if (randomValue >= 85 && randomValue < 94) {
            randomLevel = 7;
        }else if (randomValue >= 94 && randomValue < 99) {
            randomLevel = 8;
        }else {
            randomType = MapResType.SYS_FORTRESS;
            randomLevel = 5;
        }
        return [randomType, randomLevel];
    }

    protected onClickMake(): void {
        this._mapSize = this.tiledMap.getMapSize();
        this._mapGroundIds = this.tiledMap.getLayer("obstruct").getTiles();
        var city_positionIds = this.tiledMap.getLayer("city_position").getTiles();


        let data: { w: number, h: number, list: any[] } = { w: 0, h: 0, list: null };
        this._resList = [];
        for (let i: number = 0; i < this._mapGroundIds.length; i++) {
            if (city_positionIds[i] > 0) {
                var num = Math.floor((Math.random()*10)+1);
                this._resList.push([51, num]);
            } else if(this._mapGroundIds[i] > 0) {
                this._resList.push([0, 0]);
            }
            else {
                this._resList.push(this.getRandomResData());
            }
        }

        if (this.editBox.string == ""){
            this.tipsLab.string = "请输入生成输出目录";
            return
        }

        if (!JSB) {
            this.tipsLab.string = "请使用 Windows 模拟器运行";
            return
        }

        var path = this.editBox.string;
        if(jsb.fileUtils.isDirectoryExist(path) == false){
            this.tipsLab.string = "目录不存在";
            return
        }
        

        data.w = this._mapSize.width;
        data.h = this._mapSize.height;
        data.list = this._resList;
        jsb.fileUtils.writeStringToFile(JSON.stringify(data), path + "/mapRes_0.json");
       

        this.tipsLab.string = "生成成功";
    }
}
