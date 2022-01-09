// //技能大纲
// //技能配置

import { _decorator } from 'cc';
export class trigger {
	type: number
	des: string
}

export class triggerType {
	des: string
	list:trigger[] 
}

export class effect {
	type: number
	des: string
	isRate: boolean
}

export class effectType  {
	des: string
	list:effect[] 
}

export class target {
	type: number
	des: string
}

export class targetType {
	des: string
	list:target[] 
}

export class SkillOutline {
	trigger_type: triggerType 
	effect_type: effectType
	target_type: targetType
}

export class SkillLevel {
    probability: number     //发动概率
    effect_value:number[]   //效果值
    effect_round: number[]  //效果持续回合数
}

export class SkillConf {
	cfgId: number
	name: string
    des: string
    trigger: number //发起类型
    target: number  //目标类型
    limit: number   //可以被武将装备上限
    arms:number[]   //可以装备的兵种
    include_effect: number[] //技能包括的效果
    levels:SkillLevel[]
}
