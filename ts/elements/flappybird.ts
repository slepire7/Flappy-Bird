import { Globais, IFlappybird, Movimento } from '../interface/base'
import { Config } from '../config';

export class flappyBird implements IFlappybird {
    _engine: Globais;
    constructor(Engine: Globais) {
        this._engine = Engine;
    }
    public frameAtual: number = 0;
    public spriteX: number = 0;
    public spriteY: number = 0;
    public largura: number = 33;
    public altura: number = 24;
    public x: number = 10;
    public y: number = 50;
    public gravidade: number = 0.25;
    public velocidade: number = 0;
    public pulo: number = 4;
    pula() {
        Config.TrilhasSonoras.PULO().play();
        this.velocidade = - this.pulo
    };
    movimentos: Movimento[] = [
        { spriteX: 0, spriteY: 0, }, // asa pra cima
        { spriteX: 0, spriteY: 26, }, // asa no meio 
        { spriteX: 0, spriteY: 52, }, // asa pra baixo
        { spriteX: 0, spriteY: 26, }, // asa no meio 
    ];
    atualizaOFrameAtual() {
        const intervaloDeFrames = 10;
        const passouOIntervalo = Config.frames % intervaloDeFrames === 0;

        if (passouOIntervalo) {
            const baseDoIncremento = 1;
            const incremento = baseDoIncremento + this.frameAtual;
            const baseRepeticao = this.movimentos.length;
            this.frameAtual = incremento % baseRepeticao
        }
    };
    desenha: Function = () => {
        this.atualizaOFrameAtual();
        const { spriteX, spriteY } = this.movimentos[this.frameAtual];
        Config.Draw({
            spriteX: spriteX,
            spriteY: spriteY,
            altura: this.altura,
            largura: this.largura,
            x: this.x,
            y: this.y
        });
    };
    atualiza: Function = (action: Function) => {
        if (!this._engine.chao) return;
        
        if (Config.fazColisao(this, this._engine.chao)) {
            Config.TrilhasSonoras.CAIU().play()
            action();
            return;
        }
        this.velocidade = this.velocidade + this.gravidade;
        this.y = this.y + this.velocidade;
    }
}
