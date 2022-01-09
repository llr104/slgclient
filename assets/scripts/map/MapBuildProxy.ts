import { _decorator } from 'cc';
import DateUtil from "../utils/DateUtil";
import MapCommand from "./MapCommand";
import {MapResType } from "./MapProxy";
import MapUtil from "./MapUtil";
import { EventMgr } from '../utils/EventMgr';

/**地图建筑和占领数据*/
export class MapBuildData {
    id: number = 0;
    rid: number = 0;
    nickName: string = "";
    name: string = "";
    x: number = 0;
    y: number = 0;
    type: number = 0;
    level: number = 0;
    opLevel: number = 0;
    curDurable: number = 0;
    maxDurable: number = 0;
    defender: number = 0;
    unionId: number = 0;
    parentId: number = 0;
    unionName: string;
    occupyTime: number;
    giveUpTime: number;
    endTime: number;

    public equalsServerData(data: any) {
        if (this.rid == data.rid
            && this.name == data.name
            && this.nickName == data.RNick
            && this.type == data.type
            && this.level == data.level
            && this.opLevel == data.op_level
            && this.curDurable == data.cur_durable
            && this.maxDurable == data.maxDurable
            && this.defender == data.defender
            && this.unionId == data.union_id
            && this.parentId == data.parent_id
            && this.unionName == data.union_name
            && this.occupyTime == data.occupy_time
            && this.giveUpTime == data.giveUp_time
            && this.endTime == data.end_time) {
            return true;
        }
        return false;
    }

    public static createBuildData(data: any, id: number = 0, buildData: MapBuildData = null): MapBuildData {
        let build: MapBuildData = buildData;
        if (buildData == null) {
            build = new MapBuildData();
        }
        build.id = id;
        build.rid = data.rid;
        build.nickName = data.RNick;
        build.name = data.name;
        build.x = data.x;
        build.y = data.y;
        build.type = data.type;
        build.level = data.level;
        build.opLevel = data.op_level;
        build.curDurable = data.cur_durable;
        build.maxDurable = data.max_durable;
        build.defender = data.defender;
        build.unionId = data.union_id;
        build.parentId = data.parent_id;
        build.unionName = data.union_name;
        build.occupyTime = data.occupy_time;
        build.giveUpTime = data.giveUp_time;
        build.endTime = data.end_time;
        return build;
    }

    public getCellRadius() :number {
        if (this.isSysCity()) {
            if (this.level >= 8){
                return 3
            }else if (this.level >= 5){
                return 2
            }else {
                return 1
            }
        }else {
            return 0
        }
    }

    public isSysCity():boolean{
        return this.type == MapResType.SYS_CITY;
    }

    public isSysFortress():boolean{
        return this.type == MapResType.SYS_FORTRESS;
    }

    public isWarFree(): boolean {
        var diff = DateUtil.getServerTime() - this.occupyTime;
        if(diff < MapCommand.getInstance().proxy.getWarFree()){
            return true;
        }
        return false
    }

    public isResBuild(): boolean{
        return this.type>=MapResType.WOOD && this.type < MapResType.FORTRESS
    }

    public isInGiveUp(): boolean {
        var diff = DateUtil.leftTime(this.giveUpTime);
        return diff > 0
    }

    //正在建设中
    public isBuilding(): boolean {
        var diff = DateUtil.leftTime(this.endTime);
        return diff > 0 && this.level == 0
    }

    //正在升级中
    public isUping(): boolean {
        var diff = DateUtil.leftTime(this.endTime);
        return diff > 0 && this.level > 0 && this.opLevel > 0
    }

    //正在拆除中
    public isDestroying(): boolean {
        var diff = DateUtil.leftTime(this.endTime);
        return diff > 0 && this.opLevel == 0
    }
}

export default class MapBuildProxy {
    protected _mapBuilds: MapBuildData[] = [];
    protected _myBuilds: MapBuildData[] = [];
    protected _lastBuildCellIds: Map<number, number[]> = new Map<number, number[]>();
    public myId: number = 0;
    public myUnionId: number = 0;
    public myParentId: number = 0;
    // 初始化数据
    public initData(): void {
        this._mapBuilds.length = MapUtil.mapCellCount;
        this._lastBuildCellIds.clear();
        this.updateMyBuildIds();//建筑信息比加载更前 所以id需要根据加载的地图做更新
    }

    public clearData(): void {
        this._mapBuilds.length = 0;
        this._lastBuildCellIds.clear();
    }

    /**我的建筑信息*/
    public initMyBuilds(builds: any[]): void {
        this._myBuilds.length = 0;
        for (let i: number = 0; i < builds.length; i++) {
            let id: number = MapUtil.getIdByCellPoint(builds[i].x, builds[i].y);
            let build: MapBuildData = MapBuildData.createBuildData(builds[i], id);
            this._myBuilds.push(build);
        }
    }

    /**更新建筑id*/
    public updateMyBuildIds(): void {
        for (let i: number = 0; i < this._myBuilds.length; i++) {
            let id: number = MapUtil.getIdByCellPoint(this._myBuilds[i].x, this._myBuilds[i].y);
            this._myBuilds[i].id = id;
            this._mapBuilds[id] = this._myBuilds[i];
        }
    }

    /**更新建筑*/
    public updateBuild(build: any): void {
        if (build.rid == 0) {
            //代表是放弃领地
            if(build.type > MapResType.SYS_CITY){
                this.removeBuild(build.x, build.y);
                return;
            }
            
        }
        let id: number = MapUtil.getIdByCellPoint(build.x, build.y);
        let buildData: MapBuildData = null;
        if (this._mapBuilds[id] == null) {
            //代表是新增
            buildData = MapBuildData.createBuildData(build, id);
            this._myBuilds.push(build);
            this._mapBuilds[id] = buildData;
        } else {
            buildData = MapBuildData.createBuildData(build, id, this._mapBuilds[id]);
        }
        EventMgr.emit("update_build", buildData);
        if (buildData.rid == this.myId) {
            //代表是自己的领地
            EventMgr.emit("my_build_change");
        }
    }

    public removeBuild(x: number, y: number): void {
        let id: number = MapUtil.getIdByCellPoint(x, y);
        this._mapBuilds[id] = null;
        EventMgr.emit("delete_build", id, x, y);
        this.removeMyBuild(x, y);
    }

    public removeMyBuild(x: number, y:number):void {
        let index: number = -1;
        for (let i: number = 0; i < this._myBuilds.length; i++) {
            if (this._myBuilds[i].x == x 
                && this._myBuilds[i].y == y) {
                    index = i;
                    break;
            }
        }
        if (index != -1) {
            this._myBuilds.splice(index, 1);
            EventMgr.emit("my_build_change");
        }
    }

    public setMapScanBlock(scanDatas: any, areaId: number = 0): void {
        let rBuilds: any[] = scanDatas.mr_builds;
        if (rBuilds.length > 0) {
            let lastBuildCellIds: number[] = null;
            if (this._lastBuildCellIds.has(areaId)) {
                lastBuildCellIds = this._lastBuildCellIds.get(areaId);
            }
            let buildCellIds: number[] = [];
            let addBuildCellIds: number[] = [];
            let updateBuildCellIds: number[] = [];
            let removeBuildCellIds: number[] = [];
            for (let i: number = 0; i < rBuilds.length; i++) {
                let areaIndex: number = MapUtil.getAreaIdByCellPoint(rBuilds[i].x, rBuilds[i].y);
                if (areaIndex != areaId) {
                    //代表服务端给过来的数据不在当前区域
                    console.log("代表服务端给过来的数据不在当前区域");
                    continue;
                }
                let cellId: number = MapUtil.getIdByCellPoint(rBuilds[i].x, rBuilds[i].y);
                buildCellIds.push(cellId);
                if (lastBuildCellIds) {
                    let index: number = lastBuildCellIds.indexOf(cellId);
                    if (index != -1) {
                        //存在就列表中 就代表是已存在的数据
                        if (this._mapBuilds[cellId].equalsServerData(rBuilds[i]) == false) {
                            //代表数据不一样需要刷新
                            this._mapBuilds[cellId] = MapBuildData.createBuildData(rBuilds[i], cellId, this._mapBuilds[cellId]);
                            updateBuildCellIds.push(cellId);
                        }else{
                            console.log("equalsServerData true");
                        }
                        lastBuildCellIds.splice(index, 1);//移除重复数据
                        continue;
                    }

                }
                //其他情况就是新数据了
                this._mapBuilds[cellId] = MapBuildData.createBuildData(rBuilds[i], cellId);
                addBuildCellIds.push(cellId);
            }
            if (lastBuildCellIds && lastBuildCellIds.length > 0) {
                //代表有需要删除的数据
                removeBuildCellIds = lastBuildCellIds;
                for (let i: number = 0; i < removeBuildCellIds.length; i++) {
                    this._mapBuilds[removeBuildCellIds[i]] = null;
                }
            }
            this._lastBuildCellIds.set(areaId, buildCellIds);
            if (addBuildCellIds.length > 0 || removeBuildCellIds.length > 0 || updateBuildCellIds.length > 0) {
                console.log("update_builds", areaId, addBuildCellIds, removeBuildCellIds, updateBuildCellIds);
                EventMgr.emit("update_builds", areaId, addBuildCellIds, removeBuildCellIds, updateBuildCellIds);
            }
        }
    }

    public getBuild(id: number): MapBuildData {
        return this._mapBuilds[id];
    }

    public getMyBuildList():MapBuildData[] {
        return this._myBuilds;
    }

    public updateSub(rid: number, unionId: number, parentId: number): void {
        if (rid == this.myId){
            this.myUnionId = unionId;
            this.myParentId = parentId;
        }
    }
}
