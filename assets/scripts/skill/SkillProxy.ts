import { SkillConf, SkillOutline } from "../config/skill/Skill";


export default class SkillProxy {

    protected skillConfs: SkillConf[] = [];
    protected skillOutLine: SkillOutline;

    public initSkillConfig(cfgs: any[]): void {
       
        for (let i: number = 0; i < cfgs.length; i++) {
        
            if (cfgs[i]._name == "skill_outline") {
                console.log("skill_outline");
                this.skillOutLine = cfgs[i].json;
            } else {
                this.skillConfs.push(cfgs[i].json);
            }
        }
    }

}
