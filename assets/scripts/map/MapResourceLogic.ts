const { ccclass, property } = cc._decorator;

@ccclass
export default class MapResourceLogic extends cc.Component {

    @property(cc.Prefab)
    armyPrefab: cc.Prefab = null;
    protected _army:cc.Node = null;

    protected onLoad(): void {
        
    }

    protected onDestroy(): void {
        cc.systemEvent.targetOff(this);
    }
}