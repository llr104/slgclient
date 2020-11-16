

/**设施*/
export class Facility {
    name: string = "";
    level:number = 0;
    type:number = 0;
}



/**设施(配置)*/
export class FacilityConfig {
    name: string = "";
    type:number = 0;
    mLevel:number = 0;
    json:any = {};
}



export default class MapUIProxy {
    protected _myFacility: any = new Map();
    protected _facilityConfig:any = null;

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
                obj.level = facilities[i].level;
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


    public getMyFacilityByType(cityId:number = 0,type:number = 0):any{
        var facility = this.getMyFacility(cityId);
        if(facility){
            for(var i = 0;i < facility.length;i++){
                if(type == facility[i].type){
                    return facility[i];
                }
            }
        }
        return null;
    }


    public setAllFacilityCfg(jsonAsset:any):void{
        this._facilityConfig = new Map();
        
        var _facilityConfig = {};
        // console.log("setAllFacilityConfig--asset:",jsonAsset);
        for(var i = 0;i < jsonAsset.length;i++){
            var asset = jsonAsset[i];
            _facilityConfig[asset._name] = asset.json;
        }


        for(var i = 0; i < _facilityConfig.facility.list.length;i++){
            var obj = new FacilityConfig();
            obj.type = _facilityConfig.facility.list[i].type;
            obj.name = _facilityConfig.facility.list[i].name;
            this._facilityConfig.set(obj.type,obj);
        }


        delete _facilityConfig["facility"];

        var facility:FacilityConfig = null;
        for(var key in _facilityConfig){
            var jsonData = _facilityConfig[key];
            if(jsonData.type != undefined){
                facility = this._facilityConfig.get(jsonData.type);
                facility.json = jsonData;
                facility.mLevel = jsonData.levels.length;

                this._facilityConfig.set(jsonData.type,facility);
            }

            else{
                for(var jsonKey in jsonData){
                    if(jsonKey == "title"){
                        continue;
                    }
                    facility = this._facilityConfig.get(jsonData[jsonKey].type);
                    facility.json = jsonData[jsonKey];
                    facility.mLevel = jsonData[jsonKey].levels.length;

                    this._facilityConfig.set(jsonData[jsonKey].type,facility);
                } 
            }
        }

        _facilityConfig = null;
        console.log("this._facilityConfig:",this._facilityConfig);
    }


    public getFacilityCfgByType(type:number = 0):FacilityConfig{
        return this._facilityConfig.get(type);
    }




}