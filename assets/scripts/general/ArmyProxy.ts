/**军队数据*/
export class ArmyData {
    id: number = 0;
    cityId: number = 0;
    order: number = 0;
    // firstId: number = 0;
    // secondId: number = 0;
    // thirdId: number = 0;
    // firstCnt: number = 0;
    // secondCnt: number = 0;
    // thirdCnt: number = 0;
    generals:number[] = [];
    soldiers:number[] = [];

    state: number = 0;
    fromX: number = 0;
    fromY: number = 0;
    toX: number = 0;
    toY: number = 0;
    startTime: number = 0;
    endTime: number = 0;

    static createFromServer(serverData: any, armyData: ArmyData = null): ArmyData {
        let data: ArmyData = armyData;
        if (armyData == null) {
            data = new ArmyData();
        }
        data.id = serverData.id;
        data.cityId = serverData.cityId;
        data.order = serverData.order;
        // data.firstId = serverData.firstId;
        // data.secondId = serverData.secondId;
        // data.thirdId = serverData.thirdId;
        // data.firstCnt = serverData.first_soldier_cnt;
        // data.secondCnt = serverData.second_soldier_cnt;
        // data.thirdCnt = serverData.third_soldier_cnt;


        data.generals = serverData.generals;
        data.soldiers = serverData.soldiers;

        data.state = serverData.state;
        data.fromX = serverData.from_x;
        data.fromY = serverData.from_y;
        data.toX = serverData.to_x;
        data.toY = serverData.to_y;
        data.startTime = serverData.start;
        data.endTime = serverData.end;
        return data;
    }
}

export default class ArmyProxy {
    protected _maxArmyCnt: number = 5;//一个城池最大军队数量
    //武将基础配置数据
    protected _armys: Map<number, ArmyData[]> = new Map<number, ArmyData[]>();

    public clearData(): void {
        this._armys.clear();
    }

    public getArmyList(cityId: number): ArmyData[] {
        if (this._armys.has(cityId) == false) {
            return null;
        }
        return this._armys.get(cityId);
    }

    public updateArmys(cityId: number, datas: any[]): ArmyData[] {
        let list: ArmyData[] = this.getArmyList(cityId);
        if (list == null) {
            list = new Array(this._maxArmyCnt);
            this._armys.set(cityId, list);
        }
        for (var i = 0; i < datas.length; i++) {
            let armyData: ArmyData = ArmyData.createFromServer(datas[i]);
            list[armyData.order - 1] = armyData;
        }
        return list;
    }

    public updateArmy(cityId: number, data: any): ArmyData {
        let list: ArmyData[] = this.getArmyList(cityId);
        let armyData: ArmyData = list[data.order - 1];
        list[data.order - 1] = ArmyData.createFromServer(data, armyData);
        return armyData;
    }

    /**根据id获取军队*/
    public getArmyById(id: number, cityId: number): ArmyData {
        let list: ArmyData[] = this.getArmyList(cityId);
        for (let i: number = 0; i < list.length; i++) {
            if (list[i] && list[i].id == id) {
                return list[i];
            }
        }
        return null;
    }

    /**根据位置获取军队*/
    public getArmyByOrder(order: number, cityId: number): ArmyData {
        let list: ArmyData[] = this.getArmyList(cityId);
        return list[order - 1];
    }

    public getFirstArmy(cityId:number):ArmyData {
        let list: ArmyData[] = this.getArmyList(cityId);
        for (let i: number = 0; i < list.length; i++) {
            if (list[i]) {
                return list[i];
            }
        }
        return null;
    }
}