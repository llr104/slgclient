import { MapBuild } from "./MapProxy";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ArmyLogic extends cc.Component {

    @property(cc.SpriteAtlas)
    buildAtlas: cc.SpriteAtlas = null;

    protected _data: MapBuild = null;

    protected onLoad(): void {

    }

    protected onDestroy(): void {

    }

    public setBuildData(data: MapBuild): void {

    }
}