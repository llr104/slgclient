// //因为适配的原因，背景和界面其他元素是分离的，
// //那么背景的缩放包括场景图片背景和弹窗半透明黑色背景都可以挂这个脚本进行缩放

import { _decorator, Component, Enum, Widget, UITransform, game, view, Canvas } from 'cc';
const { ccclass, property } = _decorator;

export enum BgScaleType {
    FULL_SCREEN = 1,
    SCALE_BY_WIDTH = 2,
    SCALE_BY_HEIGHT = 3,
    SCALE_ONLY_WIDTH = 4,
    SCALE_ONLY_HEIGHT = 5,
};
// //bg对齐方位
export enum BgAlignmentType {
    TOP = 1,
    BOTTOM = 2,
    CENTER = 3,
    LEFT = 4,
    RIGHT = 5
};

@ccclass('BgLogic')
export default class BgLogic extends Component {
    @property({ type: Enum(BgScaleType) })
    scaleType: BgScaleType = BgScaleType.FULL_SCREEN;
    @property({ type: Enum(BgAlignmentType) })
    alignmentType: BgAlignmentType = BgAlignmentType.CENTER;
    protected _realW: number = 0;
    protected _realH: number = 0;
    protected onLoad(): void {
        this._realW = this.node.getComponent(UITransform).width;
        this._realH = this.node.getComponent(UITransform).height;

        this.updateFrameSize();
    }


    protected updateFrameSize(): void {

        let scaleW: number = view.getVisibleSize().width / this._realW;
        let scaleH: number = view.getVisibleSize().height / this._realH;
        let scaleX: number = 1;
        let scaleY: number = 1;
        if (this.scaleType == BgScaleType.SCALE_BY_WIDTH) {
            scaleX = scaleY = scaleW;
        } else if (this.scaleType == BgScaleType.SCALE_BY_HEIGHT) {
            scaleX = scaleY = scaleH;
        } else if (this.scaleType == BgScaleType.SCALE_ONLY_WIDTH) {
            scaleX = scaleW;
            scaleY = 1;
        } else if (this.scaleType == BgScaleType.SCALE_ONLY_HEIGHT) {
            scaleX = 1;
            scaleY = scaleH;
        } else {
            scaleX = scaleY = Math.max(scaleW, scaleH);
        }

        this.node.getComponent(UITransform).width = this._realW * scaleX;
        this.node.getComponent(UITransform).height = this._realH * scaleY;

        let widget: Widget = this.node.getComponent(Widget);
        
       
        if (widget == null) {
            widget = this.node.addComponent(Widget);
        }
      

        if (this.alignmentType == BgAlignmentType.BOTTOM) {
            widget.isAlignHorizontalCenter = true;
            widget.isAlignBottom = true;
            widget.bottom = 0;
        } else if (this.alignmentType == BgAlignmentType.TOP) {
            widget.isAlignHorizontalCenter = true;
            widget.isAlignTop = true;
            widget.top = 0;
        } else if (this.alignmentType == BgAlignmentType.LEFT) {
            widget.isAlignVerticalCenter = true;
            widget.isAlignLeft = true;
            widget.left = 0;
        } else if (this.alignmentType == BgAlignmentType.RIGHT) {
            widget.isAlignVerticalCenter = true;
            widget.isAlignRight = true;
            widget.right = 0;
        } else if (this.alignmentType == BgAlignmentType.CENTER) {
            widget.isAlignHorizontalCenter = true;
            widget.isAlignVerticalCenter = true;
        }
    }
}

