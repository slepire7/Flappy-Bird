import { Interface } from "../interface/base";
import { Config } from '../config';

export class Chao implements Interface.Elements.IChao {
    spriteX: number;
    spriteY: number;
    largura: number;
    altura: number;
    x: number;
    y: number;

    constructor() {
        this.spriteX = 0;
        this.spriteY = 610;
        this.largura = 224;
        this.altura = 112;
        this.x = 0;
        this.y = Config.canvas.height - 112;

    }
    atualiza() {
        const movimentoDoChao = 1;
        const repeteEm = this.largura / 2;
        const movimentacao = this.x - movimentoDoChao;
        this.x = movimentacao % repeteEm;
    }
    desenha() {
        Config.Draw({
            spriteX: this.spriteX,
            spriteY: this.spriteY,
            largura: this.largura,
            altura: this.altura,
            x: this.x,
            y: this.y
        })
        Config.Draw({
            spriteX: this.spriteX,
            spriteY: this.spriteY,
            largura: this.largura,
            altura: this.altura,
            x: (this.x + this.largura),
            y: this.y
        });
    }
}
