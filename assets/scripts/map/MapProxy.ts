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

export class MapBuild {
    cityId: number = 0;
    rid: number = 0;
    nickName: string = "";
    x: number = 0;
    y: number = 0;
    isMain: number = 0;
    level: number = 0;
    durable: number = 0;
}

export default class MapProxy {
    //地图基础配置数据
    protected _mapConfig: { [key: number]: MapConfig } = null;
    protected _myMainCity: MapBuild = null;
    protected _mySubCity: MapBuild = null;

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
            build.rid = citys[i].name;
            build.nickName = citys[i].Wood;
            build.x = citys[i].iron;
            build.y = citys[i].stone;
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