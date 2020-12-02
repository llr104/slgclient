import LoginCommand from "../../login/LoginCommand";

/**设施*/
export class Facility {
    level: number = 0;
    type: number = 0;
}

/**设施(配置)*/
export class FacilityConfig {
    name: string = "";
    type: number = 0;
    des: string = "";
    additions: number[] = [];
    conditions: FacilityOpenCondition[] = [];
    upLevels: FacilityUpLevel[] = [];
}

/**设施加成类型配置*/
export class FacilityAdditionCfg {
    type: number = 0;
    des: string = "";
    value: string = "";
}

/**设施开启条件配置*/
export class FacilityOpenCondition {
    type: number = 0;
    level: number = 0;
}

/**设施升级配置*/
export class FacilityUpLevel {
    level: number = 0;
    values: number[] = [];
    wood: number = 0;
    iron: number = 0;
    stone: number = 0;
    grain: number = 0;
    decree: number = 0;
}

/**征兵基础消耗*/
export class ConscriptBaseCost {
    cost_wood: number = 0;
    cost_iron: number = 0;
    cost_stone: number = 0;
    cost_grain: number = 0;
    cost_gold: number = 0;
}

export class WarReport {
    id: number = 0;
    attack_rid: number = 0;
    defense_rid: number = 0;

    beg_attack_army: any = {};
    beg_defense_army: any = {};
    end_attack_army: any = {};
    end_defense_army: any = {};

    attack_is_win: boolean = false;
    attack_is_read: boolean = false;
    defense_is_read: boolean = false;
    destroy_durable: number = 0;
    occupy: number = 0;
    x: number = 0;
    y: number = 0;
    ctime: number = 0;
    beg_attack_general: any = {};
    beg_defense_general: any = {};

    end_attack_general: any = {};
    end_defense_general: any = {};

    is_read: boolean = false;
}

export default class MapUIProxy {
    protected _myFacility: Map<number, Map<number, Facility>> = new Map<number, Map<number, Facility>>();//城市设施
    protected _facilityCfg: Map<number, FacilityConfig> = new Map<number, FacilityConfig>();//设施配置
    protected _facilityAdditionCfg: Map<number, FacilityAdditionCfg> = new Map<number, FacilityAdditionCfg>();//升级加成配置
    protected _armyBaseCost: ConscriptBaseCost = new ConscriptBaseCost();
    protected _warReport: Map<number, WarReport> = new Map<number, WarReport>();



    public clearData(): void {
        this._warReport.clear();
        this._myFacility.clear();
    }

    /**
     * 当前城市的设施
     * @param data 
     */
    public updateMyFacilityList(cityId: number, datas: any[]): void {
        let list: Map<number, Facility> = new Map<number, Facility>();
        this._myFacility.set(cityId, list);
        for (var i = 0; i < datas.length; i++) {
            var obj = new Facility();
            obj.level = datas[i].level;
            obj.type = datas[i].type;
            list.set(obj.type, obj);
        }
    }

    public updateMyFacility(cityId: number, data: any): Facility {
        if (this._myFacility.has(cityId)) {
            let list: Map<number, Facility> = this._myFacility.get(cityId);
            let facilityData: Facility = list.get(data.type);
            if (facilityData == null) {
                facilityData = new Facility();
                list.set(data.type, facilityData);
            }
            facilityData.level = data.level;
            facilityData.type = data.type;
            return facilityData;
        }
        return null;
    }

    /**
     * 获取当前拥有的设施
     * @param cityId 
     */
    public getMyFacilitys(cityId: number = 0): Map<number, Facility> {
        return this._myFacility.get(cityId);
    }

    /**获取指定的设施数据*/
    public getMyFacilityByType(cityId: number = 0, type: number = 0): Facility {
        if (this._myFacility.has(cityId)) {
            let list: Map<number, Facility> = this._myFacility.get(cityId);
            if (list.has(type)) {
                return list.get(type);
            }
        }
        return null;
    }

    /**
     * 全部设施配置
     * @param jsonAsset 
     */
    public setAllFacilityCfg(jsonAssets: any[]): void {
        this._facilityCfg = new Map();

        let mainJson: any = null;//设施类型配置
        let additionJson: any = null;//升级类型配置
        let otherJsons: any[] = [];//具体升级配置

        for (let i: number = 0; i < jsonAssets.length; i++) {
            if (jsonAssets[i]._name == "facility") {
                mainJson = jsonAssets[i].json;
            } else if (jsonAssets[i]._name == "facility_addition") {
                additionJson = jsonAssets[i].json;
            } else {
                otherJsons.push(jsonAssets[i].json);
            }
        }
        console.log("mainJson", mainJson, additionJson);
        if (mainJson != null && additionJson != null) {
            //主配置存在才处理配置文件
            this._facilityCfg.clear();
            for (let i: number = 0; i < mainJson.list.length; i++) {
                let cfgData: FacilityConfig = new FacilityConfig();
                cfgData.type = mainJson.list[i].type;
                cfgData.name = mainJson.list[i].name;
                this._facilityCfg.set(cfgData.type, cfgData);
            }

            this._facilityAdditionCfg.clear();
            for (let i: number = 0; i < additionJson.list.length; i++) {
                let cfgData: FacilityAdditionCfg = new FacilityAdditionCfg();
                cfgData.type = additionJson.list[i].type;
                cfgData.des = additionJson.list[i].des;
                cfgData.value = additionJson.list[i].value;
                this._facilityAdditionCfg.set(cfgData.type, cfgData);
            }

            let jsonList: any[] = [];
            for (let i: number = 0; i < otherJsons.length; i++) {
                this.getFacilityUpLevelJsonList(otherJsons[i], jsonList);
            }
            console.log("jsonList", jsonList, otherJsons);

            for (let i: number = 0; i < jsonList.length; i++) {
                let type: number = jsonList[i].type;
                let cfgData: FacilityConfig = this._facilityCfg.get(type);
                if (cfgData) {
                    //存在主配置 才加入升级配置
                    cfgData.des = jsonList[i].des;
                    cfgData.additions = jsonList[i].additions;
                    cfgData.conditions = [];
                    for (let j: number = 0; j < jsonList[i].conditions.length; j++) {
                        let conditionData: FacilityOpenCondition = new FacilityOpenCondition();
                        conditionData.type = jsonList[i].conditions[j].type;
                        conditionData.level = jsonList[i].conditions[j].level;
                        cfgData.conditions.push(conditionData);
                    }

                    cfgData.upLevels.length = jsonList[i].levels.length;
                    for (let k: number = 0; k < jsonList[i].levels.length; k++) {
                        let upLevelData: FacilityUpLevel = new FacilityUpLevel();
                        upLevelData.level = jsonList[i].levels[k].level;
                        upLevelData.values = jsonList[i].levels[k].values;
                        upLevelData.wood = jsonList[i].levels[k].need.wood;
                        upLevelData.iron = jsonList[i].levels[k].need.iron;
                        upLevelData.grain = jsonList[i].levels[k].need.grain;
                        upLevelData.wood = jsonList[i].levels[k].need.wood;
                        upLevelData.stone = jsonList[i].levels[k].need.stone;
                        cfgData.upLevels[upLevelData.level - 1] = upLevelData;
                    }
                }
            }
        }
        this._facilityCfg.forEach((value: FacilityConfig, key: number) => {
            console.log("this._facilityCfg", key, value);
        });
    }

    protected getFacilityUpLevelJsonList(data: any, list: any[]): void {
        if (typeof (data) == "string" || typeof (data) == "number") {
            return;
        }
        if (data.type != undefined && data.additions != undefined) {
            //代表是需要的数据
            list.push(data);
        } else {
            //代表有多条数据在更里层
            for (let key in data) {
                this.getFacilityUpLevelJsonList(data[key], list);
            }
        }
    }

    public getFacilityCfgByType(type: number = 0): FacilityConfig {
        return this._facilityCfg.get(type);
    }

    public getFacilityAdditionCfgByType(type: number = 0): FacilityAdditionCfg {
        return this._facilityAdditionCfg.get(type);
    }

    /**设施是否解锁*/
    public isFacilityUnlock(cityId: number, type: number): boolean {
        let isUnlock: boolean = true;
        let cfg: FacilityConfig = this.getFacilityCfgByType(type);
        for (let i: number = 0; i < cfg.conditions.length; i++) {
            let data: Facility = this.getMyFacilityByType(cityId, cfg.conditions[i].type);
            if (data && data.level < cfg.conditions[i].level) {
                isUnlock = false;
                break;
            }
        }
        return isUnlock;
    }

    public setBaseCost(data: any): void {
        this._armyBaseCost.cost_gold = data.json.conscript.cost_gold;
        this._armyBaseCost.cost_iron = data.json.conscript.cost_iron;
        this._armyBaseCost.cost_wood = data.json.conscript.cost_wood;
        this._armyBaseCost.cost_grain = data.json.conscript.cost_grain;
        this._armyBaseCost.cost_stone = data.json.conscript.cost_stone;
    }

    public getBaseCost(): ConscriptBaseCost {
        return this._armyBaseCost;
    }

    public updateWarReports(data: any): void {
        var list = data.list;
        for (var i = 0; i < list.length; i++) {
            var obj: WarReport = this.createWarReprot(list[i]);
            this._warReport.set(obj.id, obj);
        }
    }

    public updateWarReport(data: any): void {
        var obj: WarReport = this.createWarReprot(data);
        this._warReport.set(obj.id, obj);
    }


    protected createWarReprot(data: any): WarReport {
        var obj = new WarReport();
        obj.id = data.id;
        obj.attack_rid = data.attack_rid;
        obj.defense_rid = data.defense_rid;

        obj.beg_attack_army = JSON.parse(data.beg_attack_army);
        obj.beg_defense_army = JSON.parse(data.beg_defense_army);
        obj.end_attack_army = JSON.parse(data.end_attack_army);
        obj.end_defense_army = JSON.parse(data.end_defense_army);
        obj.beg_attack_general = JSON.parse(data.beg_attack_general);
        obj.beg_defense_general = JSON.parse(data.beg_defense_general);

        obj.end_attack_general = JSON.parse(data.end_attack_general);
        obj.end_defense_general = JSON.parse(data.end_defense_general);

        obj.attack_is_win = data.attack_is_win;
        obj.defense_is_read = data.defense_is_read;
        obj.attack_is_read = data.attack_is_read;

        obj.is_read = this.isReadObj(obj);
        obj.destroy_durable = data.destroy_durable;
        obj.occupy = data.occupy;
        obj.x = data.x;
        obj.y = data.y;
        obj.ctime = data.ctime;

        return obj;
    }



    public updateWarRead(id: number = 0, isRead: boolean = true) {
        var data = this._warReport.get(id);
        var roleData = LoginCommand.getInstance().proxy.getRoleData();
        if (data) {
            if (data.defense_rid == roleData.rid) {
                data.defense_is_read = isRead;
                data.is_read = isRead;
            }

            if (data.attack_rid == roleData.rid) {
                data.attack_is_read = isRead;
                data.is_read = isRead;
            }


            this._warReport.set(id, data);
        }
    }


    public isRead(id: number = 0): boolean {
        var data = this._warReport.get(id);
        var roleData = LoginCommand.getInstance().proxy.getRoleData();
        if (data) {
            if (data.defense_rid == roleData.rid) {
                return data.defense_is_read;
            }

            if (data.attack_rid == roleData.rid) {
                return data.attack_is_read;
            }

        }

        return false;
    }

    public isReadObj(obj: any): boolean {
        var roleData = LoginCommand.getInstance().proxy.getRoleData();
        if (obj.defense_rid == roleData.rid) {
            return obj.defense_is_read;
        }

        if (obj.attack_rid == roleData.rid) {
            return obj.attack_is_read;
        }

        return false;
    }

    public getWarReport(): WarReport[] {
        var arr: WarReport[] = Array.from(this._warReport.values());
        arr = arr.sort(this.sortIsRead);
        arr = arr.concat();

        var backArr: WarReport[] = [];
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].is_read == true) {
                backArr.push(arr[i]);
                arr.splice(i, 1);
                i--;
            }
        }


        backArr = arr.concat(backArr);
        // backArr = backArr.reverse();
        return backArr;
    }


    public sortIsRead(a: any, b: any): number {
        if (a.id < b.id) {
            return 1;
        }

        return -1;
    }


    public isReadNum(): number {
        var num = 0;
        var arr = this.getWarReport();
        for (var i = 0; i < arr.length; i++) {
            if (!this.isRead(arr[i].id)) {
                num++;
            }
        }

        return num;
    }

}