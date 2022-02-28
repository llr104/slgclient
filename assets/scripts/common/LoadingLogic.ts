import { _decorator, Component, ProgressBar } from 'cc';
import { CoreEvent } from '../core/coreEvent';
import { EventMgr } from '../utils/EventMgr';

const { ccclass, property } = _decorator;

@ccclass('LoadingLogic')
export default class LoadingLogic extends Component {
    @property(ProgressBar)
    bar: ProgressBar | null = null;
    protected onLoad(): void {
        this.bar.progress = 0;
        EventMgr.on(CoreEvent.loadProgress, this.onProgress, this);
        EventMgr.on(CoreEvent.loadComplete, this.onComplete, this);
    }
    protected onDestroy(): void {
        EventMgr.targetOff(this);
    }
    protected onProgress(precent: number): void {
        this.bar.progress = precent;
    }
    protected onComplete(): void {
        this.node.parent = null;
    }
}


