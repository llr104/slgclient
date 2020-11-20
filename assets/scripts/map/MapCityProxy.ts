import MapUtil from "./MapUtil";

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

export default class MapCityProxy {
    protected _mapCitys: MapCityData[] = [];
    protected _lastCityCellIds: Map<number, number[]> = new Map<number, number[]>();
    protected _myMainCity: MapCityData = null;
    protected _mySubCitys: MapCityData[] = [];

    // 初始化数据
    public initData(): void {
        this._mapCitys.length = MapUtil.mapCellCount;
        this._lastCityCellIds.clear();
    }

    public clearData(): void {
        this._mapCitys.length = 0;
        this._lastCityCellIds.clear();
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

    public setMapScanBlock(scanDatas: any, areaId: number = 0): void {
        let cBuilds: any[] = scanDatas.mc_builds;
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
            this._lastCityCellIds.set(areaId, cityCellIds);
            if (addCityCellIds.length > 0 || removeCityCellIds.length > 0 || updateCityCellIds.length > 0) {
                cc.systemEvent.emit("update_citys", areaId, addCityCellIds, removeCityCellIds, updateCityCellIds);
            }
        }
    }

    public getCity(id: number): MapCityData {
        return this._mapCitys[id];
    }

    public getMyMainCity(): MapCityData {
        return this._myMainCity;
    }

    public getSubCitys(): MapCityData[] {
        return this._mySubCitys;
    }

    public getMyPlayerId(): number {
        if (this._myMainCity) {
            return this._myMainCity.rid;
        }
        return 0;
    }
}