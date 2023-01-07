import { Config } from "../config";
import { IBaseModel } from "../interface/base";
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
export class ScoreGame {
    constructor() {
        ScoreGame.none = {
            spriteX: 0,
            spriteY: 78,
            largura: 44,
            altura: 44,
            x: (Config.canvas.width / 2) / 2.4,
            y: 135,
            desenha() {
                Config.Draw({
                    spriteX: ScoreGame.none.spriteX,
                    spriteY: ScoreGame.none.spriteY,
                    largura: ScoreGame.none.largura,
                    altura: ScoreGame.none.altura,
                    x: ScoreGame.none.x,
                    y: ScoreGame.none.y
                })
            }
        }
        ScoreGame.bronze = {

            spriteX: 48,
            spriteY: 124,
            largura: 44,
            altura: 44,
            x: (Config.canvas.width / 2) / 2.4,
            y: 135,
            desenha() {
                Config.Draw({
                    spriteX: ScoreGame.bronze.spriteX,
                    spriteY: ScoreGame.bronze.spriteY,
                    largura: ScoreGame.bronze.largura,
                    altura: ScoreGame.bronze.altura,
                    x: ScoreGame.bronze.x,
                    y: ScoreGame.bronze.y
                })
            }
        }
        ScoreGame.prata =
        {
            spriteX: 48,
            spriteY: 78,
            largura: 44,
            altura: 44,
            x: (Config.canvas.width / 2) / 2.4,
            y: 135,
            desenha() {
                Config.Draw({
                    spriteX: ScoreGame.prata.spriteX,
                    spriteY: ScoreGame.prata.spriteY,
                    largura: ScoreGame.prata.largura,
                    altura: ScoreGame.prata.altura,
                    x: ScoreGame.prata.x,
                    y: ScoreGame.prata.y
                })
            }
        }
        ScoreGame.ouro = {
            spriteX: 0,
            spriteY: 124,
            largura: 44,
            altura: 44,
            x: (Config.canvas.width / 2) / 2.4,
            y: 135,
            desenha() {
                Config.Draw({
                    spriteX: ScoreGame.ouro.spriteX,
                    spriteY: ScoreGame.ouro.spriteY,
                    largura: ScoreGame.ouro.largura,
                    altura: ScoreGame.ouro.altura,
                    x: ScoreGame.ouro.x,
                    y: ScoreGame.ouro.y
                })
            }
        }
    }

    public static none: IBaseModel;
    public static bronze: IBaseModel;


    public static prata: IBaseModel;
    public static ouro: IBaseModel;

    static desenha() {
        const pontuacaoAtual = Storage.Get<number>(Config.KeyNameStorage.lastPoint);
        const bestPontuacao = Storage.Get<number>(Config.KeyNameStorage.bestPoint);
        Config.contexto.fillText(`${pontuacaoAtual}`, (Config.canvas.width / 3) * 2.4, 147);
        Config.contexto.fillText(`${bestPontuacao}`, (Config.canvas.width / 3) * 2.4, (Config.canvas.width / 3) * 1.9);
        if (pontuacaoAtual < 50) {
            ///@ts-ignore
            ScoreGame.none.desenha();
            return;
        }
        if (pontuacaoAtual <= 100) {
            ///@ts-ignore
            ScoreGame.bronze.desenha();
            return;
        }
        if (pontuacaoAtual <= 150) {
            ///@ts-ignore
            ScoreGame.prata.desenha();
            return;
        }
        if (pontuacaoAtual >= 200) {
            ///@ts-ignore
            ScoreGame.ouro.desenha();
            return;
        }
    }
}


