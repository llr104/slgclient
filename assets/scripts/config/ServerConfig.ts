/**服务器接口配置*/
const ServerConfig = {
    account_login: "account.login",
    account_logout: "account.logout",
    account_reLogin: "account.reLogin",
    account_robLogin:"robLogin",
    
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
    nationMap_build: "nationMap.build",
    nationMap_upBuild: "nationMap.upBuild",
    nationMap_delBuild: "nationMap.delBuild",

    city_facilities: "city.facilities",
    city_upFacility: "city.upFacility",


    general_myGenerals: "general.myGenerals",
    general_drawGeneral: "general.drawGeneral",
    general_composeGeneral: "general.composeGeneral",
    general_addPrGeneral: "general.addPrGeneral",

    army_myList: "army.myList",
    army_myOne: "army.myOne",
    army_dispose: "army.dispose",
    army_conscript: "army.conscript",
    army_assign: "army.assign",

    war_report:"war.report",
    war_read:"war.read",

    union_create:"union.create",
    union_join:"union.join",
    union_list:"union.list",
    union_member:"union.member",
    union_applyList:"union.applyList",
    union_dismiss:"union.dismiss",
    union_verify:"union.verify",
    union_exit:"union.exit",
    union_kick:"union.kick",
    union_appoint:"union.appoint",
    union_abdicate:"union.abdicate",
    union_modNotice:"union.modNotice",
    union_info:"union.info",
    union_log:"union.log",
    union_apply_push: "unionApply.push",
    
    interior_collection: "interior.collection",
    interior_transform: "interior.transform",

    war_reportPush:"warReport.push",
    general_push: "general.push",
    army_push: "army.push",
    roleBuild_push:"roleBuild.push",
    roleCity_push:"roleCity.push",
    facility_push:"facility.push",
    roleRes_push:"roleRes.push",


    chat_login:"chat.login",
    chat_chat:"chat.chat",
    chat_history:"chat.history",
    chat_join:"chat.join",
    chat_exit:"chat.exit",
    chat_push:"chat.push",
}


export { ServerConfig };