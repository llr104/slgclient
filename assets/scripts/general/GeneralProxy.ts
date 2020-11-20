/**武将(配置)*/
export class GeneralConfig {
    name: string = "";
    cfgId: number = 0;
    force: number = 0;
    strategy: number = 0;
    defense: number = 0;
    speed: number = 0;
    destroy: number = 0;
    cost: number = 0;
}

/**武将等级配置*/
export class GenaralLevelConfig {
    level: number = 0;
    exp: number = 0;
    soldiers: number = 0;
}

/**武将数据*/
export class GeneralData {
    id: number = 0;
    name: string = "";
    cfgId: number = 0;
    force: number = 0;
    strategy: number = 0;
    defense: number = 0;
    speed: number = 0;
    destroy: number = 0;
    cost: number = 0;
    exp: number = 0;
    level: number = 0;
}

export default class GeneralProxy {
    //武将基础配置数据
    protected _generalConfigs: Map<number, GeneralConfig> = new Map<number, GeneralConfig>();
    protected _levelConfigs: GenaralLevelConfig[] = [];
    protected _generalTexs: Map<number, cc.SpriteFrame> = new Map<number, cc.SpriteFrame>();
    protected _myGenerals: Map<number, GeneralData> = new Map<number, GeneralData>();

    public clearData():void {
        this._myGenerals.clear();
    }

    public initGeneralConfig(cfgs: any[]): void {
        let cfgData: any = null;
        let levelData: any = null;
        for (let i: number = 0; i < cfgs.length; i++) {
            console
            if (cfgs[i]._name == "general") {
                cfgData = cfgs[i].json.list;
            } else if (cfgs[i]._name == "general_basic") {
                levelData = cfgs[i].json.levels;
            }
        }

        if (cfgData) {
            this._generalConfigs.clear();
            for (let i: number = 0; i < cfgData.length; i++) {
                var cfg: GeneralConfig = new GeneralConfig();
                cfg.cfgId = cfgData[i].cfgId;
                cfg.name = cfgData[i].name;
                cfg.force = cfgData[i].force;
                cfg.strategy = cfgData[i].strategy;
                cfg.defense = cfgData[i].defense;
                cfg.speed = cfgData[i].speed;
                cfg.destroy = cfgData[i].destroy;
                cfg.cost = cfgData[i].cost;
                this._generalConfigs.set(cfg.cfgId, cfg);
            }
        }

        if (levelData) {
            this._levelConfigs.length = levelData.length;
            for (let i: number = 0; i < levelData.length; i++) {
                var levelCfg: GenaralLevelConfig = new GenaralLevelConfig();
                levelCfg.level = levelData[i].level;
                levelCfg.exp = levelData[i].exp;
                levelCfg.soldiers = levelData[i].soldiers;
                this._levelConfigs[levelCfg.level - 1] = levelCfg;
            }
        }
    }

    public initGeneralTex(texs: cc.SpriteFrame[]): void {
        this._generalTexs.clear();
        for (let i: number = 0; i < texs.length; i++) {
            let id: number = Number(String(texs[i].name).split("_")[1]);
            this._generalTexs.set(id, texs[i]);
        }
    }

    public updateMyGenerals(datas: any[]): void {
        this._myGenerals.clear();
        for (var i = 0; i < datas.length; i++) {
            let data: GeneralData = new GeneralData();
            data.id = datas[i].id;
            data.name = datas[i].name;
            data.cfgId = datas[i].cfgId;
            data.force = datas[i].force;
            data.strategy = datas[i].strategy;
            data.defense = datas[i].defense;
            data.speed = datas[i].speed;
            data.destroy = datas[i].destroy;
            data.cost = datas[i].cost;
            data.exp = datas[i].exp;
            data.level = datas[i].level;
            this._myGenerals.set(data.id, data);
        }
    }

    /**武将配置*/
    public getGeneralCfg(cfgId: number): GeneralConfig {
        if (this._generalConfigs.has(cfgId)) {
            return this._generalConfigs.get(cfgId);
        }
        return null;
    }

    /**武将等级配置*/
    public getGeneralLevelCfg(level: number): GenaralLevelConfig {
        if (level > 0 && level <= this._levelConfigs.length) {
            return this._levelConfigs[level - 1];
        }
        return null;
    }

    public getMaxLevel(): number {
        return this._levelConfigs.length;
    }

    /**武将头像素材*/
    public getGeneralTex(cfgId: number): cc.SpriteFrame {
        if (this._generalTexs.has(cfgId)) {
            return this._generalTexs.get(cfgId);
        }
        return null;
    }

    /**我的武将列表*/
    public getMyGenerals(): GeneralData[] {
        return Array.from(this._myGenerals.values());
    }

    /**我的武将*/
    public getMyGeneral(id: number): GeneralData {
        if (this._myGenerals.has(id)) {
            return this._myGenerals.get(id);
        }
        return null;
    }
}