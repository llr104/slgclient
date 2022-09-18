
import { _decorator, Component, Vec3, tween } from 'cc';
const { ccclass, property } = _decorator;


@ccclass('DialogOut')
export class DialogOut extends Component {
    
    onEnable(){
        console.log("DialogOut onEnable");
        this.node.setScale(new Vec3(0.2, 0.2, 0.2));
        let lt = tween(this.node).to(0.2, { scale: new Vec3(1, 1, 1) }, { easing: 'sineOut' })
        lt.start();
    }
}

