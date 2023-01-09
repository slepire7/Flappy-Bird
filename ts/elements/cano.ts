import { Interface } from "../interface/base";
import { Config } from '../config'
import { Storage } from "../storage";


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
        this.espaco = 90;
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
            const canoChaoY = this.altura + this.espaco + yRandom;
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
        const Desconto = 2;
        const cabecaDoFlappy = _flappyBird.y - Desconto;
        const peDoFlappy = _flappyBird.y + _flappyBird.altura - Desconto;

        if ((_flappyBird.x + _flappyBird.largura) >= par.x) {
            if (cabecaDoFlappy <= (par.canoCeu.y - Desconto) || peDoFlappy >= par.canoChao.y) {
                return true;
            }
        }
        return false;
    };
    atualiza(action: Function, _flappyBird: Interface.Elements.IFlappybird, _placar: Interface.Elements.IPlacar) {

        const _Frames = intervaloFrames[Config.Method.randomIntFromInterval(0, intervaloFrames.length - 1)]
        const passouFrames = Config.frames % _Frames == 0;
        if (passouFrames)
            this.pares.push({
                x: Config.canvas.width,
                y: -150 * (Math.random() + 1),
            });

        for (let par of this.pares) {
            const currentPoint = Storage.Get<number>(Config.KeyNameStorage.currentPoint) || 0;
            par.x = par.x - Velocidades.dispach(currentPoint);

            if (this.temColisaoComOFlappyBird(par, _flappyBird)) {
                Config.TrilhasSonoras.HIT().play();
                action();
            }

            if (par.x + this.largura <= 0) {
                this.pares.shift();
                _placar.atualiza();
            }
        }

    }
}

const intervaloFrames = [
    150
]
const dificuldade_velocidade = {
    "20": 2,
    "40": 2.5,
    "80": 4,
    "100": 4.5,
    "110": 5,
    "120": 6,
    "130": 7,
    "140": 8,
    "150": 9,
    "200": 10
}
const Velocidades = {
    dispach: (pontuacao: number) => {
        const keys = Object.keys(dificuldade_velocidade).map(itm => new Number(itm));
        const field = keys.find(key => key >= pontuacao) || keys[keys.length - 1]
        const difcultades = dificuldade_velocidade[field as keyof object];

        return difcultades
    },
};
