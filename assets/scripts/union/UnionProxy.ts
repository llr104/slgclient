
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
    
}


export class Union {
    id:number = 0;
    name: string = "";
    cnt: number = 0;
    notice: string = "";
    major:Member[] = []
}


export default class UnionProxy {

    private _unionMap:Map<number,Union> = new Map<number,Union>();
    private _menberMap:Map<number,Member[]> = new Map<number,Member[]>();
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
        return obj
    }


    public getUnionList():Union[]{
        return Array.from(this._unionMap.values());
    }


    public updateMemberList(id:number,data:any[]):void{
        var member:Member[] = [];
        for(var i = 0; i < data.length ;i++){
            var obj = this.createMember(data[i]);
            member.push(obj);
        }
        this._menberMap.set(id,member);
    }


    public getMemberList(id:number):Member[]{
        return this._menberMap.get(id);
    }
}