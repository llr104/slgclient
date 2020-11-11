const { ccclass, property } = cc._decorator;
export enum ArmyAction {
    Wait,
    Run
}

@ccclass
export default class ArmyLogic extends cc.Component {

    @property(cc.Animation)
    ani: cc.Animation = null;

    public speed: number = 100;
    public mapPointX: number = 0;
    public mapPointY: number = 0;

    protected _curAction: ArmyAction = ArmyAction.Wait;

    protected onLoad(): void {

    }

    protected onDestroy(): void {

    }

    public run(endPoint: cc.Vec2): boolean {
        if (endPoint.x == this.mapPointX && endPoint.y == this.mapPointY) {
            return false;
        }
    }
}