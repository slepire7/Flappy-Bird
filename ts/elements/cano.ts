import { Interface } from "../interface/base";
import { Config } from '../config'


export class Cano implements Interface.Elements.ICano {
    largura: number;
    altura: number;
    espaco: number;
    chao: Interface.Utils.Movimento;
    ceu: Interface.Utils.Movimento;
    pares: Interface.Utils.Dimensoes[];
    constructor() {
        this.largura = 52;
        this.altura = 400;
        this.espaco = 80;
        this.chao = {
            spriteX: 0,
            spriteY: 169,
        };
        this.ceu = {
            spriteX: 52,
            spriteY: 169,
        };
        this.pares = [];
    }
    desenha() {
        this.pares.forEach((par) => {
            const yRandom = par.y;
            const espacamentoEntreCanos = 90;
            const canoCeuX = par.x;
            const canoCeuY = yRandom;
            // [Cano do Céu]
            Config.Draw({
                spriteX: this.ceu.spriteX,
                spriteY: this.ceu.spriteY,
                largura: this.largura,
                altura: this.altura,
                x: canoCeuX,
                y: canoCeuY,
            })
            // [Cano do Chão]
            const canoChaoX = par.x;
            const canoChaoY = this.altura + espacamentoEntreCanos + yRandom;
            Config.Draw({
                spriteX: this.chao.spriteX,
                spriteY: this.chao.spriteY,
                largura: this.largura,
                altura: this.altura,
                x: canoChaoX,
                y: canoChaoY,
            });
            par.canoCeu = {
                x: canoCeuX,
                y: this.altura + canoCeuY
            }
            par.canoChao = {
                x: canoChaoX,
                y: canoChaoY
            }
        })
    };
    temColisaoComOFlappyBird(par: Interface.Utils.Dimensoes, _flappyBird: Interface.Elements.IFlappybird) {

        const cabecaDoFlappy = _flappyBird.y;
        const peDoFlappy = _flappyBird.y + _flappyBird.altura;
        if ((_flappyBird.x + _flappyBird.largura) >= par.x) {
            ///@ts-ignore
            if (cabecaDoFlappy <= par.canoCeu.y || peDoFlappy >= par.canoChao.y) {
                return true;
            }
        }
        return false;
    };
    atualiza(action: Function, _flappyBird: Interface.Elements.IFlappybird) {
        const passou100Frames = Config.frames % 100 === 0;
        if (passou100Frames) {
            this.pares.push({
                x: Config.canvas.width,
                y: -150 * (Math.random() + 1),
            });
        }

        this.pares.forEach((par) => {
            par.x = par.x - 2;

            if (this.temColisaoComOFlappyBird(par, _flappyBird)) {
                Config.TrilhasSonoras.HIT().play();
                action();
            }

            if (par.x + this.largura <= 0) {
                this.pares.shift();
            }
        });

    }

}
