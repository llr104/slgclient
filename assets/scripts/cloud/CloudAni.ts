
import { _decorator, Component, Node, UITransform, Vec2, Vec3, tween } from 'cc';
const { ccclass, property } = _decorator;


@ccclass('CloudAni')
export class CloudAni extends Component {
    
    @property(Node)
    leftNode: Node = null;

    @property(Node)
    rightNode: Node = null;

    onEnable(){
        console.log("CloudAni onEnable");
        let aniTime = 0.5;
        this.leftNode.setPosition(new Vec3(-60, 0, 0));
        this.rightNode.setPosition(new Vec3(600, 0, 0));

        let lt = tween(this.leftNode).to(aniTime, { position: new Vec3(-700, 0, 0) });
        lt.start();

        let rt = tween(this.rightNode).to(aniTime, { position: new Vec3(1300, 0, 0) });
        rt.start();

        this.scheduleOnce(()=>{
            this.node.active = false;
        }, aniTime);
    }

}


