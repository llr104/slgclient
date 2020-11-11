/**地图基础配置*/
export class MapConfig {
    public type: number = 0;
    public name: string = "";
    public wood: number = 0;
    public iron: number = 0;
    public stone: number = 0;
    public grain: number = 0;
    public durable: number = 0;
    public defender: number = 0;
}

export default class MapProxy {
    //地图基础配置数据
    protected _mapConfig: { [key: string]: MapConfig } = null;

    public setNationMapConfig(configList: any[]) {
        this._mapConfig = {};
        for (let i: number = 0; i < configList.length; i++) {
            this._mapConfig[configList[i].type] = configList[i];
        }
        console.log("setNationMapConfig", this._mapConfig)
    }

    public getConfigByType(type: number): MapConfig {
        if (this._mapConfig && this._mapConfig[type] != undefined) {
            return this._mapConfig[type];
        }
        return null;
    }
}