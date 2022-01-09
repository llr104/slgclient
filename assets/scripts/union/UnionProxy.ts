import { _decorator } from 'cc';
import LoginCommand from "../login/LoginCommand";
import { Role } from "../login/LoginProxy";
import { MapCityData } from "../map/MapCityProxy";
import MapCommand from "../map/MapCommand";

export class Apply {
    id: number = 0;
    rid: number = 0;
    nick_name: string = "";
}


export class Member {
    rid: number = 0;
    name: string = "";
    title: number = 0;
    public get titleDes() : string {
        if(this.title == 0){
            return "盟主";
        }

        if(this.title == 1){
            return "副盟主";
        }

        return "普通成员"
    }
    x:number = 0;
    y:number = 0;
    
}


export class Union {
    id:number = 0;
    name: string = "";
    cnt: number = 0;
    notice: string = "";
    major:Member[] = [];


    public getChairman():Member{
        var major:Member[] = this.major.concat();
        for(var i = 0;i < major.length;i++){
            if(major[i].title == 0){
                return major[i];
            }
        }
        return new Member()
    }

    public getViceChairman():Member{
        var major:Member[] = this.major.concat();
        for(var i = 0;i < major.length;i++){
            if(major[i].title == 1){
                return major[i];
            }
        }
        return new Member()
    }

    public isMajor(rid:number):boolean{
        var major:Member[] = this.major.concat();
        for(var i = 0;i < major.length;i++){
            if(major[i].rid == rid){
                return true
            }
        }
        return false
    }
}


export default class UnionProxy {

    private _unionMap:Map<number,Union> = new Map<number,Union>();
    private _menberMap:Map<number,Member[]> = new Map<number,Member[]>();
    private _applyMap:Map<number,Apply[]> = new Map<number,Apply[]>();

    public clearData(): void {
        this._unionMap.clear();
        this._menberMap.clear();
    }

    public updateUnionList(data:any[]):void{
        this._unionMap.clear();
        for(var i = 0; i < data.length ;i++){
            var obj = this.createUnion(data[i]);
            this._unionMap.set(obj.id,obj);
        }
    }

    protected createUnion(data:any):Union{
        var obj = new Union();
        obj.id = data.id;
        obj.name = data.name;
        obj.cnt = data.cnt;
        obj.notice = data.notice;
        obj.major = data.major.concat();
        return obj
    }

    protected createMember(data:any):Member{
        var obj = new Member();
        obj.rid = data.rid;
        obj.name = data.name;
        obj.title = data.title;
        obj.x = data.x;
        obj.y = data.y;
        return obj
    }


    public getUnionList():Union[]{
        return Array.from(this._unionMap.values());
    }


    public updateMemberList(id:number,data:any[]):void{
        var member:Member[] = [];
        var union = this._unionMap.get(id);
        if(union != null){
            union.major = []
        }
        for(var i = 0; i < data.length ;i++){
            var obj = this.createMember(data[i]);
            member.push(obj);

            if(obj.title == 0 || obj.title == 1){
                union.major.push(obj)
            }
        }
        this._menberMap.set(id,member);
    }

    public updateNotice(unionid:number,text:string):void{
        let union:Union = this._unionMap.get(unionid);
        if(union){
            union.notice = text
        }
    }

    public updateApplyList(id:number,data:any[]):void{
        var apply:Apply[] = [];
        for(var i = 0; i < data.length ;i++){
            var obj = data[i]
            apply.push(obj);
        }
        this._applyMap.set(id,apply);
    }

    public updateApply(id:number,data:any):void{
        var apply = this._applyMap.get(id);
        if (apply != null) {
            apply.push(data)
            this._applyMap.set(id, apply)
        }else{
            var t = []
            t.push(data)
            this.updateApplyList(id, t)
        }
    }

    public isChairman(unionid:number,rid:number):boolean{
        let union:Union = this._unionMap.get(unionid);
        if(!union){
            return false;
        }

        var major:Member[] = union.major.concat();
        for(var i = 0;i < major.length;i++){
            if(major[i].rid == rid && major[i].title == 0){
                return true;
            }
        }

        return false;
    }

    public isMeInUnion():boolean{
        let city:MapCityData = MapCommand.getInstance().cityProxy.getMyMainCity();
        return city.unionId > 0?true:false; 
    }

    public isMeChairman(unionid:number):boolean{
        var roleData:Role = LoginCommand.getInstance().proxy.getRoleData();
        return this.isChairman(unionid,roleData.rid);
    }

    public getMemberList(id:number):Member[]{
        return this._menberMap.get(id);
    }

    public getUnion(id:number = 0):Union{
        return this._unionMap.get(id);
    }

    public getApplyCnt(id:number = 0):number{
        let t = this._applyMap.get(id);
        if (t == null){
            return 0
        }
        console.log("getApplyCnt:", t)
        return t.length
    }
}
