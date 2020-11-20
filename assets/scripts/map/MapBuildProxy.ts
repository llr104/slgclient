import MapUtil from "./MapUtil";

/**地图建筑和占领数据*/
export class MapBuildData {
    id: number = 0;
    rid: number = 0;
    nickName: string = "";
    name: string = "";
    x: number = null;
    y: number = 0;
    type: number = 0;
    level: number = 0;
    curDurable: number = 0;
    maxDurable: number = 0;
    defender: number = 0;

    public equalsServerData(data: any) {
        if (this.rid == data.rid
            && this.nickName == data.RNick
            && this.type == data.type
            && this.level == data.level
            && this.curDurable == data.cur_durable
            && this.maxDurable == data.maxDurable
            && this.defender == data.defender) {
            return true;
        }
        return false;
    }
}

export default class MapBuildProxy {
    protected _mapBuilds: MapBuildData[] = [];
    protected _myBuilds: MapBuildData[] = [];
    protected _lastBuildCellIds: Map<number, number[]> = new Map<number, number[]>();

    // 初始化数据
    public initData(): void {
        this._mapBuilds.length = MapUtil.mapCellCount;
        this._lastBuildCellIds.clear();
    }

    public clearData(): void {
        this._mapBuilds.length = 0;
        this._lastBuildCellIds.clear();
    }

    protected createBuildData(data: any, id: number = 0, buildData: MapBuildData = null): MapBuildData {
        let build: MapBuildData = buildData;
        if (buildData == null) {
            build = new MapBuildData();
        }
        build.id = id;
        build.rid = data.rid;
        build.nickName = data.RNick;
        build.x = data.x;
        build.y = data.y;
        build.type = data.type;
        build.level = data.level;
        build.curDurable = data.cur_durable;
        build.maxDurable = data.max_durable;
        build.defender = data.defender;
        return build;
    }

    /**我的建筑信息*/
    public setMyBuilds(builds: any[]): void {
        // this._mySubCitys.length = 0;
        // for (let i: number = 0; i < citys.length; i++) {
        //     let city: MapCityData = this.createCityData(citys[i]);
        //     if (city.isMain) {
        //         this._myMainCity = city;
        //     } else {
        //         this._mySubCitys.push(city);
        //     }
        // }
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
                let cellId: number = MapUtil.getIdByCellPoint(rBuilds[i].x, rBuilds[i].y);
                buildCellIds.push(cellId);
                if (lastBuildCellIds) {
                    let index: number = lastBuildCellIds.indexOf(cellId);
                    if (index != -1) {
                        //存在就列表中 就代表是已存在的数据
                        if (this._mapBuilds[cellId].equalsServerData(rBuilds[i]) == false) {
                            //代表数据不一样需要刷新
                            this._mapBuilds[cellId] = this.createBuildData(rBuilds[i], cellId, this._mapBuilds[cellId]);
                            updateBuildCellIds.push(cellId);
                        }
                        lastBuildCellIds.splice(index, 1);//移除重复数据
                        continue;
                    }

                }
                //其他情况就是新数据了
                this._mapBuilds[cellId] = this.createBuildData(rBuilds[i], cellId);
                addBuildCellIds.push(cellId);
            }
            if (lastBuildCellIds && lastBuildCellIds.length > 0) {
                //代表有需要删除的数据
                removeBuildCellIds = lastBuildCellIds;
            }
            this._lastBuildCellIds.set(areaId, buildCellIds);
            if (addBuildCellIds.length > 0 || removeBuildCellIds.length > 0 || updateBuildCellIds.length > 0) {
                cc.systemEvent.emit("update_builds", areaId, addBuildCellIds, removeBuildCellIds, updateBuildCellIds);
            }
        }
    }

    public getBuild(id: number): MapBuildData {
        return this._mapBuilds[id];
    }
}