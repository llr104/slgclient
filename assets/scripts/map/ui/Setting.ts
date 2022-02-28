
import { _decorator, Component, Toggle } from 'cc';
import { AudioManager } from '../../common/AudioManager';
const { ccclass, property } = _decorator;


@ccclass('Setting')
export class Setting extends Component {
    
    @property(Toggle)
    protected music:Toggle = null;
    
    @property(Toggle)
    protected sound:Toggle = null;

    onLoad(){
        let isMusic = AudioManager.instance.getConfiguration(true);
        this.music.isChecked = isMusic;

        let isSound = AudioManager.instance.getConfiguration(false);
        this.sound.isChecked = isSound;
    }

    onClickClose() {
        AudioManager.instance.playClick();
        this.node.active = false;
    }

    onClickMusic(){
        AudioManager.instance.playClick();

        if(this.music.isChecked){
            AudioManager.instance.openMusic();
        }else{
            AudioManager.instance.closeMusic();
        }
        
    }

    onClickSound(){
        AudioManager.instance.playClick();
        if(this.sound.isChecked){
            AudioManager.instance.openSound();
        }else{
            AudioManager.instance.closeSound();
        }
    }
}

