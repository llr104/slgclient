import { _decorator } from 'cc';
import MapUtil from "./MapUtil";
import { EventMgr } from '../utils/EventMgr';


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
    unionId:number = 0;
    parentId:number = 0;
    unionName:string = "";
    occupyTime:number;

    public equalsServerData(data: any) {
        if (this.cityId == data.cityId
            && this.rid == data.rid
            && this.name == data.name
            && this.x == data.x
            && this.y == data.y
            && this.isMain == data.is_main
            && this.level == data.level
            && this.curDurable == data.cur_durable
            && this.maxDurable == data.maxDurable
            && this.unionId == data.union_id
            && this.parentId == data.parent_id 
            && this.unionName == data.union_name
            && this.occupyTime == data.occupy_time) {
            return true;
        }
        return false;
    }

    public static createCityData(data: any, id: number, cityData: MapCityData = null): MapCityData {
        let city: MapCityData = cityData;
        if (cityData == null) {
            city = new MapCityData();
        }
        city.id = id;
        city.cityId = data.cityId;
        city.rid = data.rid;
        city.name = data.name;
        city.x = data.x;
        city.y = data.y;
        city.isMain = data.is_main;
        city.level = data.level;
        city.curDurable = data.cur_durable;
        city.maxDurable = data.max_durable;
        city.unionId = data.union_id;
        city.parentId = data.parent_id;
        city.unionName = data.union_name;
        city.occupyTime = data.occupy_time;
        return city;
    }

    public getCellRadius() :number {
        return 2;
    }
}

export default class MapCityProxy {
    protected _mapCitys: MapCityData[] = [];
    protected _lastCityCellIds: Map<number, number[]> = new Map<number, number[]>();
    protected _myCitys: MapCityData[] = [];
    public myId: number = 0;
    public myUnionId: number = 0;
    public myParentId: number = 0;

    // 初始化数据
    public initData(): void {
        this._mapCitys.length = MapUtil.mapCellCount;
        this._lastCityCellIds.clear();
        this.updateMyCityIds();
    }

    public clearData(): void {
        this._mapCitys.length = 0;
        this._lastCityCellIds.clear();
    }

    public addCityData(data: any, cellId: number): void {
        let cityData: MapCityData = MapCityData.createCityData(data, cellId, this._mapCitys[cellId]);
        this._mapCitys[cellId] = cityData;
        this._mapCitys[cellId - 1] = cityData;
        this._mapCitys[cellId + 1] = cityData;
        this._mapCitys[cellId - MapUtil.mapSize.width] = cityData;
        this._mapCitys[cellId - MapUtil.mapSize.width - 1] = cityData;
        this._mapCitys[cellId - MapUtil.mapSize.width + 1] = cityData;
        this._mapCitys[cellId + MapUtil.mapSize.width] = cityData;
        this._mapCitys[cellId + MapUtil.mapSize.width - 1] = cityData;
        this._mapCitys[cellId + MapUtil.mapSize.width + 1] = cityData;
    }

    public removeCityData(cellId: number): void {
        let cityData: MapCityData = this._mapCitys[cellId];
        if (cityData) {
            this._mapCitys[cellId] = null;
            this.checkAndRemoveCityCell(cellId - 1, cityData.cityId);
            this.checkAndRemoveCityCell(cellId + 1, cityData.cityId);
            this.checkAndRemoveCityCell(cellId - MapUtil.mapSize.width, cityData.cityId);
            this.checkAndRemoveCityCell(cellId - MapUtil.mapSize.width - 1, cityData.cityId);
            this.checkAndRemoveCityCell(cellId - MapUtil.mapSize.width + 1, cityData.cityId);
            this.checkAndRemoveCityCell(cellId + MapUtil.mapSize.width, cityData.cityId);
            this.checkAndRemoveCityCell(cellId + MapUtil.mapSize.width - 1, cityData.cityId);
            this.checkAndRemoveCityCell(cellId + MapUtil.mapSize.width + 1, cityData.cityId);
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

    /**我的建筑信息*/
    public initMyCitys(citys: any[]): void {
        this._myCitys.length = 0;
        for (let i: number = 0; i < citys.length; i++) {
            let id: number = MapUtil.getIdByCellPoint(citys[i].x, citys[i].y);
            let city: MapCityData = MapCityData.createCityData(citys[i], id);
            if (city.isMain) {
                this._myCitys.unshift(city);
            } else {
                this._myCitys.push(city);
            }
        }
    }

    /**更新建筑id*/
    public updateMyCityIds(): void {
        for (let i: number = 0; i < this._myCitys.length; i++) {
            let id: number = MapUtil.getIdByCellPoint(this._myCitys[i].x, this._myCitys[i].y);
            this._myCitys[i].id = id;
            this._mapCitys[id] = this._myCitys[i];
        }

    }

    /**更新建筑*/
    public updateCity(city: any): MapCityData {
        let id: number = MapUtil.getIdByCellPoint(city.x, city.y);
        let cityData: MapCityData = null;
        if (this._mapCitys[id] == null) {
            //代表是新增
            cityData = MapCityData.createCityData(city, id);
            this._mapCitys[id] = cityData;
            if (city.rid == this.myId) {
                this._myCitys.push(cityData);
                this.myUnionId = cityData.unionId
                this.myParentId = cityData.parentId
            }
        } else {
            cityData = MapCityData.createCityData(city, id, this._mapCitys[id]);
            if (city.rid == this.myId) {
                this.myUnionId = cityData.unionId
                this.myParentId = cityData.parentId
            }
        }
        return cityData;
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
                let areaIndex: number = MapUtil.getAreaIdByCellPoint(cBuilds[i].x, cBuilds[i].y);
                if (areaIndex != areaId) {
                    //代表服务端给过来的数据不在当前区域
                    continue;
                }
                let cellId: number = MapUtil.getIdByCellPoint(cBuilds[i].x, cBuilds[i].y);
                cityCellIds.push(cellId);
                if (lastCityCellIds) {
                    let index: number = lastCityCellIds.indexOf(cellId);
                    if (index != -1) {
                        //存在就列表中 就代表是已存在的数据
                        if (this._mapCitys[cellId].equalsServerData(cBuilds[i]) == false) {
                            //代表数据不一样需要刷新
                            this.addCityData(cBuilds[i], cellId);
                            updateCityCellIds.push(cellId);
                        }
                        lastCityCellIds.splice(index, 1);//移除重复数据
                        continue;
                    }
                }
                //其他情况就是新数据了
                this.addCityData(cBuilds[i], cellId);
                addCityCellIds.push(cellId);
            }
            if (lastCityCellIds && lastCityCellIds.length > 0) {
                //代表有需要删除的数据
                removeCityCellIds = lastCityCellIds;
                for (let i: number = 0; i < removeCityCellIds.length; i++) {
                    this.removeCityData(removeCityCellIds[i]);
                }
            }
            this._lastCityCellIds.set(areaId, cityCellIds);
            if (addCityCellIds.length > 0 || removeCityCellIds.length > 0 || updateCityCellIds.length > 0) {
                EventMgr.emit("update_citys", areaId, addCityCellIds, removeCityCellIds, updateCityCellIds);
            }
        }
    }

    public getCity(id: number): MapCityData {
        return this._mapCitys[id];
    }

    public getMyMainCity(): MapCityData {
        if (this._myCitys.length > 0) {
            return this._myCitys[0];
        }
        return null;
    }

    public isMyCity(cityId: number): boolean {
        return this.getMyCityById(cityId) != null;
    }

    public getMyCityById(cityId: number): MapCityData {
        for (let i: number = 0; i < this._myCitys.length; i++) {
            if (this._myCitys[i].cityId == cityId) {
                return this._myCitys[i];
            }
        }
        return null;
    }

    public getMyCitys(): MapCityData[] {
        return this._myCitys;
    }

    public getMyPlayerId(): number {
        if (this._myCitys.length > 0) {
            return this._myCitys[0].rid;
        }
        return 0;
    }
}
