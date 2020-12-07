/**服务器接口配置*/
const ServerConfig = {
    account_login: "account.login",
    account_logout: "account.logout",
    account_reLogin: "account.reLogin",
    
    role_create: "role.create",
    role_roleList: "role.roleList",
    role_enterServer: "role.enterServer",
    role_myCity: "role.myCity",
    role_myRoleRes: "role.myRoleRes",
    role_myProperty: "role.myProperty",
    role_upPosition:"role.upPosition",

    nationMap_config: "nationMap.config",
    nationMap_scanBlock: "nationMap.scanBlock",
    nationMap_giveUp: "nationMap.giveUp",

    city_facilities: "city.facilities",
    city_upFacility: "city.upFacility",
    city_upCity: "city.upCity",

    general_myGenerals: "general.myGenerals",
    general_dispose: "general.dispose",
    general_armyList: "general.armyList",
    general_conscript: "general.conscript",
    general_assignArmy: "general.assignArmy",
    general_drawGeneral: "general.drawGeneral",
    general_composeGeneral: "general.composeGeneral",
    general_addPrGeneral: "general.addPrGeneral",

    war_report:"war.report",
    war_read:"war.read",

    coalition_create:"coalition.create",
    coalition_join:"coalition.join",
    coalition_list:"coalition.list",
    coalition_member:"coalition.member",
    

    war_reportPush:"warReport.push",
    general_push: "general.push",
    army_push: "army.push",
    roleBuild_push:"roleBuild.push",
    roleCity_push:"roleCity.push",
    facility_push:"facility.push",
    roleRes_push:"roleRes.push",
}


export { ServerConfig };