
const { ccclass, property } = cc._decorator;

@ccclass
export default class LoadingLogic extends cc.Component {
    @property(cc.ProgressBar)
    bar: cc.ProgressBar = null;

    protected onLoad(): void {
        this.bar.progress = 0;
        cc.systemEvent.on("load_progress", this.onProgress, this);
        cc.systemEvent.on("load_complete", this.onComplete, this);
    }

    protected onDestroy(): void {
        cc.systemEvent.targetOff(this);
    }

    protected onProgress(precent: number): void {
        this.bar.progress = precent;
    }

    protected onComplete(): void {
        this.node.parent = null;
    }
}
