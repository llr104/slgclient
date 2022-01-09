import { _decorator } from 'cc';
import { Basic, Conscript, General } from "../../config/Basci";
import LoginCommand from "../../login/LoginCommand";
import DateUtil from "../../utils/DateUtil";
import MapUICommand from "./MapUICommand";

export class CityAddition {
    cost: number = 0;
    armyCnt: number = 0;//军队数量
    vanguardCnt: 0;//军队前锋数量 默认每队只有两个位置 前锋数量影响第三个位置的开启
    soldierCnt: 0;//带兵数加成
    han: number = 0;//汉阵营加成
    qun: number = 0;//群阵营加成
    wei: number = 0;//魏阵营加成
    shu: number = 0;//蜀阵营加成
    wu: number = 0;//吴阵营加成
    taxRate:number = 0;//交换的税率
    durable:number = 0;//耐久


    public clear(): void {
        this.cost = 0;
        this.armyCnt = 0;
        this.vanguardCnt = 0;
        this.soldierCnt = 0;
        this.han = 0;
        this.qun = 0;
        this.wei = 0;
        this.shu = 0;
        this.wu = 0;
        this.durable = 0;
    }
};

/**城池加成类型*/
export class CityAdditionType {
    static Durable: number = 1;//耐久
    static Cost: number = 2;
    static ArmyTeams: number = 3;//队伍数量
    static Speed: number = 4;//速度
    static Defense: number = 5;//防御
    static Strategy: number = 6;	//谋略
    static Force: number = 7;	//攻击武力
    static ConscriptTime: number = 8;//征兵时间
    static ReserveLimit: number = 9;//预备役上限
    static Unkonw: number = 10;
    static HanAddition: number = 11;
    static QunAddition: number = 12;
    static WeiAddition: number = 13;
    static ShuAddition: number = 14;
    static WuAddition: number = 15;
    static DealTaxRate: number = 16;//交易税率
    static Wood: number = 17;
    static Iron: number = 18;
    static Grain: number = 19;
    static Stone: number = 20;
    static Tax: number = 21;//税收
    static ExtendTimes: number = 22;//扩建次数
    static WarehouseLimit: number = 23;//仓库容量
    static SoldierLimit: number = 24;//带兵数量
    static VanguardLimit: number = 25;//前锋数量
}

/**设施*/
export class Facility {
    level: number = 0;
    type: number = 0;
    upTime:number = 0;  //升级的时间，0为该等级已经升级成功

    public isUping(): boolean{
        return this.upLastTime() > 0
    }

    public isNeedUpdateLevel(): boolean{
        return this.upLastTime() < 0
    }

    public upLastTime(): number{
        if(this.upTime > 0){
            let cfg:FacilityConfig = MapUICommand.getInstance().proxy.getFacilityCfgByType(this.type);
            var costTime = cfg.upLevels[this.level].time;
            return DateUtil.leftTime((this.upTime+costTime)*1000);
        }else{
            return 0;
        }
    }
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
    time:number = 0;
}

export class BasicGeneral {
    limit: number = 0;
}


export class WarReport {
    id: number = 0;
    attack_rid: number = 0;
    defense_rid: number = 0;

    beg_attack_army: any = {};
    beg_defense_army: any = {};
    end_attack_army: any = {};
    end_defense_army: any = {};

    result: number = 0;
    rounds: any = {};
    attack_is_read: boolean = false;
    defense_is_read: boolean = false;
    destroy_durable: number = 0;
    occupy: number = 0;
    x: number = 0;
    y: number = 0;
    ctime: number = 0;
    beg_attack_general: any[] = [];
    beg_defense_general: any[] = [];

    end_attack_general: any[] = [];
    end_defense_general: any[] = [];

    is_read: boolean = false;

}


export class WarReportRound {
    isAttack: boolean = false;
    attack: any = {};
    defense: any = {};
    attackLoss: number = 0;
    defenseLoss: number = 0;
    round: number = 0;
    turn: number = 0;
}



export default class MapUIProxy {
    protected _myFacility: Map<number, Map<number, Facility>> = new Map<number, Map<number, Facility>>();//城市设施
    protected _facilityCfg: Map<number, FacilityConfig> = new Map<number, FacilityConfig>();//设施配置
    protected _facilityAdditionCfg: Map<number, FacilityAdditionCfg> = new Map<number, FacilityAdditionCfg>();//升级加成配置
    protected _warReport: Map<number, WarReport> = new Map<number, WarReport>();
    protected _additions: Map<number, CityAddition> = new Map<number, CityAddition>();
    protected _basic: Basic

    public clearData(): void {
        this._warReport.clear();
        this._myFacility.clear();
        this._additions.clear();
    }

    /**
     * 当前城市的设施
     * @param data 
     */
    public updateMyFacilityList(cityId: number, datas: any[]): void {
        console.log("updateMyFacilityList:", datas);
        let list: Map<number, Facility> = new Map<number, Facility>();
        this._myFacility.set(cityId, list);
        for (var i = 0; i < datas.length; i++) {
            var obj = new Facility();
            obj.level = datas[i].level;
            obj.type = datas[i].type;
            obj.upTime = datas[i].up_time;
            list.set(obj.type, obj);
        }

        console.log("list:", list);
    }

    public updateMyFacility(cityId: number, data: any): Facility {
        console.log("updateMyFacility:", data);
        if (this._myFacility.has(cityId)) {
            let list: Map<number, Facility> = this._myFacility.get(cityId);
            let facilityData: Facility = list.get(data.type);
            if (facilityData == null) {
                facilityData = new Facility();
                list.set(data.type, facilityData);
            }
            facilityData.level = data.level;
            facilityData.type = data.type;
            facilityData.upTime = data.up_time;
            return facilityData;
        }
        return null;
    }

    /**更新设施加成数据*/
    public updateMyCityAdditions(cityId: number): CityAddition {
        if (this._myFacility.has(cityId)) {
            let addition: CityAddition = null;
            if (this._additions.has(cityId)) {
                addition = this._additions.get(cityId);
            } else {
                addition = new CityAddition();
                this._additions.set(cityId, addition);
            }
            addition.clear();//清除旧数据 重新计算
            let list: Map<number, Facility> = this._myFacility.get(cityId);
            list.forEach((data: Facility, type: number) => {
                if (data.level > 0) {
                    let cfg: FacilityConfig = this.getFacilityCfgByType(data.type);
                    if (cfg) {
                        let addValue: number = 0;
                        let index: number = -1;
                        index = cfg.additions.indexOf(CityAdditionType.ArmyTeams);
                        if (index != -1) {
                            //军队数量加成
                            addValue = cfg.upLevels[data.level - 1].values[index];
                            addition.armyCnt += addValue;
                        }
                        index = cfg.additions.indexOf(CityAdditionType.Cost);
                        if (index != -1) {
                            //cost加成
                            addValue = cfg.upLevels[data.level - 1].values[index];
                            addition.cost += addValue;
                        }
                        index = cfg.additions.indexOf(CityAdditionType.SoldierLimit);
                        if (index != -1) {
                            //带兵数加成
                            addValue = cfg.upLevels[data.level - 1].values[index];
                            addition.soldierCnt += addValue;
                        }
                        index = cfg.additions.indexOf(CityAdditionType.VanguardLimit);
                        if (index != -1) {
                            //带兵数加成
                            addValue = cfg.upLevels[data.level - 1].values[index];
                            addition.vanguardCnt += addValue;
                        }
                        index = cfg.additions.indexOf(CityAdditionType.HanAddition);
                        if (index != -1) {
                            //汉阵营加成
                            addValue = cfg.upLevels[data.level - 1].values[index];
                            addition.han += addValue;
                        }
                        index = cfg.additions.indexOf(CityAdditionType.QunAddition);
                        if (index != -1) {
                            //群阵营加成
                            addValue = cfg.upLevels[data.level - 1].values[index];
                            addition.qun += addValue;
                        }
                        index = cfg.additions.indexOf(CityAdditionType.WeiAddition);
                        if (index != -1) {
                            //魏阵营加成
                            addValue = cfg.upLevels[data.level - 1].values[index];
                            addition.wei += addValue;
                        }
                        index = cfg.additions.indexOf(CityAdditionType.ShuAddition);
                        if (index != -1) {
                            //蜀阵营加成
                            addValue = cfg.upLevels[data.level - 1].values[index];
                            addition.shu += addValue;
                        }
                        index = cfg.additions.indexOf(CityAdditionType.WuAddition);
                        if (index != -1) {
                            //吴阵营加成
                            addValue = cfg.upLevels[data.level - 1].values[index];
                            addition.wu += addValue;
                        }

                        index = cfg.additions.indexOf(CityAdditionType.DealTaxRate);
                        if (index != -1) {
                            //交易税收
                            addValue = cfg.upLevels[data.level - 1].values[index];
                            addition.taxRate += addValue;
                        }

                        index = cfg.additions.indexOf(CityAdditionType.Durable);
                        if (index != -1) {
                            //console.log("CityAdditionType.Durable:", cfg.upLevels, addValue, index);
                            //耐久
                            addValue = cfg.upLevels[data.level - 1].values[index];
                            addition.durable += addValue;
                        }
                    }
                }
            });
            console.log("updateMyCityAdditions", cityId, addition);
            return addition;
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

    public getMyAllFacilitys(): Map<number, Map<number, Facility>> {
        return this._myFacility;
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

    /**获取城池的加成数据*/
    public getMyCityAddition(cityId: number): CityAddition {
        let addition: CityAddition = null;
        if (this._additions.has(cityId)) {
            addition = this._additions.get(cityId);
        } else {
            addition = new CityAddition();
            this._additions.set(cityId, addition);
        }
        return addition;
    }

    public getMyCityCost(cityId: number):number{
        let addition = this.getMyCityAddition(cityId);
        console.log("getMyCityCost:", cityId, addition, this._basic.city.cost);
        return addition.cost + this._basic.city.cost;
    }

    //最大耐久
    public getMyCityMaxDurable(cityId: number):number{
        let addition = this.getMyCityAddition(cityId);
        console.log("getMyCityMaxDurable:", cityId, addition, this._basic.city.durable);
        return addition.durable + this._basic.city.durable;
    }

    public getTransformRate():number {
        return this._basic.city.transform_rate
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
                        upLevelData.time = jsonList[i].levels[k].time;
                        cfgData.upLevels[upLevelData.level - 1] = upLevelData;

                        //console.log("upLevelData:", upLevelData)
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

    public setBasic(data: any): void {
        this._basic = data.json;
        console.log("setBasic:", this._basic);
    }


    public getConscriptBaseCost(): Conscript {
        return this._basic.conscript;
    }

    public getDefenseSoldiers(level:number): number {
        console.log("getDefenseSoldiers:", level);
        return this._basic.npc.levels[level-1].soilders
    }

    public getBasicGeneral(): General {
        return this._basic.general;
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
        obj.attack_rid = data.a_rid;
        obj.defense_rid = data.d_rid;

        obj.beg_attack_general = this.arrayToObject(JSON.parse(data.b_a_general));
        obj.end_attack_general = this.arrayToObject(JSON.parse(data.e_a_general));
        obj.end_attack_army = JSON.parse(data.e_a_army);
        obj.beg_attack_army = JSON.parse(data.b_a_army);
      
        try {
            obj.beg_defense_army = JSON.parse(data.b_d_army);
            obj.end_defense_army = JSON.parse(data.e_d_army);
            obj.beg_defense_general = this.arrayToObject(JSON.parse(data.b_d_general));
            obj.end_defense_general = this.arrayToObject(JSON.parse(data.e_d_general));
            obj.rounds = this.createRoundsData(data.rounds, obj.beg_attack_general, obj.beg_defense_general)
        } catch (error) {
            
        }

        obj.result = data.result;
       
        obj.defense_is_read = data.d_is_read;
        obj.attack_is_read = data.a_is_read;

        obj.is_read = this.isReadObj(obj);
        obj.destroy_durable = data.destroy;
        obj.occupy = data.occupy;
        obj.x = data.x;
        obj.y = data.y;
        obj.ctime = data.ctime;

        return obj;
    }


    private createRoundsData(data: string, attack_generals: any[], defense_generals: any[]): any[] {
        var generals: any[] = attack_generals.concat(defense_generals);

        var _list: any[] = [];
        var rounds: any[] = JSON.parse(data);
        for (var i = 0; i < rounds.length; i++) {
            var round: any[] = rounds[i].b;
            if(!round){
                continue;
            }

            for (var j = 0; j < round.length; j++) {
                var turn = round[j];
                var attack_id = turn[0];
                var defense_id = turn[1];
                var attack_loss = turn[2];
                var defense_loss = turn[3];

                var obj = new WarReportRound();
                obj.attack = this.getMatchGeneral(generals, attack_id);
                obj.defense = this.getMatchGeneral(generals, defense_id);
                obj.isAttack = this.getMatchGeneral(attack_generals, attack_id) != null;
                obj.attackLoss = attack_loss;
                obj.defenseLoss = defense_loss;
                obj.round = i + 1;
                obj.turn = j + 1;
                _list.push(obj);
            }

        }


        return _list;
    }


    protected arrayToObject(arr: any): any {
        let temp: any = [];
        for (var i = 0; i < arr.length; i++) {
            var data = arr[i];

            var obj: any = {}
            obj.id = data[0];
            obj.cfgId = data[1];
            obj.physical_power = data[2];
            obj.order = data[3];
            obj.level = data[4];
            obj.exp = data[5];
            obj.cityId = data[6];
            obj.curArms = data[7];
            obj.hasPrPoint = data[8];
            obj.attack_distance = data[9];
            obj.force_added = data[10];
            obj.strategy_added = data[11];
            obj.defense_added = data[12];
            obj.speed_added = data[13];
            obj.destroy_added = data[14];
            obj.star_lv = data[15];
            obj.star = data[16];


            temp.push(obj);
        }

        return temp;
    }

    protected getMatchGeneral(generals: any[], id: number = 0): any {
        for (var i = 0; i < generals.length; i++) {
            if (generals[i].id == id) {
                return generals[i];
            }
        }
        return null;
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

    public updateAllWarRead(isRead: boolean = true) {
        this._warReport.forEach(element => {
            this.updateWarRead(element.id, isRead)
        });
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
        // for (var i = 0; i < arr.length; i++) {
        //     if (arr[i].is_read == true) {
        //         backArr.push(arr[i]);
        //         arr.splice(i, 1);
        //         i--;
        //     }
        // }


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
