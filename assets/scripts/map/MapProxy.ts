import MapUtil from "./MapUtil";

/**地图基础资源配置*/
export class MapResConfig {
    type: number = 0;
    name: string = "";
    wood: number = 0;
    iron: number = 0;
    stone: number = 0;
    grain: number = 0;
    durable: number = 0;
    defender: number = 0;
}

/**地图资源类型*/
export class MapResType {
    static WOOD: number = 52;
    static IRON: number = 53;
    static STONE: number = 54;
    static GRAIN: number = 53;
}

/**地图资源数据*/
export class MapResData {
    id: number = 0;
    type: number = 0;
    level: number = 0;
    x: number = 0;
    y: number = 0;
}

/**地图城池配置*/
export class MapCityData {
    id: number = 0;
    cityId: number = 0;
    rid: number = 0;
    name: string = "";
    x: number = null;
    y: number = 0;
    isMain: number = 0;
    level: number = 0;
    curDurable: number = 0;
    maxDurable: number = 0;

    public equalsServerData(data: any) {
        if (this.cityId == data.cityId
            && this.rid == data.rid
            && this.name == data.name
            && this.x == data.x
            && this.y == data.y
            && this.isMain == data.is_main
            && this.level == data.level
            && this.curDurable == data.cur_durable
            && this.maxDurable == data.maxDurable) {
            return true;
        }
        return false;
    }
}

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

/**地图区域数据*/
export class MapAreaData {
    static MAX_TIME: number = 30000;
    id: number = 0;
    x: number = 0;
    y: number = 0;
    startCellX: number = 0;
    startCellY:number = 0;
    endCellX:number = 0;
    endCellY:number = 0;
    len: number = 0;
    qryStartTime: number = 0;

    public checkAndUpdateQryTime(): boolean {
        let nowTime: number = Date.now();
        if (nowTime - this.qryStartTime >= MapAreaData.MAX_TIME) {
            this.qryStartTime = nowTime;
            return true
        }
        return false;
    }

    public equals(other: MapAreaData): boolean {
        if (other == null) {
            return false;
        }
        return this.id == other.id;
    }

    public fuzzyEquals(other: MapAreaData, variance: number): boolean {
        if (other == null) {
            return false;
        }
        if (this.x - variance <= other.x && other.x <= this.x + variance) {
            if (this.y - variance <= other.y && other.y <= this.y + variance)
                return true;
        }
        return false;
    }
}

export default class MapProxy {
    public tiledMapAsset: cc.TiledMapAsset = null;
    //当前地图中心点
    protected _curCenterPoint: cc.Vec2 = null;
    //当前展示区域
    protected _curCenterAreaData: MapAreaData = null;
    protected _mapAreaDatas: MapAreaData[] = [];
    protected _mapResDatas: MapResData[] = [];
    protected _mapCitys: MapCityData[] = [];
    protected _mapBuilds: MapBuildData[] = [];
    protected _lastCityCellIds: Map<number, number[]> = new Map<number, number[]>();
    protected _lastBuildCellIds: Map<number, number[]> = new Map<number, number[]>();
    //地图请求列表
    public qryAreaIds: number[] = [];
    //地图基础配置数据
    protected _mapResConfigs: Map<number, MapResConfig> = new Map<number, MapResConfig>();
    protected _myMainCity: MapCityData = null;
    protected _mySubCitys: MapCityData[] = [];

    // 初始化地图配置
    public init(): void {
        this._mapAreaDatas.length = MapUtil.areaCount;
        this._mapBuilds.length = this._mapCitys.length = MapUtil.mapCellCount;
        this._lastCityCellIds.clear();
        this._lastBuildCellIds.clear();
    }

    public clearData(): void {
        this._mapAreaDatas.length = 0;
        this._mapBuilds.length = 0;
        this._mapCitys.length = 0;
        this.qryAreaIds.length = 0;
        this._lastCityCellIds.clear();
        this._lastBuildCellIds.clear();
    }

    public addCityData(cellId: number, data: any): void {
        let cityData: MapCityData = this.createCityData(data, this._mapCitys[cellId]);
        this._mapCitys[cellId] = cityData;
        // this._mapCitys[cellId - 1] = cityData;
        // this._mapCitys[cellId + 1] = cityData;
        // this._mapCitys[cellId - MapUtil.mapSize.width] = cityData;
        // this._mapCitys[cellId - MapUtil.mapSize.width - 1] = cityData;
        // this._mapCitys[cellId - MapUtil.mapSize.width + 1] = cityData;
        // this._mapCitys[cellId + MapUtil.mapSize.width] = cityData;
        // this._mapCitys[cellId + MapUtil.mapSize.width - 1] = cityData;
        // this._mapCitys[cellId + MapUtil.mapSize.width + 1] = cityData;
    }

    public removeCityData(cellId: number): void {
        let cityData: MapCityData = this._mapCitys[cellId];
        if (cityData) {
            this._mapCitys[cellId] = null;
            // this.checkAndRemoveCityCell(cellId - 1, cityData.cityId);
            // this.checkAndRemoveCityCell(cellId + 1, cityData.cityId);
            // this.checkAndRemoveCityCell(cellId - MapUtil.mapSize.width, cityData.cityId);
            // this.checkAndRemoveCityCell(cellId - MapUtil.mapSize.width - 1, cityData.cityId);
            // this.checkAndRemoveCityCell(cellId - MapUtil.mapSize.width + 1, cityData.cityId);
            // this.checkAndRemoveCityCell(cellId + MapUtil.mapSize.width, cityData.cityId);
            // this.checkAndRemoveCityCell(cellId + MapUtil.mapSize.width - 1, cityData.cityId);
            // this.checkAndRemoveCityCell(cellId + MapUtil.mapSize.width + 1, cityData.cityId);
        }
    }

    public checkAndRemoveCityCell(cellId: number, cityId: number): boolean {
        let cityData: MapCityData = this._mapCitys[cellId];
        if (cityData && cityData.cityId == cityId) {
            this._mapCitys[cityId] = null;
            return true;
        }
        return false;
    }

    /**地图建筑基础配置信息*/
    public setNationMapConfig(configList: any[]): void {
        this._mapResConfigs.clear();
        for (let i: number = 0; i < configList.length; i++) {
            let cfg: MapResConfig = new MapResConfig();
            cfg.type = configList[i].type;
            cfg.name = configList[i].name;
            cfg.wood = configList[i].Wood;
            cfg.iron = configList[i].iron;
            cfg.stone = configList[i].stone;
            cfg.grain = configList[i].grain;
            cfg.durable = configList[i].durable;
            cfg.defender = configList[i].defender;
            this._mapResConfigs.set(configList[i].type, cfg);
        }
    }

    protected createCityData(data: any, cityData: MapCityData = null): MapCityData {
        let city: MapCityData = cityData;
        if (cityData == null) {
            city = new MapCityData();
        }
        city.id = MapUtil.getIdByCellPoint(data.x, data.y);
        city.cityId = data.cityId;
        city.rid = data.rid;
        city.name = data.name;
        city.x = data.x;
        city.y = data.y;
        city.isMain = data.is_main;
        city.level = data.level;
        city.curDurable = data.cur_durable;
        city.maxDurable = data.max_durable;
        return city;
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

    /**我的城池信息*/
    public setMyCitys(citys: any[]): void {
        this._mySubCitys.length = 0;
        for (let i: number = 0; i < citys.length; i++) {
            let city: MapCityData = this.createCityData(citys[i]);
            if (city.isMain) {
                this._myMainCity = city;
            } else {
                this._mySubCitys.push(city);
            }
        }
    }

    public initMyCityData(): void {
        // if (this._myMainCity) {
        //     this.addCityData(this._myMainCity);
        // }
        // for (let i: number = 0; i < this._mySubCitys.length; i++) {
        //     this.addCityData(this._mySubCitys[i]);
        // }
        // console.log("initMyCityData", this._mapCitys);
    }

    public initMapResConfig(jsonData: any): void {
        let w: number = jsonData.w;
        let h: number = jsonData.h;
        let list: Array<Array<number>> = jsonData.list;
        this._mapResDatas.length = 0;
        for (let i: number = 0; i < jsonData.list.length; i++) {
            let data: MapResData = new MapResData();
            data.id = i;
            data.type = list[i][0];
            data.level = list[i][1];
            data.x = i % w;
            data.y = Math.floor(i / w);
            this._mapResDatas.push(data);
        }
    }

    /**设置地图当前中心点的信息*/
    public setCurCenterPoint(point: cc.Vec2, pixelPoint: cc.Vec2): boolean {
        if (this._curCenterPoint == null
            || this._curCenterPoint.x != point.x
            || this._curCenterPoint.y != point.y) {
            this._curCenterPoint = point;
            let areaPoint: cc.Vec2 = MapUtil.getAreaPointByCellPoint(point.x, point.y);
            let areaId: number = MapUtil.getIdByAreaPoint(areaPoint.x, areaPoint.y);
            if (this._curCenterAreaData == null || this._curCenterAreaData.id != areaId) {
                //展示区域变化
                let areaData: MapAreaData = this.getMapAreaData(areaId);
                let oldIds: number[] = null;
                let newIds: number[] = MapUtil.get9GridVaildAreaIds(areaData.id);
                let addIds: number[] = [];
                let removeIds: number[] = [];
                let firstAreaIds: number[] = null;
                let otherAreaIds: number[] = [];
                if (this._curCenterAreaData == null || this._curCenterAreaData.fuzzyEquals(areaData, 3) == false) {
                    //全量刷新
                    oldIds = [];
                    addIds = newIds;
                    //计算四个角所在的区域 用于判断需要优先请求的区域
                    let leftTopPixelPoint: cc.Vec2 = pixelPoint.add(cc.v2(-cc.game.canvas.width * 0.5, cc.game.canvas.height * 0.5));
                    let leftDownPixelPoint: cc.Vec2 = pixelPoint.add(cc.v2(-cc.game.canvas.width * 0.5, -cc.game.canvas.height * 0.5));
                    let rightTopPixelPoint: cc.Vec2 = pixelPoint.add(cc.v2(cc.game.canvas.width * 0.5, cc.game.canvas.height * 0.5));
                    let rightDownPixelPoint: cc.Vec2 = pixelPoint.add(cc.v2(cc.game.canvas.width * 0.5, -cc.game.canvas.height * 0.5));
                    firstAreaIds = MapUtil.getVaildAreaIdsByPixelPoints(pixelPoint, leftTopPixelPoint, leftDownPixelPoint, rightTopPixelPoint, rightDownPixelPoint);
                } else {
                    oldIds = MapUtil.get9GridVaildAreaIds(areaData.id);
                    for (let i: number = 0; i < newIds.length; i++) {
                        if (oldIds.indexOf(newIds[i]) == -1) {
                            addIds.push(newIds[i]);
                        }
                    }
                    for (let i: number = 0; i < oldIds.length; i++) {
                        if (newIds.indexOf(oldIds[i]) == -1) {
                            removeIds.push(oldIds[i]);
                        }
                    }
                    //其他情况优先请求中心区域
                    if (addIds.indexOf(areaData.id)) {
                        firstAreaIds = [areaData.id];
                    }
                }

                if (firstAreaIds && firstAreaIds.length > 0) {
                    for (let i: number = 0; i < addIds.length; i++) {
                        if (firstAreaIds.indexOf(addIds[i]) == -1) {
                            otherAreaIds.push(addIds[i]);
                        }
                    }
                } else {
                    otherAreaIds = addIds;
                }

                let qryIndexs: number[] = null;
                if (firstAreaIds && firstAreaIds.length > 0) {
                    qryIndexs = firstAreaIds.concat(otherAreaIds);
                } else {
                    qryIndexs = otherAreaIds;
                }
                this.qryAreaIds = this.qryAreaIds.concat(qryIndexs);

                this._curCenterAreaData = areaData;
                cc.systemEvent.emit("map_show_area_change", point, this._curCenterAreaData, addIds, removeIds);

            }
            return true;
        }
        return false;
    }

    public getCurCenterAreaData(): MapAreaData {
        return this._curCenterAreaData;
    }

    public setMapScanBlock(scanDatas: any, areaId: number = 0): void {
        let rBuilds: any[] = scanDatas.mr_builds;
        let cBuilds: any[] = scanDatas.mc_builds;
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
        if (cBuilds.length > 0) {
            let lastCityCellIds: number[] = null;
            if (this._lastCityCellIds.has(areaId)) {
                lastCityCellIds = this._lastCityCellIds.get(areaId);
            }
            let cityCellIds: number[] = [];
            let addCityCellIds: number[] = [];
            let updateCityCellIds: number[] = [];
            let removeCityCellIds: number[] = [];
            for (let i: number = 0; i < cBuilds.length; i++) {
                let cellId: number = MapUtil.getIdByCellPoint(cBuilds[i].x, cBuilds[i].y);
                cityCellIds.push(cellId);
                if (lastCityCellIds) {
                    let index: number = lastCityCellIds.indexOf(cellId);
                    if (index != -1) {
                        //存在就列表中 就代表是已存在的数据
                        if (this._mapCitys[cellId].equalsServerData(cBuilds[i]) == false) {
                            //代表数据不一样需要刷新
                            this.addCityData(cellId, cBuilds[i]);
                            updateCityCellIds.push(cellId);
                        }
                        lastCityCellIds.splice(index, 1);//移除重复数据
                        continue;
                    }
                }
                //其他情况就是新数据了
                this.addCityData(cellId, cBuilds[i]);
                addCityCellIds.push(cellId);
            }
            if (lastCityCellIds && lastCityCellIds.length > 0) {
                //代表有需要删除的数据
                removeCityCellIds = lastCityCellIds;
            }
            this._lastBuildCellIds.set(areaId, cityCellIds);
            if (addCityCellIds.length > 0 || removeCityCellIds.length > 0 || updateCityCellIds.length > 0) {
                cc.systemEvent.emit("update_citys", areaId, addCityCellIds, removeCityCellIds, updateCityCellIds);
            }
        }
    }

    /**获取地图区域数据*/
    public getMapAreaData(id: number): MapAreaData {
        if (this._mapAreaDatas[id] == undefined) {
            let data: MapAreaData = new MapAreaData();
            data.id = id;
            let point: cc.Vec2 = MapUtil.getAreaPointById(id);
            let startCellPoint: cc.Vec2 = MapUtil.getStartCellPointByAreaPoint(point.x, point.y);
            data.x = point.x;
            data.y = point.y;
            data.startCellX = startCellPoint.x;
            data.startCellY = startCellPoint.y;
            data.endCellX = startCellPoint.x + MapUtil.areaCellSize.width;
            data.endCellY = startCellPoint.y + MapUtil.areaCellSize.width;
            data.len = MapUtil.areaCellSize.width;
            this._mapAreaDatas[id] = data;
            return data;
        }
        return this._mapAreaDatas[id];
    }

    public getResData(id: number): MapResData {
        return this._mapResDatas[id];
    }

    public getCity(id: number): MapCityData {
        return this._mapCitys[id];
    }

    public getBuild(id: number): MapBuildData {
        return this._mapBuilds[id];
    }

    /**根据类型获取配置数据*/
    public getResConfig(type: number): MapResConfig {
        if (this._mapResConfigs.has(type)) {
            return this._mapResConfigs.get(type);
        }
        return null;
    }

    public hasResDatas():boolean {
        return this._mapResDatas.length > 0;
    }

    public hasResConfig():boolean {
        return this._mapResConfigs.size > 0;
    }

    public getMyMainCity(): MapCityData {
        return this._myMainCity;
    }

    public getSubCitys(): MapCityData[] {
        return this._mySubCitys;
    }
}