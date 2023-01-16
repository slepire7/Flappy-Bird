import { Interface } from '../interface/base'
import { Config } from '../config';

export class FlappyBird implements Interface.Elements.IFlappybird {
    public frameAtual: number = 0;
    public spriteX: number = 0;
    public spriteY: number = 0;
    public largura: number = 33;
    public altura: number = 24;
    public x: number = 10;
    public y: number = 50;
    public gravidade: number = 0.25;
    public velocidade: number = 0;
    public pulo: number = 4.5;
    pula() {
        Config.TrilhasSonoras.PULO().play();
        this.velocidade = - this.pulo
    };
    movimentos: Interface.Utils.Movimento[] = [
        { spriteX: 0, spriteY: 0, }, // asa pra cima
        { spriteX: 0, spriteY: 26, }, // asa no meio 
        { spriteX: 0, spriteY: 52, }, // asa pra baixo
        { spriteX: 0, spriteY: 26, }, // asa no meio 
    ];
    atualizaOFrameAtual() {
        const intervaloDeFrames = 10;
        const passouOIntervalo = Config.Frames % intervaloDeFrames === 0;

        if (passouOIntervalo) {
            const baseDoIncremento = 1;
            const incremento = baseDoIncremento + this.frameAtual;
            const baseRepeticao = this.movimentos.length;
            this.frameAtual = incremento % baseRepeticao
        }
    };
    desenha: Function = () => {
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
    atualiza(action: Function, _engine: Interface.Utils.Globais) {
        this.atualizaOFrameAtual();
        if (Config.fazColisao(this, _engine.chao)) {
            Config.TrilhasSonoras.CAIU().play()
            action();
            return;
        }
        this.velocidade = this.velocidade + this.gravidade;
        this.y = this.y + this.velocidade;
    }
}
