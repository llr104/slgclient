import SkillProxy from "./SkillProxy";

export default class SkillCommand {
    //单例
    protected static _instance: SkillCommand;
    public static getInstance(): SkillCommand {
        if (this._instance == null) {
            this._instance = new SkillCommand();
        }
        return this._instance;
    }

    public static destory(): boolean {
        if (this._instance) {
            this._instance.onDestory();
            this._instance = null;
            return true;
        }
        return false;
    }

    constructor() {
       
    }

    protected _proxy: SkillProxy = new SkillProxy();

    public onDestory(): void {
        cc.systemEvent.targetOff(this);
    }

    public get proxy(): SkillProxy {
        return this._proxy;
    }
}