import { Interface } from "../interface/base";
import { Config } from "../config";
import { FlappyBird } from "../elements/flappybird";
import { Chao } from '../elements/chao';
import { Cano } from '../elements/cano';
import { PlanoDeFundo } from '../elements/plano_fundo';
import { Placar, MainScoreGame } from '../elements/placar';
import { Service } from "../service/scoreapiService";
export namespace Game.Main {
    const Engine: Interface.Utils.Globais = {}
    export const Telas: Interface.Utils.Pages = {
        INICIO: {
            inicializa() {
                Engine.flappyBird = new FlappyBird();
                Engine.chao = new Chao();
                Engine.canos = new Cano();
            },
            desenha() {
                new PlanoDeFundo().desenha();

                Engine.flappyBird.desenha();

                Engine.chao.desenha();

                mensagemGetReady.desenha();
            },
            click() {
                mudaParaTela(Telas.JOGO);
            },
            atualiza() {

                Engine.chao.atualiza();
            }
        },
        JOGO: {
            inicializa() {
                Engine.placar = new Placar();
            },
            desenha() {
                new PlanoDeFundo().desenha();
                Engine.canos.desenha();
                Engine.chao.desenha();
                Engine.flappyBird.desenha();
                Engine.placar.desenha();
            },
            click() {
                Engine.flappyBird.pula();
            },
            atualiza() {
                if (Config.IsPause) return;
                Engine.canos.atualiza(TelaCondicional(Telas.GAME_OVER), Engine.flappyBird, Engine.placar);
                Engine.chao.atualiza();
                Engine.flappyBird.atualiza(TelaCondicional(Telas.GAME_OVER), Engine);
            }
        },
        GAME_OVER: {
            inicializa() {
            },
            desenha() {
                if (mensagemGameOver.desenha)
                    mensagemGameOver.desenha();

                new MainScoreGame().desenha();
            },
            atualiza() {

            },
            click() {
                mudaParaTela(Telas.INICIO);
            }
        }
    }

    export function mudaParaTela(page: Interface.Utils.IPageGame) {
        TelaAtiva = page;
        TelaAtiva.inicializa();
    }
    export function TelaCondicional(page: Interface.Utils.IPageGame) {
        return () => mudaParaTela(page);
    }
    export let TelaAtiva: Interface.Utils.IPageGame = {
        click: () => {
        },
        atualiza: () => {
        },
        desenha: () => {
        },
        inicializa: () => {
        }
    }

    const mensagemGetReady: Interface.Elements.IMessage = {
        spriteX: 134,
        spriteY: 0,
        largura: 174,
        altura: 152,
        x: (Config.canvas.width / 2) - 174 / 2,
        y: 50,
        desenha() {
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
    const mensagemGameOver: Interface.Elements.IMessage = {
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
            Service.HttpService.AtualizaPontuacao();
            Config.Method.ClearMemory();
        }
    }
}