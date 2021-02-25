import { SkillConf, SkillOutline } from "../config/skill/Skill";


export default class SkillProxy {

    private _skillCfgMap:Map<number, SkillConf> = new Map<number, SkillConf>();
    protected _skillConfs: SkillConf[] = [];
    protected _skillOutLine: SkillOutline;

    public initSkillConfig(cfgs: any[]): void {
        this._skillConfs = [];
        this._skillCfgMap.clear();
        
        for (let i: number = 0; i < cfgs.length; i++) {
        
            if (cfgs[i]._name == "skill_outline") {
                console.log("skill_outline");
                this._skillOutLine = cfgs[i].json;
            } else {
                this._skillConfs.push(cfgs[i].json);
                this._skillCfgMap.set(cfgs[i].json.cfgId, cfgs[i].json);
            }
        }
    }

    public get skills(): SkillConf[] {
        return this._skillConfs;
    }

    public get outLine(): SkillOutline {
        return this._skillOutLine;
    }

    public getSkillCfg(cfgId:number): SkillConf{
        if(this._skillCfgMap.has(cfgId)){
            return this._skillCfgMap.get(cfgId);
        }else{
            return null;
        }
    }

}
