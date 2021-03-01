import { ServerConfig } from "../config/ServerConfig";
import { NetManager } from "../network/socket/NetManager";
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
       cc.systemEvent.on(ServerConfig.skill_list, this.onSkillList, this)
    }

    protected _proxy: SkillProxy = new SkillProxy();

    public onDestory(): void {
        cc.systemEvent.targetOff(this);
    }

    public get proxy(): SkillProxy {
        return this._proxy;
    }


    public qrySkillList(): void {
        let sendData: any = {
            name: ServerConfig.skill_list,
            msg: {}
        };
        NetManager.getInstance().send(sendData);
    }
    

    protected onSkillList(data: any): void {
        console.log("onSkillList", data);
        if (data.code == 0) {
            this._proxy.updateSkills(data.msg.list);
            cc.systemEvent.emit("skill_list_info");
        }
    }
}