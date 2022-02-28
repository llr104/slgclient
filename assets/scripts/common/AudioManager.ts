import { _decorator, AudioClip, AudioSource, assert, clamp01, warn, resources } from "cc";
import { LocalCache } from "../utils/LocalCache";



export class AudioManager {
    private static _instance: AudioManager;
    private static _audioSource?: AudioSource;

    static get instance () {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new AudioManager();
        return this._instance;
    }

    soundVolume: number = 1;

    // init AudioManager in GameRoot.
    init (audioSource: AudioSource) {
        this.soundVolume = this.getConfiguration(false) ? 1 : 0;
        AudioManager._audioSource = audioSource;
        
        if(this.getConfiguration(true)){
            this.openMusic();
        }else{
            this.closeMusic();
        }
    }

    getConfiguration (isMusic: boolean) {
        let state;
        if (isMusic) {
            state = LocalCache.getMusic();
        } else {
            state = LocalCache.getSound();
        }

        return state === undefined || state ? true : false;
    }

    /**
     * 播放音乐
     * @param {String} name 音乐名称可通过constants.AUDIO_MUSIC 获取
     * @param {Boolean} loop 是否循环播放
     */
    playMusic (loop: boolean) {
        
        const audioSource = AudioManager._audioSource!;
        assert(audioSource, 'AudioManager not inited!');

        audioSource.loop = loop;
        if (!audioSource.playing) {
            audioSource.play();
        }
    }

    /**
     * 播放音效
     * @param {String} name 音效名称可通过constants.AUDIO_SOUND 获取
     */
    playSound (name:string) {
        const audioSource = AudioManager._audioSource!;
        assert(audioSource, 'AudioManager not inited!');
        let path = '/audio/sound/';
        resources.load(path + name, AudioClip, (err, clip)=> {
            if (err) {
                warn('load audioClip failed: ', err);
                return;
            }

            audioSource.playOneShot(clip, this.soundVolume);
        });

    }

    playClick(){
        this.playSound("click");
    }

    setMusicVolume (flag: number) {
        console.log("setMusicVolume:", flag);
        const audioSource = AudioManager._audioSource!;
        assert(audioSource, 'AudioManager not inited!');

        flag = clamp01(flag);
        audioSource.volume = flag;
    }

    setSoundVolume (flag: number) {
        this.soundVolume = flag;
    }

    openMusic () {
        this.setMusicVolume(0.2);
        this.playMusic(true);
        LocalCache.setMusic(true);
    }

    closeMusic () {
        AudioManager._audioSource.stop();
        LocalCache.setMusic(false);
    }

    openSound () {
        this.setSoundVolume(1);
        LocalCache.setSound(true);
    }

    closeSound () {
        this.setSoundVolume(0);
        LocalCache.setSound(false);
    }
}
