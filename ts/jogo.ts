import { Globais, IBaseModel, ICano, IFlappybird, IPageGame, Movimento, Pages, Dimensoes, ScoreGame } from './utils'
const isDeveloper = window.location.hostname.includes('localhost');
const TrilhasSonoras = {
    "HIT": () => new Audio(`${isDeveloper == false ? '../Flappy-Bird/' : '../'}assets/efeitos/hit.wav`),
    'PULO': () => new Audio(`${isDeveloper == false ? '../Flappy-Bird/' : '../'}assets/efeitos/pulo.wav`),
    'CAIU': () => new Audio(`${isDeveloper == false ? '../Flappy-Bird/' : '../'}assets/efeitos/caiu.wav`),
    'PONTO': () => new Audio(`${isDeveloper == false ? '../Flappy-Bird/' : '../'}assets/efeitos/ponto.wav`)
}
const sprites = new Image();
sprites.src = `${isDeveloper == false ? '../Flappy-Bird/' : '../'}assets/texture/sprites.png`;

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');
namespace Jogo {
    export const Globais: Globais = {}
    export let frames = 0;
    export const KeyNameStorage = {
        lastPoint: 'FlappyBird1.0Lp',
        bestPoint: 'FlappyBird1.0bp'
    }
    export function SetStorage(key: string, value: string) {
        localStorage.setItem(key, value);
    }
    export function GetStorage(key: string) {
        return localStorage.getItem(key);
    }
    export const Draw = (Model: IBaseModel) => {
        console.log(contexto)
        contexto.drawImage(
            sprites,
            Model.spriteX, Model.spriteY,
            Model.largura, Model.altura,
            Model.x, Model.y,
            Model.largura, Model.altura,
        )
    }
    export function fazColisao<A, B>(a: A, b: B) {
        let entityA = a as unknown as IBaseModel
        let entityB = b as unknown as IBaseModel
        const aY = entityA.y + entityA.altura;
        const bY = entityB.y;
        if (aY >= bY) {
            return true;
        }
        return false;
    }
    export function mudaParaTela(page: IPageGame) {
        Jogo.TelaAtiva = page;
        if (Jogo.TelaAtiva.inicializa)
            Jogo.TelaAtiva.inicializa();
    }
    export const planoDeFundo: IBaseModel = {
        spriteX: 390,
        spriteY: 0,
        largura: 275,
        altura: 204,
        x: 0,
        y: canvas.height - 204,
        desenha: () => {
            contexto.fillStyle = '#70c5ce';
            contexto.fillRect(0, 0, canvas.width, canvas.height)
            Jogo.Draw({
                spriteX: planoDeFundo.spriteX,
                spriteY: planoDeFundo.spriteY,
                largura: planoDeFundo.largura,
                altura: planoDeFundo.altura,
                x: planoDeFundo.x,
                y: planoDeFundo.y
            })
            Jogo.Draw({
                spriteX: planoDeFundo.spriteX,
                spriteY: planoDeFundo.spriteY,
                largura: planoDeFundo.largura,
                altura: planoDeFundo.altura,
                x: (planoDeFundo.x + planoDeFundo.largura),
                y: planoDeFundo.y
            })
        },
        atualiza(): void {
        }

    }
    export const chao: IBaseModel = {
        spriteX: 0,
        spriteY: 610,
        largura: 224,
        altura: 112,
        x: 0,
        y: canvas.height - 112,
        atualiza() {
            const movimentoDoChao = 1;
            const repeteEm = chao.largura / 2;
            const movimentacao = chao.x - movimentoDoChao;
            chao.x = movimentacao % repeteEm;
        },
        desenha() {
            Jogo.Draw({
                spriteX: chao.spriteX,
                spriteY: chao.spriteY,
                largura: chao.largura,
                altura: chao.altura,
                x: chao.x,
                y: chao.y
            })
            Jogo.Draw({
                spriteX: chao.spriteX,
                spriteY: chao.spriteY,
                largura: chao.largura,
                altura: chao.altura,
                x: (chao.x + chao.largura),
                y: chao.y
            });
        },
    }
    export class Cano implements ICano {
        largura: number = 52;
        altura: number = 400;
        chao: Movimento = {
            spriteX: 0,
            spriteY: 169,
        };
        ceu: Movimento = {
            spriteX: 52,
            spriteY: 169,
        };
        espaco: number = 80;
        pares: Dimensoes[] = [];
        desenha() {
            this.pares.forEach((par) => {
                const yRandom = par.y;
                const espacamentoEntreCanos = 90;
                const canoCeuX = par.x;
                const canoCeuY = yRandom;
                // [Cano do Céu]
                Jogo.Draw({
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
                Jogo.Draw({
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
        temColisaoComOFlappyBird(par: Dimensoes) {
            const cabecaDoFlappy = Globais.flappyBird.y;
            const peDoFlappy = Globais.flappyBird.y + Globais.flappyBird.altura;
            if ((Globais.flappyBird.x + Globais.flappyBird.largura) >= par.x) {
                if (cabecaDoFlappy <= par.canoCeu.y) {
                    return true;
                }

                if (peDoFlappy >= par.canoChao.y) {
                    return true;
                }
            }
            return false;
        };
        atualiza() {
            const passou100Frames = frames % 100 === 0;
            if (passou100Frames) {
                this.pares.push({
                    x: canvas.width,
                    y: -150 * (Math.random() + 1),
                });
            }

            this.pares.forEach((par) => {
                par.x = par.x - 2;

                if (this.temColisaoComOFlappyBird(par)) {
                    TrilhasSonoras.HIT().play();
                    mudaParaTela(Telas.GAME_OVER);
                }

                if (par.x + this.largura <= 0) {
                    this.pares.shift();
                }
            });

        }

    }
    export class flappyBird implements IFlappybird {
        public frameAtual: number = 0;
        public spriteX: number = 0;
        public spriteY: number = 0;
        public largura: number = 33;
        public altura: number = 24;
        public x: number = 10;
        public y: number = 50;
        public gravidade: number = 0.25;
        public velocidade: number = 0;
        public pulo: number = 4.6;
        pula() {
            TrilhasSonoras.PULO().play()
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
            const passouOIntervalo = frames % intervaloDeFrames === 0;

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
            Jogo.Draw({
                spriteX: spriteX,
                spriteY: spriteY,
                altura: this.altura,
                largura: this.largura,
                x: this.x,
                y: this.y
            });
        };
        atualiza: Function = () => {
            if (fazColisao<flappyBird, any>(this, Jogo.Globais.chao)) {
                TrilhasSonoras.CAIU().play()
                mudaParaTela(Telas.GAME_OVER);
                return;
            }
            this.velocidade = this.velocidade + this.gravidade;
            this.y = this.y + this.velocidade;
        }
    }
    export class Placar {
        pontuacao: number = 0;
        desenha() {
            contexto.font = '35px "VT323"';
            contexto.textAlign = 'right';
            contexto.fillStyle = 'white';
            contexto.fillText(`${this.pontuacao}`, canvas.width - 10, 35);
            SetStorage(KeyNameStorage["lastPoint"], this.pontuacao.toString())
            let bestP = Number(GetStorage(KeyNameStorage["bestPoint"]));
            if (bestP === 0) {
                SetStorage(KeyNameStorage["bestPoint"], this.pontuacao.toString())
            } else {
                let lastP = Number(GetStorage(KeyNameStorage["lastPoint"]));
                if (lastP > bestP)
                    SetStorage(KeyNameStorage["bestPoint"], this.pontuacao.toString())
            }
        };
        atualiza() {
            const intervaloDeFrames = 30;
            const passouOIntervalo = frames % intervaloDeFrames === 0;

            if (passouOIntervalo) {
                //TrilhasSonoras.PONTO().play();
                this.pontuacao = this.pontuacao + 1;
            }
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
    export const Telas: Pages = {
        INICIO: {
            inicializa() {
                Globais.flappyBird = new Jogo.flappyBird();
                Globais.chao = chao;
                Globais.canos = new Jogo.Cano();
            },
            desenha() {
                planoDeFundo.desenha();
                Globais.flappyBird.desenha();
                Globais.chao.desenha();
                mensagemGetReady.desenha();
            },
            click() {
                mudaParaTela(Telas.JOGO);
            },
            atualiza() {
                Globais.chao.atualiza();
            }
        },
        JOGO: {
            inicializa() {
                Globais.placar = new Placar();
            },
            desenha() {
                planoDeFundo.desenha();
                Globais.canos.desenha();
                Globais.chao.desenha();
                Globais.flappyBird.desenha();
                Globais.placar.desenha();
            },
            click() {
                Globais.flappyBird.pula();
            },
            atualiza() {
                Globais.canos.atualiza();
                Globais.chao.atualiza();
                Globais.flappyBird.atualiza();
                Globais.placar.atualiza();
            }
        },
        GAME_OVER: {
            inicializa() {
            },
            desenha() {
                mensagemGameOver.desenha();
                scoreGame.desenha();
            },
            atualiza() {

            },
            click() {
                mudaParaTela(Telas.INICIO);
            }
        }
    }
    const mensagemGetReady: IBaseModel = {
        spriteX: 134,
        spriteY: 0,
        largura: 174,
        altura: 152,
        x: (canvas.width / 2) - 174 / 2,
        y: 50,
        desenha: () => {
            Jogo.Draw({
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
        x: (canvas.width / 2) - 226 / 2,
        y: 50,
        desenha() {
            Jogo.Draw({
                spriteX: mensagemGameOver.spriteX,
                spriteY: mensagemGameOver.spriteY,
                largura: mensagemGameOver.largura,
                altura: mensagemGameOver.altura,
                x: mensagemGameOver.x,
                y: mensagemGameOver.y
            })
        }
    }
    const scoreGame: ScoreGame = {
        none: {
            spriteX: 0,
            spriteY: 78,
            largura: 44,
            altura: 44,
            x: (canvas.width / 2) / 2.4,
            y: 135,
            desenha() {
                Jogo.Draw({
                    spriteX: scoreGame.none.spriteX,
                    spriteY: scoreGame.none.spriteY,
                    largura: scoreGame.none.largura,
                    altura: scoreGame.none.altura,
                    x: scoreGame.none.x,
                    y: scoreGame.none.y
                })
            }
        },
        bronze: {
            spriteX: 48,
            spriteY: 124,
            largura: 44,
            altura: 44,
            x: (canvas.width / 2) / 2.4,
            y: 135,
            desenha() {
                Jogo.Draw({
                    spriteX: scoreGame.bronze.spriteX,
                    spriteY: scoreGame.bronze.spriteY,
                    largura: scoreGame.bronze.largura,
                    altura: scoreGame.bronze.altura,
                    x: scoreGame.bronze.x,
                    y: scoreGame.bronze.y
                })
            }
        },
        prata: {
            spriteX: 48,
            spriteY: 78,
            largura: 44,
            altura: 44,
            x: (canvas.width / 2) / 2.4,
            y: 135,
            desenha() {
                Jogo.Draw({
                    spriteX: scoreGame.prata.spriteX,
                    spriteY: scoreGame.prata.spriteY,
                    largura: scoreGame.prata.largura,
                    altura: scoreGame.prata.altura,
                    x: scoreGame.prata.x,
                    y: scoreGame.prata.y
                })
            }
        },
        ouro: {
            spriteX: 0,
            spriteY: 124,
            largura: 44,
            altura: 44,
            x: (canvas.width / 2) / 2.4,
            y: 135,
            desenha() {
                Jogo.Draw({
                    spriteX: scoreGame.ouro.spriteX,
                    spriteY: scoreGame.ouro.spriteY,
                    largura: scoreGame.ouro.largura,
                    altura: scoreGame.ouro.altura,
                    x: scoreGame.ouro.x,
                    y: scoreGame.ouro.y
                })
            }
        },
        desenha() {
            const pontuacaoAtual = Number(GetStorage(KeyNameStorage["lastPoint"]));
            const bestPontuacao = Number(GetStorage(KeyNameStorage["bestPoint"]));
            contexto.fillText(`${pontuacaoAtual}`, (canvas.width / 3) * 2.4, 147);
            contexto.fillText(`${bestPontuacao}`, (canvas.width / 3) * 2.4, (canvas.width / 3) * 1.9);
            if (pontuacaoAtual < 50) {
                scoreGame.none.desenha();
                return;
            }
            if (pontuacaoAtual <= 100) {
                scoreGame.bronze.desenha();
                return;
            }
            if (pontuacaoAtual <= 150) {
                scoreGame.prata.desenha();
                return;
            }
            if (pontuacaoAtual >= 200) {
                scoreGame.ouro.desenha();
                return;
            }
        }
    }
}
function loop() {
    Jogo.TelaAtiva.desenha();
    Jogo.TelaAtiva.atualiza();
    Jogo.frames = Jogo.frames + 1;
    requestAnimationFrame(loop);
}


window.addEventListener('click', function () {
    if (Jogo.TelaAtiva.click) {
        Jogo.TelaAtiva.click();
    }
});
window.addEventListener('keypress', function (e: KeyboardEvent) {
    if (Jogo.TelaAtiva.click)
        Jogo.TelaAtiva.click()
})

Jogo.mudaParaTela(Jogo.Telas.INICIO);
loop();