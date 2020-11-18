export class MapResType {
    static WOOD: number = 52;
    static IRON: number = 53;
    static STONE: number = 54;
    static GRAIN: number = 53;
}


export class MapResData {
    id: number = 0;
    type: number = 0;
    level: number = 0;
    x: number = 0;
    y: number = 0;
}

/**地图基础配置*/
export class MapConfig {
    type: number = 0;
    name: string = "";
    wood: number = 0;
    iron: number = 0;
    stone: number = 0;
    grain: number = 0;
    durable: number = 0;
    defender: number = 0;
}

export enum MapBuildType {
    NONE,//没有建筑
    CITY,
    CITYSIDE, //城池占用位置 但是不是城池的中心坐标
    RES//资源建筑只有一格 所以没有边界类型
}

/**地图城池配置*/
export class MapCityData {
    cityId: number = 0;
    rid: number = 0;
    name: string = "";
    x: number = null;
    y: number = 0;
    isMain: number = 0;
    level: number = 0;
    curDurable: number = 0;
    maxDurable: number = 0;
}

export class MapBuildData {
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
}

export class MapAreaData {
    static MAX_TIME: number = 30000;
    index: number = 0;
    startX: number = 0;
    startY: number = 0;
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
}

/**地图展示区域*/
export class MapAreaRectData {
    static areaSize: cc.Size = null;
    static maxIndex: number = 0;

    public static isVaildArea(index: number): boolean {
        if (index >= 0 && index < this.maxIndex) {
            return true;
        }
        return false;
    }

    public static getIndexByPoint(point: cc.Vec2): number {
        return point.x + point.y * this.areaSize.width;
    }

    public static getPointByIndex(index: number): cc.Vec2 {
        return cc.v2(index % this.areaSize.width, Math.floor(index / this.areaSize.width));
    }

    centerPoint: cc.Vec2 = null;

    leftTopIndex: number = 0;
    leftIndex: number = 0;
    leftDownIndex: number = 0;
    centerTopIndex: number = 0;
    centerIndex: number = 0;
    centerDownIndex: number = 0;
    rightTopIndex: number = 0;
    rightIndex: number = 0;
    rightDownIndex: number = 0;

    //变化的区域
    addIndexs: number[] = [];
    removeIndexs: number[] = [];
    isChangeAll: boolean = false;

    public setCenterAreaPoint(point: cc.Vec2): boolean {
        if (this.centerPoint == null || this.centerPoint.equals(point) == false) {
            this.addIndexs.length = 0;
            this.removeIndexs.length = 0;
            let oldCenterPoint: cc.Vec2 = this.centerPoint;
            let oldArray: number[] = this.toVaildArray();

            this.centerPoint = point;
            this.centerIndex = MapAreaRectData.getIndexByPoint(point);
            this.leftIndex = this.centerIndex - 1;
            this.rightIndex = this.centerIndex + 1;
            this.centerTopIndex = this.centerIndex + MapAreaRectData.areaSize.width;
            this.leftTopIndex = this.centerTopIndex - 1;
            this.rightTopIndex = this.centerTopIndex + 1;
            this.centerDownIndex = this.centerIndex - MapAreaRectData.areaSize.width;
            this.leftDownIndex = this.centerDownIndex - 1;
            this.rightDownIndex = this.centerDownIndex + 1;

            let newArray: number[] = this.toVaildArray();
            if (oldCenterPoint == null || this.centerPoint.fuzzyEquals(oldCenterPoint, 3) == false) {
                //代表初始化或者间隔超过一个九宫格位置 需要做全量刷新
                this.isChangeAll = true;
                this.addIndexs = newArray;
            } else {
                this.isChangeAll = false;
                for (let i: number = 0; i < newArray.length; i++) {
                    if (oldArray.indexOf(newArray[i]) == -1) {
                        this.addIndexs.push(newArray[i]);
                    }
                }
                for (let i: number = 0; i < oldArray.length; i++) {
                    if (newArray.indexOf(oldArray[i]) == -1) {
                        this.removeIndexs.push(oldArray[i]);
                    }
                }
            }
            return true;
        }
        return false;
    }

    public equals(rect: MapAreaRectData): boolean {
        if (rect == null) {
            return false;
        }
        if (this.leftTopIndex == rect.leftTopIndex) {
            return true;
        }
        return false;
    }

    public toArray(): number[] {
        return [
            this.leftTopIndex, this.centerTopIndex, this.rightTopIndex,
            this.leftIndex, this.centerIndex, this.rightIndex,
            this.leftDownIndex, this.centerDownIndex, this.rightDownIndex
        ];
    }

    public toVaildArray(): number[] {
        let list: number[] = [];
        let totalList: number[] = this.toArray();
        for (let i: number = 0; i < totalList.length; i++) {
            if (MapAreaRectData.isVaildArea(totalList[i])) {
                list.push(totalList[i]);
            }
        }
        return list;
    }

    public clone(data: MapAreaRectData): MapAreaRectData {
        let rect: MapAreaRectData = data;
        if (data == null) {
            rect = new MapAreaRectData();
        }
        rect.leftTopIndex = this.leftTopIndex;
        rect.leftIndex = this.leftIndex;
        rect.leftDownIndex = this.leftDownIndex;
        rect.centerTopIndex = this.centerTopIndex;
        rect.centerIndex = this.centerIndex;
        rect.centerDownIndex = this.centerDownIndex;
        rect.rightTopIndex = this.rightTopIndex;
        rect.rightIndex = this.rightIndex;
        rect.rightDownIndex = this.rightDownIndex;
        return rect;
    }
}

export default class MapProxy {
    public tiledMapAsset: cc.TiledMapAsset = null;
    //地图像素大小
    protected _mapPixelSize: cc.Size = null;
    //地图锚点偏移量
    protected _mapOffsetPoint: cc.Vec2 = null;
    //格子大小
    protected _tileSize: cc.Size = cc.size(256, 128);;
    //地图大小 宽高需要相同
    protected _mapSize: cc.Size = cc.size(20, 20);
    //地图 (0, 0)点对应的像素坐标
    protected _zeroPixelPoint: cc.Vec2 = cc.v2(0, 0);
    //划分区域的格子大小
    protected _areaCellSize: cc.Size = null;
    //当前地图中心点
    protected _curCenterPoint: cc.Vec2 = null;
    //当前展示区域
    protected _curCenterAreaPoint: cc.Vec2 = null;
    protected _curShowAreaData: MapAreaRectData = new MapAreaRectData();
    protected _mapAreaDatas: MapAreaData[] = null;
    protected _mapCityIdsForPos: Array<Array<number>> = null;
    protected _mapCityIdsForArea: Array<Array<number>> = null;
    protected _mapResList: Array<Array<MapResData>> = null;
    protected _mapCitys: Map<number, MapCityData> = null;
    protected _mapBuilds: Map<string, MapBuildData> = null;
    //地图请求列表
    public qryMapAreaList: number[] = [];
    //地图基础配置数据
    protected _mapConfig: { [key: number]: MapConfig } = null;
    protected _myMainCity: MapCityData = null;
    protected _mySubCitys: MapCityData[] = [];

    // 初始化地图配置
    public initMapConfig(map: cc.TiledMap): void {
        this._mapPixelSize = cc.size(map.node.width, map.node.height);
        this._mapOffsetPoint = cc.v2(map.node.width * map.node.anchorX, map.node.height * map.node.anchorY);
        this._tileSize = map.getTileSize();
        this._mapSize = map.getMapSize();
        this._mapPixelSize = cc.size(map.node.width, map.node.height);
        this._zeroPixelPoint.x = this._mapSize.width * this._tileSize.width * 0.5;
        this._zeroPixelPoint.y = this._mapSize.height * this._tileSize.height - this._tileSize.height * 0.5;

        //划分区域的大小
        let showH: number = Math.min(Math.ceil(cc.game.canvas.height / this._tileSize.height / 2) * 2 + 2, this._mapSize.height);
        this._areaCellSize = cc.size(showH, showH);
        MapAreaRectData.areaSize = cc.size(Math.ceil(this._mapSize.width / showH), Math.ceil(this._mapSize.height / showH));
        MapAreaRectData.maxIndex = MapAreaRectData.areaSize.width * MapAreaRectData.areaSize.height;
        this._mapAreaDatas = new Array(MapAreaRectData.maxIndex);
        this._mapCityIdsForPos = new Array(this._mapSize.width);
        this._mapCityIdsForArea = new Array(MapAreaRectData.maxIndex);
        this._mapCitys = new Map<number, MapCityData>();
        this._mapBuilds = new Map<string, MapBuildData>();

        console.log("initMapConfig", this._areaCellSize, MapAreaRectData.areaSize, MapAreaRectData.maxIndex);
    }

    public get mapPixcelSize(): cc.Size {
        return this._mapPixelSize;
    }

    //是否是有效的格子
    public isVaildCellPoint(point: cc.Vec2): boolean {
        if (point.x >= 0 && point.x < this._mapSize.width
            && point.y >= 0 && point.y < this._mapSize.height) {
            return true;
        }
        return false;
    }

    // 世界像素坐标转地图坐标
    public worldPixelToMapCellPoint(point: cc.Vec2): cc.Vec2 {
        //  转换原理 
        //  tiledMap 45度地图是已上方为(0,0)点 以左上方边界为y轴 右上方边界为x轴的坐标系
        //  所以只需要将点击坐标点的平行映射到地图坐标系的边界上 求解出映射点的像素坐标 / 格子大小 即可计算出对饮的 格子坐标
        let row: number = Math.floor(1.5 * this._mapSize.width - point.x / this._tileSize.width - point.y / this._tileSize.height);
        let col: number = Math.floor(0.5 * this._mapSize.height + point.x / this._tileSize.width - point.y / this._tileSize.height);
        return cc.v2(col, row);
    }

    //地图坐标(格子的中心点)转世界像素坐标
    public mapCellToWorldPixelPoint(point: cc.Vec2): cc.Vec2 {
        let pixelX: number = this._zeroPixelPoint.x - (point.y - point.x) * this._tileSize.width * 0.5;
        let pixelY: number = this._zeroPixelPoint.y - (point.x + point.y) * this._tileSize.height * 0.5;
        return cc.v2(pixelX, pixelY);
    }

    // 地图坐标转地图像素坐标
    public mapCellToPixelPoint(point: cc.Vec2): cc.Vec2 {
        let worldPoint: cc.Vec2 = this.mapCellToWorldPixelPoint(point);
        return worldPoint.sub(this._mapOffsetPoint);
    }

    //地图像素转地图坐标
    public mapPixelToCellPoint(point: cc.Vec2): cc.Vec2 {
        let worldPoint: cc.Vec2 = point.add(this._mapOffsetPoint);
        return this.worldPixelToMapCellPoint(worldPoint);
    }

    /**获取地图区域数据*/
    public getMapAreaData(areaIndex: number): MapAreaData {
        if (this._mapAreaDatas[areaIndex] == undefined) {
            let data: MapAreaData = new MapAreaData();
            let startPoint: cc.Vec2 = this.getStartCellPointByAreaIndex(areaIndex);
            data.index = areaIndex;
            data.startX = startPoint.x;
            data.startY = startPoint.y;
            data.len = this._areaCellSize.width;
            this._mapAreaDatas[areaIndex] = data;
            return data;
        }
        return this._mapAreaDatas[areaIndex];
    }

    /**获取地图区域建筑id数据*/
    public getMapCityIdForPos(x: number, y: number): number {
        if (this._mapCityIdsForPos[x] == undefined) {
            this._mapCityIdsForPos[x] = new Array(this._mapSize.width);
        }
        return this._mapCityIdsForPos[x][y];
    }

    public setMapCityIdForPos(x: number, y: number, data: number): void {
        if (this._mapCityIdsForPos[x] == undefined) {
            this._mapCityIdsForPos[x] = new Array(this._mapSize.width);
        }
        this._mapCityIdsForPos[x][y] = data;
    }

    public updateMyCityIdsForPos(x: number, y: number, data: number): void {
        this.setMapCityIdForPos(x, y, data);
        this.setMapCityIdForPos(x, y - 1, data);
        this.setMapCityIdForPos(x, y + 1, data);
        this.setMapCityIdForPos(x - 1, y, data);
        this.setMapCityIdForPos(x - 1, y - 1, data);
        this.setMapCityIdForPos(x - 1, y + 1, data);
        this.setMapCityIdForPos(x + 1, y, data);
        this.setMapCityIdForPos(x + 1, y - 1, data);
        this.setMapCityIdForPos(x + 1, y + 1, data);
    }

    /**获取地图区域建筑id数据*/
    public getMapCityIdsForArea(areaIndex: number): number[] {
        if (this._mapCityIdsForArea[areaIndex] == undefined) {
            this._mapCityIdsForArea[areaIndex] = [];
        }
        return this._mapCityIdsForArea[areaIndex];
    }

    public setMapCityIdsForArea(areaIndex: number, datas: number[]): void {
        this._mapCityIdsForArea[areaIndex] = datas;
    }

    public getMapCitys(): Map<number, MapCityData> {
        return this._mapCitys;
    }

    public getCity(cityId: number): MapCityData {
        if (this._mapCitys.has(cityId)) {
            return this._mapCitys.get(cityId);
        }
        return null;
    }

    public getMapAreaBuilds(areaIndex: number): Map<string, MapBuildData> {
        if (this._mapBuilds[areaIndex] == undefined) {
            let data: Map<string, MapBuildData> = new Map<string, MapBuildData>();
            this._mapBuilds[areaIndex] = data;
            return data;
        }
        return this._mapBuilds[areaIndex];
    }


    public addCityData(data: MapCityData): void {
        this._mapCitys.set(data.cityId, data);
        this.updateMyCityIdsForPos(data.x, data.y, data.cityId);
    }

    public updateCityData(data: any): void {
        if (this._mapCitys.has(data.cityId)) {
            let cityData: MapCityData = this._mapCitys.get(data.cityId);
            cityData.rid = data.rid;
            cityData.name = data.name;
            cityData.isMain = data.is_main;
            cityData.level = data.level;
            cityData.curDurable = data.cur_durable;
            cityData.maxDurable = data.max_durable;
            if (cityData.x != data.x || cityData.y != data.y) {
                //代表位置改变 重置旧位置数据
                this.updateMyCityIdsForPos(cityData.x, cityData.y, 0);
                cityData.x = data.x;
                cityData.y = data.y;
                this.updateMyCityIdsForPos(cityData.x, cityData.y, cityData.cityId);
            }
        }
    }

    public removeCityData(cityId: number): void {
        if (this._mapCitys.has(cityId)) {
            let cityData: MapCityData = this._mapCitys.get(cityId);
            this.updateMyCityIdsForPos(cityData.x, cityData.y, 0);
            this._mapCitys.delete(cityId);
        }
    }

    public setBuildData(data: MapBuildData, index: number = -1, builds: Map<string, MapBuildData> = null): void {
        let areaIndex: number = index;
        if (index == -1) {
            areaIndex = this.getAreaIndexByCellPoint(cc.v2(data.x, data.y));
        }
        let mapBuilds: Map<string, MapBuildData> = builds;
        if (mapBuilds == null) {
            mapBuilds = this.getMapAreaBuilds(areaIndex);
        }
        mapBuilds.set(data.x + "_" + data.y, data);
    }

    /**地图建筑基础配置信息*/
    public setNationMapConfig(configList: any[]): void {
        this._mapConfig = {};
        for (let i: number = 0; i < configList.length; i++) {
            let cfg: MapConfig = new MapConfig();
            cfg.type = configList[i].type;
            cfg.name = configList[i].name;
            cfg.wood = configList[i].Wood;
            cfg.iron = configList[i].iron;
            cfg.stone = configList[i].stone;
            cfg.grain = configList[i].grain;
            cfg.durable = configList[i].durable;
            cfg.defender = configList[i].defender;
            this._mapConfig[configList[i].type] = cfg;
        }
        // console.log("setNationMapConfig", this._mapConfig);
    }

    protected createCityData(data: any): MapCityData {
        let city: MapCityData = new MapCityData();
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

    protected createBuildData(data: any): MapBuildData {
        let build: MapBuildData = new MapBuildData();
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
        this._mapResList = new Array<Array<MapResData>>(w);
        for (let x: number = 0; x < w; x++) {
            this._mapResList[x] = [];
            for (let y: number = 0; y < h; y++) {
                let index = x + y * w;
                let data: MapResData = new MapResData();
                data.id = index;
                data.type = list[index][0];
                data.level = list[index][1];
                data.x = x;
                data.y = y;

                this._mapResList[x].push(data);
            }
        }
    }

    public getMapResList(): Array<Array<MapResData>> {
        return this._mapResList;
    }

    public getAreaPointByCellPoint(point: cc.Vec2): cc.Vec2 {
        return cc.v2(Math.floor(point.x / this._areaCellSize.width), Math.floor(point.y / this._areaCellSize.height));
    }

    public getAreaPointByPixelPoint(point: cc.Vec2): cc.Vec2 {
        let cellPoint: cc.Vec2 = this.mapPixelToCellPoint(point);
        return this.getAreaPointByCellPoint(cellPoint);
    }

    public getAreaIndexByCellPoint(point: cc.Vec2): number {
        return MapAreaRectData.getIndexByPoint(this.getAreaPointByCellPoint(point));
    }

    public getAreaIndexByPixelPoint(point: cc.Vec2): number {
        return MapAreaRectData.getIndexByPoint(this.getAreaPointByPixelPoint(point));
    }

    public getVaildAreaListByPixelPoints(...points: cc.Vec2[]): number[] {
        let list: number[] = [];
        for (let i: number = 0; i < points.length; i++) {
            let index: number = this.getAreaIndexByPixelPoint(points[i]);
            if (MapAreaRectData.isVaildArea(index)
                && list.indexOf(index) == -1) {
                list.push(index);
            }
        }
        return list;
    }

    public getStartCellPointByAreaIndex(index: number): cc.Vec2 {
        let areaPoint: cc.Vec2 = MapAreaRectData.getPointByIndex(index);
        return cc.v2(areaPoint.x * this._areaCellSize.width, areaPoint.y * this._areaCellSize.height);
    }

    /**设置地图当前中心点的信息*/
    public setCurCenterPoint(point: cc.Vec2, pixelPoint: cc.Vec2): boolean {
        if (this._curCenterPoint == null
            || this._curCenterPoint.x != point.x
            || this._curCenterPoint.y != point.y) {
            this._curCenterPoint = point;
            this._curCenterAreaPoint = this.getAreaPointByCellPoint(point);
            if (this._curShowAreaData.setCenterAreaPoint(this._curCenterAreaPoint)) {
                //展示区域变化

                let firstAreaIndexs: number[] = null;
                if (this._curShowAreaData.isChangeAll) {
                    this.qryMapAreaList.length = 0;//全量刷新就可以舍弃旧的尚未请求的数据
                    //全量刷新 需要计算四个角所在的区域 用于判断需要优先请求的区域
                    let leftTopPixelPoint: cc.Vec2 = pixelPoint.add(cc.v2(-cc.game.canvas.width * 0.5, cc.game.canvas.height * 0.5));
                    let leftDownPixelPoint: cc.Vec2 = pixelPoint.add(cc.v2(-cc.game.canvas.width * 0.5, -cc.game.canvas.height * 0.5));
                    let rightTopPixelPoint: cc.Vec2 = pixelPoint.add(cc.v2(cc.game.canvas.width * 0.5, cc.game.canvas.height * 0.5));
                    let rightDownPixelPoint: cc.Vec2 = pixelPoint.add(cc.v2(cc.game.canvas.width * 0.5, -cc.game.canvas.height * 0.5));
                    firstAreaIndexs = this.getVaildAreaListByPixelPoints(pixelPoint, leftTopPixelPoint, leftDownPixelPoint, rightTopPixelPoint, rightDownPixelPoint);
                    console.log("map_show_area_change", firstAreaIndexs.toString());
                } else {
                    //其他情况优先请求中心区域
                    if (this._curShowAreaData.addIndexs.indexOf(this._curShowAreaData.centerIndex)
                        && MapAreaRectData.isVaildArea(this._curShowAreaData.centerIndex)) {
                        firstAreaIndexs = [this._curShowAreaData.centerIndex];
                    }
                }
                let otherIndexs: number[] = [];
                if (firstAreaIndexs && firstAreaIndexs.length > 0) {
                    for (let i: number = 0; i < this._curShowAreaData.addIndexs.length; i++) {
                        if (firstAreaIndexs.indexOf(this._curShowAreaData.addIndexs[i]) == -1) {
                            otherIndexs.push(this._curShowAreaData.addIndexs[i]);
                        }
                    }
                } else {
                    otherIndexs = this._curShowAreaData.addIndexs.concat();
                }

                //九宫格 屏幕中最多显示四个的内容所以第一次请求只需要请求四格的数据
                let qryIndexs: number[] = null;
                if (firstAreaIndexs && firstAreaIndexs.length > 0) {
                    qryIndexs = firstAreaIndexs.concat(otherIndexs);
                } else {
                    qryIndexs = otherIndexs;
                }
                this.qryMapAreaList = qryIndexs;

                // console.log("map_show_area_change", firstAreaIndexs, otherIndexs);
                // console.log("map_show_area_change", this._curShowAreaData);
                cc.systemEvent.emit("map_show_area_change", point, this._curShowAreaData);

            }
            return true;
        }
        return false;
    }

    public getCurShowAreaData(): MapAreaRectData {
        return this._curShowAreaData;
    }

    public setMapScanBlock(scanDatas: any, areaIndex: number = 0): void {
        let rBuilds: any[] = scanDatas.mr_builds;
        let cBuilds: any[] = scanDatas.mc_builds;
        if (rBuilds.length > 0) {
            let buildMap: Map<string, MapBuildData> = this.getMapAreaBuilds(areaIndex);
            buildMap.clear();
            for (let i: number = 0; i < rBuilds.length; i++) {
                this.setBuildData(this.createBuildData(rBuilds), areaIndex, buildMap);
            }
            cc.systemEvent.emit("update_builds", areaIndex);
        }
        if (cBuilds.length > 0) {
            let oldCityIds: number[] = this.getMapCityIdsForArea(areaIndex);
            let addCitys: MapCityData[] = [];
            let removeCityIds: number[] = oldCityIds.concat();
            let updateCitys: MapCityData[] = [];
            let newCityIds: number[] = [];
            for (let i: number = 0; i < cBuilds.length; i++) {
                let index: number = oldCityIds.indexOf(cBuilds[i].cityId);
                if (index == -1) {
                    //新增
                    let cityData: MapCityData = this.createCityData(cBuilds[i]);
                    addCitys.push(cityData);
                    this.addCityData(cityData);
                } else {
                    //已经存在的 就只更新
                    removeCityIds.splice(index, 1);//移出删除列表
                    this.updateCityData(cBuilds[i]);
                    updateCitys.push(cBuilds[i].cityId);
                }
                newCityIds.push(cBuilds[i].cityId);
                console.log("setMapScanBlock", index, oldCityIds.length, addCitys.length, removeCityIds.length, updateCitys.length);
            }
            this.setMapCityIdsForArea(areaIndex, newCityIds);
            cc.systemEvent.emit("update_citys", areaIndex, addCitys, removeCityIds, updateCitys);
        }
    }


    /**根据类型获取配置数据*/
    public getConfigByType(type: number): MapConfig {
        if (this._mapConfig && this._mapConfig[type] != undefined) {
            return this._mapConfig[type];
        }
        return null;
    }

    /**获取地图配置全数据*/
    public getConfig(): { [key: string]: MapConfig } {
        return this._mapConfig;
    }

    public getMyMainCity(): MapCityData {
        return this._myMainCity;
    }

    public getSubCitys(): MapCityData[] {
        return this._mySubCitys;
    }
}