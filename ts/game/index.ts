import { Globais, IBaseModel, IPageGame, Pages } from "../interface/base";
import { Config } from "../config";
import { flappyBird } from "../elements/flappybird";
import { Chao } from '../elements/chao';
import { Cano } from '../elements/cano';
import { PlanoDeFundo } from '../elements/plano_fundo';
import { Placar, ScoreGame } from '../elements/placar';
export namespace Game.Main {
    export const Engine: Globais = {}
    export const Telas: Pages = {
        INICIO: {
            inicializa() {
                Engine.flappyBird = new flappyBird(Engine);
                Engine.chao = new Chao();
                Engine.canos = new Cano(Engine.flappyBird);
            },
            desenha() {
                new PlanoDeFundo().desenha();
                //@ts-ignore
                Engine.flappyBird.desenha();
                //@ts-ignore
                Engine.chao.desenha();
                //@ts-ignore
                mensagemGetReady.desenha();
            },
            click() {
                mudaParaTela(Telas.JOGO);
            },
            atualiza() {
                //@ts-ignore
                Engine.chao.atualiza();
            }
        },
        JOGO: {
            inicializa() {
                Engine.placar = new Placar();
            },
            desenha() {
                new PlanoDeFundo().desenha();
                //@ts-ignore
                Engine.canos.desenha();
                //@ts-ignore
                Engine.chao.desenha();
                //@ts-ignore
                Engine.flappyBird.desenha();
                //@ts-ignore
                Engine.placar.desenha();
            },
            click() {
                //@ts-ignore
                Engine.flappyBird.pula();
            },
            atualiza() {
                //@ts-ignore
                Engine.canos.atualiza(TelaCondicional(Telas.GAME_OVER));
                //@ts-ignore
                Engine.chao.atualiza();
                //@ts-ignore
                Engine.flappyBird.atualiza(TelaCondicional(Telas.GAME_OVER));
                //@ts-ignore
                Engine.placar.atualiza();
            }
        },
        GAME_OVER: {
            inicializa() {
            },
            desenha() {
                if (mensagemGameOver.desenha)
                    mensagemGameOver.desenha();

                ScoreGame.desenha();
            },
            atualiza() {

            },
            click() {
                mudaParaTela(Telas.INICIO);
            }
        }
    }

    export function mudaParaTela(page: IPageGame) {
        TelaAtiva = page;
        if (TelaAtiva.inicializa)
            TelaAtiva.inicializa();
    }
    export function TelaCondicional(page: IPageGame) {
        return () => {
            TelaAtiva = page;
            if (TelaAtiva.inicializa)
                TelaAtiva.inicializa();
        }
    }
    export let TelaAtiva: IPageGame = {
        click: () => {
        },
        atualiza: () => {
        },
        desenha: () => {
        },
        inicializa: () => {
        }
    }

    const mensagemGetReady: IBaseModel = {
        spriteX: 134,
        spriteY: 0,
        largura: 174,
        altura: 152,
        x: (Config.canvas.width / 2) - 174 / 2,
        y: 50,
        desenha: () => {
            Config.Draw({
                spriteX: mensagemGetReady.spriteX,
                spriteY: mensagemGetReady.spriteY,
                largura: mensagemGetReady.largura,
                altura: mensagemGetReady.altura,
                x: mensagemGetReady.x,
                y: mensagemGetReady.y
            });
        }
    }
    const mensagemGameOver: IBaseModel = {
        spriteX: 134,
        spriteY: 153,
        largura: 226,
        altura: 200,
        x: (Config.canvas.width / 2) - 226 / 2,
        y: 50,
        desenha() {
            Config.Draw({
                spriteX: mensagemGameOver.spriteX,
                spriteY: mensagemGameOver.spriteY,
                largura: mensagemGameOver.largura,
                altura: mensagemGameOver.altura,
                x: mensagemGameOver.x,
                y: mensagemGameOver.y
            })
        }
    }
}