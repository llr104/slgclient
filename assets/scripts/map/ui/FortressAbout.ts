import { _decorator, Component, Node, Label, Button, Prefab, instantiate } from 'cc';
const { ccclass, property } = _decorator;

import ArmyCommand from "../../general/ArmyCommand";
import { ArmyData } from "../../general/ArmyProxy";
import DateUtil from "../../utils/DateUtil";
import { MapBuildData } from "../MapBuildProxy";
import MapCommand from "../MapCommand";
import { MapResType } from "../MapProxy";
import CityArmyItemLogic from "./CityArmyItemLogic";
import { EventMgr } from '../../utils/EventMgr';

@ccclass('FortressAbout')
export default class FortressAbout extends Component {
    @property(Node)
    armyLayer: Node = null;
    @property(Label)
    nameLab: Label = null;
    @property(Label)
    lvLab: Label = null;
    @property(Label)
    timeLab: Label = null;


    @property(Button)
    upBtn: Button = null;

    @property(Button)
    destroyBtn: Button = null;

    @property(Prefab)
    armyItem: Prefab = null;

    protected _armyCnt: number = 5;//队伍数量 固定值
    protected _data: MapBuildData = null;
    protected _armyComps: CityArmyItemLogic[] = [];
    protected _cmd: MapCommand;

    protected onLoad(): void {

        this._cmd = MapCommand.getInstance();
        
    }

    onEnable (): void{
        EventMgr.on("update_builds", this.onUpdateBuilds, this);
        EventMgr.on("update_build", this.onUpdateBuild, this);
        EventMgr.on("delete_build", this.onDeleteBuild, this);

        this.initView();
    }

    protected onDisable(): void {
        EventMgr.targetOff(this);
    }

    protected initView(): void {
        for (let i: number = 0; i < this._armyCnt; i++) {
            let item = instantiate(this.armyItem);
            item.parent = this.armyLayer;
            let comp: CityArmyItemLogic = item.getComponent(CityArmyItemLogic);
            comp.order = i + 1;
            this._armyComps.push(comp);
        }

    }


    protected updateArmyList(): void {
        let armyList: ArmyData[] = ArmyCommand.getInstance().proxy.getArmysByPos(this._data.x, this._data.y);
        console.log("updateArmyList:", armyList, this._data);
        for (let i: number = 0; i < this._armyComps.length; i++) {
            if (this._data.level > i){
                this._armyComps[i].isOpenedArmy(true, true);
            }else{
                this._armyComps[i].isOpenedArmy(false, true);
            }
            
            this._armyComps[i].setArmyData(0, null);
            if (armyList.length > i){
                this._armyComps[i].setArmyData(armyList[i].cityId, armyList[i]);
            }
        }
    }

    public setData(data: MapBuildData): void {
        this._data = data;
        this.nameLab.string = data.name;
        this.lvLab.string = "lv:" + data.level;
        this.startCountDownTime();
        this.updateArmyList();

        if (this._data.type == MapResType.SYS_FORTRESS){
            this.upBtn.node.active = false;
            this.destroyBtn.node.active = false;
        }else if(this._data.type == MapResType.FORTRESS){
            this.upBtn.node.active = true;
            this.destroyBtn.node.active = true;
        }
    }

    protected onUpdateBuilds(areaIndex: number, addIds: number[], removeIds: number[], updateIds: number[]): void {
        console.log("onUpdateBuilds:", removeIds);

        for (let i: number = 0; i < addIds.length; i++) {
            let data = this._cmd.buildProxy.getBuild(addIds[i]);
            if (data.x == this._data.x && data.y == this._data.y){
                this.setData(data);
            }
        }

        for (let i: number = 0; i < removeIds.length; i++) {
            console.log("data:", this._data);
            if(this._data.rid == 0){
                this.node.parent = null;
            }
        }

        for (let i: number = 0; i < updateIds.length; i++) {
            let data = this._cmd.buildProxy.getBuild(updateIds[i]);
            if (data.x == this._data.x && data.y == this._data.y){
                this.setData(data);
            }
        }
    }

    protected onUpdateBuild(data: MapBuildData): void {
       if(data.x == this._data.x && data.y == this._data.y){
           this.setData(data);
       }
    }

    protected onDeleteBuild(id: number, x: number, y: number): void {
        if(x == this._data.x && y == this._data.y){
            this.node.parent = null;
        }
    }

    protected onClickUpBuild(): void {
        this._cmd.upBuild(this._data.x, this._data.y);
    }

    protected onClickDestroyBuild(): void {
        this._cmd.delBuild(this._data.x, this._data.y);
    }

    protected onClickClose(): void {
        this.node.active = false;
    }


    public startCountDownTime(){
        this.stopCountDownTime();
        this.schedule(this.countDownTime, 1.0);
        this.countDownTime();
    }

    public countDownTime() {
        if (this._data.isBuilding()){
            this.timeLab.string = "建设中..." + DateUtil.leftTimeStr(this._data.endTime);
        } else if(this._data.isUping()){
            this.timeLab.string = "升级中..." + DateUtil.leftTimeStr(this._data.endTime);
        } else if(this._data.isDestroying()){
            this.timeLab.string = "拆除中..." + DateUtil.leftTimeStr(this._data.endTime);
        }else{
            this.timeLab.string = "";
            this.stopCountDownTime();
        }
    }

    public stopCountDownTime() {
        this.unschedule(this.countDownTime);
    }
}
