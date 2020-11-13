

/**设施*/
export class Facility {
    name: string = "";
    mLevel:number = 0;
    cLevel:number = 0;
    type:number = 0;
}

export default class MapUIProxy {
    protected _myFacility: any = new Map();

    public setMyFacility(data:any):void {
        this._myFacility.clear();
        var cityId = data.cityId;
        var facilities = data.facilities;
        console.log("facilities:",facilities)
        if(facilities){
            var facilitiesArr = [];
            for(var i = 0;i < facilities.length;i++){
                var obj = new Facility();
                obj.name = facilities[i].name;
                obj.mLevel = facilities[i].mLevel;
                obj.cLevel = facilities[i].cLevel;
                obj.type = facilities[i].type;
                facilitiesArr.push(obj);
            }
            this._myFacility.set(cityId,facilitiesArr);
        }
       

    }


    public getMyFacility(cityId:number = 0):Array<Facility>{
        return this._myFacility.get(cityId);
    }


    public setMyFacilityByCityId(cityId:number = 0,facilitiesArr:any):void{
        this._myFacility.set(cityId,facilitiesArr);
    }
}