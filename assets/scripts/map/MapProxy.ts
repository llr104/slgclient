import { _decorator, TiledMapAsset, Vec2, game, view } from 'cc';
import MapUtil from "./MapUtil";
import { EventMgr } from '../utils/EventMgr';


export class MapResConfig {
    type: number = 0;
    level: number = 0;
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
    static SYS_FORTRESS: number = 50;   //系统要塞
    static SYS_CITY: number = 51;
    static WOOD: number = 52;
    static IRON: number = 53;
    static STONE: number = 54;
    static GRAIN: number = 55;
    static FORTRESS: number = 56; //要塞
    
}

/**地图资源数据*/
export class MapResData {
    id: number = 0;
    type: number = 0;
    level: number = 0;
    x: number = 0;
    y: number = 0;
}



export class MapTagPos {
    x: number = 0;
    y: number = 0;
    name: string = "";
}

/**地图区域数据*/
export class MapAreaData {
    static MAX_TIME: number = 10000;
    id: number = 0;
    x: number = 0;
    y: number = 0;
    startCellX: number = 0;
    startCellY: number = 0;
    endCellX: number = 0;
    endCellY: number = 0;
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
    public warFree:number = 0; //免战时间
    public tiledMapAsset: TiledMapAsset = null;
    //当前地图中心点
    protected _curCenterPoint: Vec2 = null;
    //当前展示区域
    protected _curCenterAreaId: number = -1;
    protected _mapAreaDatas: MapAreaData[] = [];
    protected _mapResDatas: MapResData[] = [];
    protected _mapSysCityResDatas: MapResData[] = [];
    protected _mapPosTags: MapTagPos[] = [];

    //地图请求列表
    public qryAreaIds: number[] = [];
    //地图基础配置数据
    protected _mapResConfigs: Map<string, MapResConfig> = new Map<string, MapResConfig>();

    // 初始化地图配置
    public initData(): void {
        this._mapAreaDatas.length = MapUtil.areaCount;
    }

    public clearData(): void {
        this._curCenterPoint = null;
        this._curCenterAreaId = -1;
        this._mapAreaDatas.length = 0;
        this.qryAreaIds.length = 0;
    }

    /**地图建筑基础配置信息*/
    public setNationMapConfig(configList: any[]): void {
        this._mapResConfigs.clear();
        for (let i: number = 0; i < configList.length; i++) {
            let cfg: MapResConfig = new MapResConfig();
            cfg.type = configList[i].type;
            cfg.level = configList[i].level;
            cfg.name = configList[i].name;
            cfg.wood = configList[i].Wood;
            cfg.iron = configList[i].iron;
            cfg.stone = configList[i].stone;
            cfg.grain = configList[i].grain;
            cfg.durable = configList[i].durable;
            cfg.defender = configList[i].defender;
            this._mapResConfigs.set(configList[i].type + "_" + cfg.level, cfg);
        }
    }

    public setWarFree(time) {
        this.warFree = time;
    }

    public getWarFree(): number{
        return this.warFree*1000
    }

    public initMapResConfig(jsonData: any): void {
        let w: number = jsonData.w;
        let list: Array<Array<number>> = jsonData.list;
        this._mapResDatas = [];
        this._mapSysCityResDatas = [];
        for (let i: number = 0; i < jsonData.list.length; i++) {
            let data: MapResData = new MapResData();
            data.id = i;
            data.type = list[i][0];
            data.level = list[i][1];
            data.x = i % w;
            data.y = Math.floor(i / w);
            this._mapResDatas.push(data);

            if(data.type == MapResType.SYS_CITY){
                this._mapSysCityResDatas.push(data)
            }
        }
    }


    public getSysCityResData(x, y): MapResData{
        for (let index = 0; index < this._mapSysCityResDatas.length; index++) {
            
            var resData = this._mapSysCityResDatas[index];
            var level = resData.level;
            var dis = 0;
            if(level >= 8){
                dis = 3;
            }else if(level >= 5){
                dis = 2;
            }else {
                dis = 1;
            }

            if( dis >= Math.abs(x-resData.x) && dis >= Math.abs(y-resData.y)){
                return resData;
            }
        }
        return null;
    }



    /**设置地图当前中心点的信息*/
    public setCurCenterPoint(point: Vec2, pixelPoint: Vec2): boolean {
        if (this._curCenterPoint == null
            || this._curCenterPoint.x != point.x
            || this._curCenterPoint.y != point.y) {
            this._curCenterPoint = point;
            let areaPoint: Vec2 = MapUtil.getAreaPointByCellPoint(point.x, point.y);
            let areaId: number = MapUtil.getIdByAreaPoint(areaPoint.x, areaPoint.y);

            EventMgr.emit("map_center_change", this._curCenterPoint);
            if (this._curCenterAreaId == -1 || this._curCenterAreaId != areaId) {
                //展示区域变化
                let areaData: MapAreaData = this.getMapAreaData(areaId);
                let oldIds: number[] = null;
                let newIds: number[] = MapUtil.get9GridVaildAreaIds(areaData.id);
                let addIds: number[] = [];
                let removeIds: number[] = [];
                let firstAreaIds: number[] = null;
                let otherAreaIds: number[] = [];
                if (this._curCenterAreaId == -1
                    || this.getMapAreaData(this._curCenterAreaId).fuzzyEquals(areaData, 3) == false) {
                    //全量刷新
                    oldIds = [];
                    addIds = newIds;
                    //计算四个角所在的区域 用于判断需要优先请求的区域
                    let temp = pixelPoint.clone();
                    let leftTopPixelPoint: Vec2 = temp.add(new Vec2(-view.getVisibleSize().width * 0.5, view.getVisibleSize().height * 0.5));
                    temp = pixelPoint.clone();

                    let leftDownPixelPoint: Vec2 = temp.add(new Vec2(-view.getVisibleSize().width * 0.5, -view.getVisibleSize().height * 0.5));
                    temp = pixelPoint.clone();

                    let rightTopPixelPoint: Vec2 = temp.add(new Vec2(view.getVisibleSize().width * 0.5, view.getVisibleSize().height * 0.5));
                    temp = pixelPoint.clone();

                    let rightDownPixelPoint: Vec2 = temp.add(new Vec2(view.getVisibleSize().width * 0.5, -view.getVisibleSize().height * 0.5));
                    temp = pixelPoint.clone();

                    firstAreaIds = MapUtil.getVaildAreaIdsByPixelPoints(temp, leftTopPixelPoint, leftDownPixelPoint, rightTopPixelPoint, rightDownPixelPoint);
                } else {
                    oldIds = MapUtil.get9GridVaildAreaIds(this._curCenterAreaId);
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
                // this.qryAreaIds = [18];

                this._curCenterAreaId = areaId;
                EventMgr.emit("map_show_area_change", point, this._curCenterAreaId, addIds, removeIds);
            }
            return true;
        }
        return false;
    }

    public getCurCenterPoint():Vec2 {
        return this._curCenterPoint;
    }

    public getCurCenterAreaId(): number {
        return this._curCenterAreaId;
    }

    /**获取地图区域数据*/
    public getMapAreaData(id: number): MapAreaData {
        if (this._mapAreaDatas[id] == undefined) {
            let data: MapAreaData = new MapAreaData();
            data.id = id;
            let point: Vec2 = MapUtil.getAreaPointById(id);
            let startCellPoint: Vec2 = MapUtil.getStartCellPointByAreaPoint(point.x, point.y);
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

    /*获取产量描述**/
    public getResYieldDesList(cfg: MapResConfig): string[] {
        let list: string[] = [];
        if (cfg.grain > 0) {
            list.push("粮食 +" + cfg.grain + "/小时");
        }
        if (cfg.wood > 0) {
            list.push("木材 +" + cfg.wood + "/小时");
        }
        if (cfg.iron > 0) {
            list.push("铁矿 +" + cfg.iron + "/小时");
        }
        if (cfg.stone > 0) {
            list.push("石料 +" + cfg.stone + "/小时");
        }
        return list;
    }

    public getResData(id: number): MapResData {
        return this._mapResDatas[id];
    }

    /**根据类型获取配置数据*/
    public getResConfig(type: number, level: number): MapResConfig {
        let key: string = type + "_" + level;
        if (this._mapResConfigs.has(key)) {
            return this._mapResConfigs.get(key);
        }
        return null;
    }

    public hasResDatas(): boolean {
        return this._mapResDatas.length > 0;
    }

    public hasResConfig(): boolean {
        return this._mapResConfigs.size > 0;
    }

    public updateMapPosTags(posTag: any) {
        this._mapPosTags = [];
        posTag.forEach(data => {
            var tag = new MapTagPos();
            tag.x = data.x;
            tag.y = data.y;
            tag.name = data.name;

            this._mapPosTags.push(tag);
        });
    }

    public removeMapPosTag(x: number, y:number) {
        var tags: MapTagPos[] = [];
        this._mapPosTags.forEach(tag => {
            if(tag.x != x || y != tag.y){
                tags.push(tag);
            }
        });

        this._mapPosTags = tags;
    }

    public addMapPosTag(x: number, y:number, name:string) {
        var tag = new MapTagPos();
        tag.x = x;
        tag.y = y;
        tag.name = name;

        var ok = true;
        this._mapPosTags.forEach(tag => {
            if (tag.x == x && tag.y == y){
                ok = false;
            }
        });

        if (ok){
            this._mapPosTags.push(tag);
        }
       
    }

    public isPosTag(x: number, y:number):boolean {
        var ret = false;
        for (let index = 0; index < this._mapPosTags.length; index++) {
            const tag = this._mapPosTags[index];
            if (tag.x == x && tag.y == y){
                ret = true;
                break;
            }
        }
       
        return ret;
    }

    public getPosTags() :MapTagPos[]{
        return this._mapPosTags;
    }
}
