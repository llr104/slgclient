export class MapResType {
    static WOOD: number = 52;
    static IRON: number = 53;
    static STONE: number = 54;
    static GRAIN: number = 53;
}


export class MapResConfig {
    type: number = 0;
    level: number = 0;
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

/**地图建筑配置*/
export class MapBuild {
    cityId: number = 0;
    rid: number = 0;
    nickName: string = "";
    position: cc.Vec2 = null;
    y: number = 0;
    isMain: number = 0;
    level: number = 0;
    durable: number = 0;
}

/**地图展示区域*/
export class MapRect {
    minX: number = 0;
    maxX: number = 0;
    minY: number = 0;
    maxY: number = 0;

    constructor(minX: number = 0, maxX: number = 0, minY: number = 0, maxY: number = 0) {
        this.minX = minX;
        this.maxX = maxX;
        this.minY = minY;
        this.maxY = maxY;
    }

    public contains(x: number, y: number): boolean {
        return (this.minX <= x &&
            this.maxX >= x &&
            this.minY <= y &&
            this.maxY >= y);
    }

    public clone(): MapRect {
        let rect: MapRect = new MapRect();
        rect.minX = this.minX;
        rect.maxX = this.maxX;
        rect.minY = this.minY;
        rect.maxY = this.maxY;
        return rect;
    }
}

export default class MapProxy {
    //地图像素大小
    protected _mapPixelSize: cc.Size = null;
    //地图锚点偏移量
    protected _mapOffsetSize: cc.Size = null;
    //格子大小
    protected _tileSize: cc.Size = cc.size(256, 128);;
    //地图大小 宽高需要相同
    protected _mapSize: cc.Size = cc.size(20, 20);
    //地图 (0, 0)点对应的像素坐标
    protected _zeroPixelPoint: cc.Vec2 = cc.v2(0, 0);
    //x轴的展示格子数量
    protected _showRectW: number = 7;
    //y轴的展示格子数量
    protected _showRectH: number = 7;
    //当前地图中心点
    protected _curCenterPoint: cc.Vec2 = cc.v2(0, 0);
    //当前展示区域
    protected _curShowRect: MapRect = null;
    protected _mapResConfigs: Array<Array<MapResConfig>> = null;
    protected _mapBuilds: Array<Array<number>> = null;
    //地图基础配置数据
    protected _mapConfig: { [key: number]: MapConfig } = null;
    protected _myMainCity: MapBuild = null;
    protected _mySubCitys: MapBuild[] = [];

    // 初始化地图配置
    public initMapConfig(map: cc.TiledMap): void {
        this._mapPixelSize = cc.size(map.node.width, map.node.height);
        this._mapOffsetSize = cc.size(map.node.width * map.node.anchorX, map.node.height * map.node.anchorY);
        this._tileSize = map.getTileSize();
        this._mapSize = map.getMapSize();
        this._zeroPixelPoint.x = this._mapSize.width * this._tileSize.width * 0.5;
        this._zeroPixelPoint.y = this._mapSize.height * this._tileSize.height - this._tileSize.height * 0.5;
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
        return worldPoint.sub(cc.v2(this._mapOffsetSize.width, this._mapOffsetSize.height));
    }

    //地图像素转地图坐标
    public mapPixelToCellPoint(point: cc.Vec2): cc.Vec2 {
        let worldPoint: cc.Vec2 = point.add(cc.v2(this._mapOffsetSize.width, this._mapOffsetSize.height));
        return this.worldPixelToMapCellPoint(worldPoint);
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
        console.log("setNationMapConfig", this._mapConfig);
    }

    /**我的城池信息*/
    public setMyCitys(citys: any[]): void {
        for (let i: number = 0; i < citys.length; i++) {
            let build: MapBuild = new MapBuild();
            build.cityId = citys[i].cityId;
            build.rid = citys[i].rid;
            build.nickName = citys[i].nickName;
            build.position = cc.v2(citys[i].x, citys[i].y);
            build.isMain = citys[i].is_main;
            build.level = citys[i].level;
            build.durable = citys[i].durable;
            if (build.isMain) {
                this._myMainCity = build;
            } else {
                this._mySubCitys.push(build);
            }
        }
    }

    public initMapResConfig(jsonData: any): void {
        let w: number = jsonData.w;
        let h: number = jsonData.h;
        let list: Array<Array<number>> = jsonData.list;
        this._mapResConfigs = new Array<Array<MapResConfig>>(w);
        for (let x: number = 0; x < w; x++) {
            this._mapResConfigs[x] = [];
            for (let y: number = 0; y < h; y++) {
                let index = x + y * w;
                let data: MapResConfig = new MapResConfig();
                data.type = list[index][0];
                data.level = list[index][1];
                this._mapResConfigs[x].push(data);
            }
        }
        console.log("initMapResConfig", this._mapResConfigs);
    }

    public get mapResConfigs(): Array<Array<MapResConfig>> {
        return this._mapResConfigs;
    }

    /**设置地图当前中心点的信息*/
    public setCurCenterPoint(point: cc.Vec2): boolean {
        if (this._curCenterPoint == null
            || this._curCenterPoint.x != point.x
            || this._curCenterPoint.y != point.y) {
            this._curCenterPoint = point;

            let oldRect: MapRect = null;
            if (this._curShowRect == null) {
                this._curShowRect = new MapRect();
            } else {
                oldRect = this._curShowRect.clone();
            }

            this._curShowRect.minX = Math.max(0, point.x - this._showRectW);
            this._curShowRect.maxX = Math.min(this._mapSize.width - 1, point.x + this._showRectW);
            this._curShowRect.minY = Math.max(0, point.y - this._showRectH);
            this._curShowRect.maxY = Math.min(this._mapSize.height - 1, point.y + this._showRectH);
            cc.systemEvent.emit("map_center_change", point, this._curShowRect, oldRect);
            return true;
        }
        return false;
    }

    public getCurShowRect(): MapRect {
        return this._curShowRect;
    }

    public setMapScan(scanDatas: any): void {
        let rBuild: any[] = scanDatas.r_builds;
        let cBuilds: any[] = scanDatas.c_builds;
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

    public getMyMainCity(): MapBuild {
        return this._myMainCity;
    }

    public getSubCitys(): MapBuild[] {
        return this._mySubCitys;
    }
}