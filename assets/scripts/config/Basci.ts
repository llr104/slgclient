// /**征兵相关**/
// /**武将相关**/

import { _decorator } from 'cc';
export class Conscript {
    cost_wood: number = 0;
    cost_iron: number = 0;
    cost_stone: number = 0;
    cost_grain: number = 0;
    cost_gold: number = 0;
}

export class General {
	physical_power_limit: number = 0;       //体力上限
	cost_physical_power: number = 0;        //消耗体力
	recovery_physical_power: number = 0;    //恢复体力
	reclamation_time: number = 0;           //屯田消耗时间，单位秒
	reclamation_cost: number = 0;           //屯田消耗政令
	draw_general_cost: number = 0;          //抽卡消耗金币
	pr_point: number = 0;                   //合成一个武将或者的技能点
	limit: number = 0;                      //武将数量上限
}

export class Role {
	wood: number = 0;
	iron: number = 0;
	stone: number = 0;
	grain: number = 0;
	gold: number = 0;
	decree: number = 0;
	wood_yield: number = 0;
	iron_yield: number = 0;
	stone_yield: number = 0;
	grain_yield: number = 0;
	gold_yield: number = 0;
	depot_capacity: number = 0;		 //仓库初始容量
	build_limit: number = 0;		 //野外建筑上限
	recovery_time: number = 0;
	decree_limit: number = 0;        //令牌上限
	collect_times_limit: number = 0; //每日征收次数上限
	collect_interval: number = 0;    //征收间隔
	pos_tag_limit: number = 0;       //位置标签上限
}

export class City {
    cost: number = 0;
    durable: number = 0;
	recovery_time: number = 0;
	transform_rate: number = 0;
}

export class Build {
	war_free: number = 0;       //免战时间，单位秒
	giveUp_time: number = 0;    //建筑放弃时间
	fortress_limit: number = 0; //要塞上限
}

export class Union {
	member_limit: number = 0;
}

export class NpcLevel  {
	soilders: number
}

export class Npc {
	levels: NpcLevel[]
}

export class Basic {
    conscript: Conscript;
    general: General;
    role: Role;
    city: City;
    build: Build;
    union: Union;
    npc: Npc;
}
