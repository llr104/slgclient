export enum MapResType {
    Blank,//空地
    Invalid,//无效区域 河流 山等
    Gold,//金币
    Grain,//粮食
    Wood,//木材
    Iron,//铁
    Stone,//石料

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

export default class MapProxy {
    protected _mapResConfig: Array<Array<MapResType>>= null;
    //地图基础配置数据
    protected _mapConfig: { [key: number]: MapConfig } = null;
    protected _myMainCity: MapBuild = null;
    protected _mySubCity: MapBuild = null;

    //初始化地图资源配置
    public initResConfig(tileMapGIds:number[], size:cc.Size):void {
        this._mapResConfig = new Array<Array<MapResType>>(size.width);
        for (let x:number = 0; x < size.width; x++) {
            this._mapResConfig[x] = [];
            for (let y:number = 0; y < size.height; y++) {
                let index:number = x + y * size.width;
                if (tileMapGIds[index] > 0) {
                    //代表是山川 河流
                    this._mapResConfig[x].push(MapResType.Invalid);
                } else {
                    this._mapResConfig[x].push(MapResType.Blank);
                }
            }
        }
    }

    public setNationMapConfig(configList: any[]):void {
        this._mapConfig = {};
        for (let i: number = 0; i < configList.length; i++) {
            let cfg:MapConfig = new MapConfig();
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

    public setMyCitys(citys:any[]):void {
        for (let i:number = 0; i < citys.length; i++) {
            let build:MapBuild = new MapBuild();
            build.cityId = citys[i].type;
            build.rid = citys[i].rid;
            build.nickName = citys[i].nickName;
            build.position = cc.v2(citys[i].x, citys[i].y);
            build.isMain = citys[i].is_main;
            build.level = citys[i].level;
            build.durable = citys[i].durable;
            if (build.isMain) {
                this._myMainCity = build;
            } else {
                this._mySubCity = build;
            }
        }
    }

    public setMapScan()

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
}