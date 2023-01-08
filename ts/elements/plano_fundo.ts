import { Interface } from "../interface/base";
import { Config } from "../config";
export class PlanoDeFundo implements Interface.Utils.IBaseModel {
    spriteX: number;
    spriteY: number;
    largura: number;
    altura: number;
    x: number;
    y: number;
    /**
     *
     */
    constructor() {
        this.spriteX = 390;
        this.spriteY = 0;
        this.largura = 275;
        this.altura = 204;
        this.x = 0;
        this.y = Config.canvas.height - 204;

    }
    desenha() {
        Config.contexto.fillStyle = '#70c5ce';
        Config.contexto.fillRect(0, 0, Config.canvas.width, Config.canvas.height)
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
        })
    }
    atualiza(): void {
    }

}
