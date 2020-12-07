
export class Apply {
    id: number = 0;
    rid: number = 0;
    nick_name: string = "";
}


export class Member {
    rid: number = 0;
    name: string = "";
    title: string = "";
}


export class Union {
    name: string = "";
    cnt: number = 0;
    notice: string = "";
    major:Member[] = []
}


export default class UnionProxy {

    public clearData(): void {
    }
}