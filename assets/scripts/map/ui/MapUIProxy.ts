

/**设施*/
export class Facility {
    name: string = "";
    mLevel:number = 0;
    cLevel:number = 0;
    type:number = 0;
}

export default class MapUIProxy {
    protected _myFacility: Array<Facility> = null;

    public setMyFacility(data:any):void {
        this._myFacility = [];
        var facilities = data.facilities;
        console.log("facilities:",facilities)
        if(facilities){
            for(var i = 0;i < facilities.length;i++){
                var obj = new Facility();
                obj.name = facilities[i].name;
                obj.mLevel = facilities[i].mLevel;
                obj.cLevel = facilities[i].cLevel;
                obj.type = facilities[i].type;
                this._myFacility.push(obj);
            }
        }
       

    }


    public getMyFacility():Array<Facility>{
        return this._myFacility;
    }
}