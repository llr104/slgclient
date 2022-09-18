
import { _decorator, Component, tween, Vec3, UIOpacity } from 'cc';
const { ccclass, property } = _decorator;


@ccclass('PanelOut')
export class PanelOut extends Component {
    onEnable(){
        console.log("PanelOut onEnable");
        this.node.getComponent(UIOpacity).opacity = 125;
        let lt = tween(this.node.getComponent(UIOpacity)).to(0.2, { opacity: 255 }, { easing: 'sineOut' })
        lt.start();
    }
}

