import { Config } from "../config";
import { Interface } from "../interface/base";
import { Storage } from "../storage";

export class Placar {
    pontuacao: number = 0;
    desenha() {
        Config.contexto.font = '35px "VT323"';
        Config.contexto.textAlign = 'right';
        Config.contexto.fillStyle = 'white';
        Config.contexto.fillText(`${this.pontuacao}`, Config.canvas.width - 10, 35);

        Storage.Set(Config.KeyNameStorage.lastPoint, this.pontuacao)

        let bestP = Storage.Get<number>(Config.KeyNameStorage.bestPoint),
            lastP = Storage.Get<number>(Config.KeyNameStorage.lastPoint);
        if (lastP > bestP)
            Storage.Set(Config.KeyNameStorage.bestPoint, this.pontuacao)

    };
    atualiza() {
        const intervaloDeFrames = 30;
        const passouOIntervalo = Config.frames % intervaloDeFrames === 0;

        if (passouOIntervalo) {
            Config.TrilhasSonoras.PONTO().play();
            this.pontuacao = this.pontuacao + 1;
        }
    }
}

export class Score implements Interface.Utils.IScore {
    constructor(
        _spriteX: number,
        _spriteY: number,
        _largura: number,
        _altura: number,
        _x: number,
        _y: number) {
        this.spriteX = _spriteX
        this.spriteY = _spriteY
        this.largura = _largura
        this.altura = _altura
        this.x = _x
        this.y = _y
    }
    desenha(): void {
        Config.Draw({
            spriteX: this.spriteX,
            spriteY: this.spriteY,
            largura: this.largura,
            altura: this.altura,
            x: this.x,
            y: this.y
        })
    }
    spriteX: number;
    spriteY: number;
    largura: number;
    altura: number;
    x: number;
    y: number;

}
export class MainScoreGame implements Interface.Utils.IScoreMain {
    none: Interface.Utils.IScore;
    bronze: Interface.Utils.IScore;
    prata: Interface.Utils.IScore;
    ouro: Interface.Utils.IScore;
    constructor() {
        const X_In_Screen = (Config.canvas.width / 2) / 2.4;
        const Y_In_Screen = 135;
        this.none = new Score(0, 78, 44, 44, X_In_Screen, Y_In_Screen);
        this.bronze = new Score(48, 124, 44, 44, X_In_Screen, Y_In_Screen);
        this.prata = new Score(48, 78, 44, 44, X_In_Screen, Y_In_Screen);
        this.ouro = new Score(0, 124, 44, 44, X_In_Screen, Y_In_Screen);
    }
    desenha() {
        const pontuacaoAtual = Storage.Get<number>(Config.KeyNameStorage.lastPoint);
        const bestPontuacao = Storage.Get<number>(Config.KeyNameStorage.bestPoint);
        Config.contexto.fillText(`${pontuacaoAtual}`, (Config.canvas.width / 3) * 2.4, 147);
        Config.contexto.fillText(`${bestPontuacao}`, (Config.canvas.width / 3) * 2.4, (Config.canvas.width / 3) * 1.9);
        if (pontuacaoAtual < 50) {

            this.none.desenha();
            return;
        }
        if (pontuacaoAtual <= 100) {

            this.bronze.desenha();
            return;
        }
        if (pontuacaoAtual <= 150) {

            this.prata.desenha();
            return;
        }
        if (pontuacaoAtual >= 200) {

            this.ouro.desenha();
            return;
        }
    }

}