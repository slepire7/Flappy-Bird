const isDeveloper = window.location.hostname.includes('localhost');
const TrilhasSonoras = {
    "HIT": () => new Audio(`${isDeveloper == false ? '../Flappy-Bird/' : '../'}assets/efeitos/hit.wav`),
    'PULO': () => new Audio(`${isDeveloper == false ? '../Flappy-Bird/' : '../'}assets/efeitos/pulo.wav`),
    'CAIU': () => new Audio(`${isDeveloper == false ? '../Flappy-Bird/' : '../'}assets/efeitos/caiu.wav`),
    'PONTO': () => new Audio(`${isDeveloper == false ? '../Flappy-Bird/' : '../'}assets/efeitos/ponto.wav`)
};
const sprites = new Image();
sprites.src = `${isDeveloper == false ? '../Flappy-Bird/' : '../'}assets/texture/sprites.png`;
const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');
var Jogo;
(function (Jogo) {
    Jogo.Globais = {};
    Jogo.frames = 0;
    Jogo.KeyNameStorage = {
        lastPoint: 'FlappyBird1.0Lp',
        bestPoint: 'FlappyBird1.0bp'
    };
    function SetStorage(key, value) {
        localStorage.setItem(key, value);
    }
    Jogo.SetStorage = SetStorage;
    function GetStorage(key) {
        return localStorage.getItem(key);
    }
    Jogo.GetStorage = GetStorage;
    Jogo.Draw = (Model) => {
        console.log(contexto);
        contexto.drawImage(sprites, Model.spriteX, Model.spriteY, Model.largura, Model.altura, Model.x, Model.y, Model.largura, Model.altura);
    };
    function fazColisao(a, b) {
        let entityA = a;
        let entityB = b;
        const aY = entityA.y + entityA.altura;
        const bY = entityB.y;
        if (aY >= bY) {
            return true;
        }
        return false;
    }
    Jogo.fazColisao = fazColisao;
    function mudaParaTela(page) {
        Jogo.TelaAtiva = page;
        if (Jogo.TelaAtiva.inicializa)
            Jogo.TelaAtiva.inicializa();
    }
    Jogo.mudaParaTela = mudaParaTela;
    Jogo.planoDeFundo = {
        spriteX: 390,
        spriteY: 0,
        largura: 275,
        altura: 204,
        x: 0,
        y: canvas.height - 204,
        desenha: () => {
            contexto.fillStyle = '#70c5ce';
            contexto.fillRect(0, 0, canvas.width, canvas.height);
            Jogo.Draw({
                spriteX: Jogo.planoDeFundo.spriteX,
                spriteY: Jogo.planoDeFundo.spriteY,
                largura: Jogo.planoDeFundo.largura,
                altura: Jogo.planoDeFundo.altura,
                x: Jogo.planoDeFundo.x,
                y: Jogo.planoDeFundo.y
            });
            Jogo.Draw({
                spriteX: Jogo.planoDeFundo.spriteX,
                spriteY: Jogo.planoDeFundo.spriteY,
                largura: Jogo.planoDeFundo.largura,
                altura: Jogo.planoDeFundo.altura,
                x: (Jogo.planoDeFundo.x + Jogo.planoDeFundo.largura),
                y: Jogo.planoDeFundo.y
            });
        },
        atualiza() {
        }
    };
    Jogo.chao = {
        spriteX: 0,
        spriteY: 610,
        largura: 224,
        altura: 112,
        x: 0,
        y: canvas.height - 112,
        atualiza() {
            const movimentoDoChao = 1;
            const repeteEm = Jogo.chao.largura / 2;
            const movimentacao = Jogo.chao.x - movimentoDoChao;
            Jogo.chao.x = movimentacao % repeteEm;
        },
        desenha() {
            Jogo.Draw({
                spriteX: Jogo.chao.spriteX,
                spriteY: Jogo.chao.spriteY,
                largura: Jogo.chao.largura,
                altura: Jogo.chao.altura,
                x: Jogo.chao.x,
                y: Jogo.chao.y
            });
            Jogo.Draw({
                spriteX: Jogo.chao.spriteX,
                spriteY: Jogo.chao.spriteY,
                largura: Jogo.chao.largura,
                altura: Jogo.chao.altura,
                x: (Jogo.chao.x + Jogo.chao.largura),
                y: Jogo.chao.y
            });
        },
    };
    class Cano {
        largura = 52;
        altura = 400;
        chao = {
            spriteX: 0,
            spriteY: 169,
        };
        ceu = {
            spriteX: 52,
            spriteY: 169,
        };
        espaco = 80;
        pares = [];
        desenha() {
            this.pares.forEach((par) => {
                const yRandom = par.y;
                const espacamentoEntreCanos = 90;
                const canoCeuX = par.x;
                const canoCeuY = yRandom;
                Jogo.Draw({
                    spriteX: this.ceu.spriteX,
                    spriteY: this.ceu.spriteY,
                    largura: this.largura,
                    altura: this.altura,
                    x: canoCeuX,
                    y: canoCeuY,
                });
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
                };
                par.canoChao = {
                    x: canoChaoX,
                    y: canoChaoY
                };
            });
        }
        ;
        temColisaoComOFlappyBird(par) {
            const cabecaDoFlappy = Jogo.Globais.flappyBird.y;
            const peDoFlappy = Jogo.Globais.flappyBird.y + Jogo.Globais.flappyBird.altura;
            if ((Jogo.Globais.flappyBird.x + Jogo.Globais.flappyBird.largura) >= par.x) {
                if (cabecaDoFlappy <= par.canoCeu.y) {
                    return true;
                }
                if (peDoFlappy >= par.canoChao.y) {
                    return true;
                }
            }
            return false;
        }
        ;
        atualiza() {
            const passou100Frames = Jogo.frames % 100 === 0;
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
                    mudaParaTela(Jogo.Telas.GAME_OVER);
                }
                if (par.x + this.largura <= 0) {
                    this.pares.shift();
                }
            });
        }
    }
    Jogo.Cano = Cano;
    class flappyBird {
        frameAtual = 0;
        spriteX = 0;
        spriteY = 0;
        largura = 33;
        altura = 24;
        x = 10;
        y = 50;
        gravidade = 0.25;
        velocidade = 0;
        pulo = 4.6;
        pula() {
            TrilhasSonoras.PULO().play();
            this.velocidade = -this.pulo;
        }
        ;
        movimentos = [
            { spriteX: 0, spriteY: 0, },
            { spriteX: 0, spriteY: 26, },
            { spriteX: 0, spriteY: 52, },
            { spriteX: 0, spriteY: 26, },
        ];
        atualizaOFrameAtual() {
            const intervaloDeFrames = 10;
            const passouOIntervalo = Jogo.frames % intervaloDeFrames === 0;
            if (passouOIntervalo) {
                const baseDoIncremento = 1;
                const incremento = baseDoIncremento + this.frameAtual;
                const baseRepeticao = this.movimentos.length;
                this.frameAtual = incremento % baseRepeticao;
            }
        }
        ;
        desenha = () => {
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
        atualiza = () => {
            if (fazColisao(this, Jogo.Globais.chao)) {
                TrilhasSonoras.CAIU().play();
                mudaParaTela(Jogo.Telas.GAME_OVER);
                return;
            }
            this.velocidade = this.velocidade + this.gravidade;
            this.y = this.y + this.velocidade;
        };
    }
    Jogo.flappyBird = flappyBird;
    class Placar {
        pontuacao = 0;
        desenha() {
            contexto.font = '35px "VT323"';
            contexto.textAlign = 'right';
            contexto.fillStyle = 'white';
            contexto.fillText(`${this.pontuacao}`, canvas.width - 10, 35);
            SetStorage(Jogo.KeyNameStorage["lastPoint"], this.pontuacao.toString());
            let bestP = Number(GetStorage(Jogo.KeyNameStorage["bestPoint"]));
            if (bestP === 0) {
                SetStorage(Jogo.KeyNameStorage["bestPoint"], this.pontuacao.toString());
            }
            else {
                let lastP = Number(GetStorage(Jogo.KeyNameStorage["lastPoint"]));
                if (lastP > bestP)
                    SetStorage(Jogo.KeyNameStorage["bestPoint"], this.pontuacao.toString());
            }
        }
        ;
        atualiza() {
            const intervaloDeFrames = 30;
            const passouOIntervalo = Jogo.frames % intervaloDeFrames === 0;
            if (passouOIntervalo) {
                this.pontuacao = this.pontuacao + 1;
            }
        }
    }
    Jogo.Placar = Placar;
    Jogo.TelaAtiva = {
        click: () => {
        },
        atualiza: () => {
        },
        desenha: () => {
        },
        inicializa: () => {
        }
    };
    Jogo.Telas = {
        INICIO: {
            inicializa() {
                Jogo.Globais.flappyBird = new Jogo.flappyBird();
                Jogo.Globais.chao = Jogo.chao;
                Jogo.Globais.canos = new Jogo.Cano();
            },
            desenha() {
                Jogo.planoDeFundo.desenha();
                Jogo.Globais.flappyBird.desenha();
                Jogo.Globais.chao.desenha();
                mensagemGetReady.desenha();
            },
            click() {
                mudaParaTela(Jogo.Telas.JOGO);
            },
            atualiza() {
                Jogo.Globais.chao.atualiza();
            }
        },
        JOGO: {
            inicializa() {
                Jogo.Globais.placar = new Placar();
            },
            desenha() {
                Jogo.planoDeFundo.desenha();
                Jogo.Globais.canos.desenha();
                Jogo.Globais.chao.desenha();
                Jogo.Globais.flappyBird.desenha();
                Jogo.Globais.placar.desenha();
            },
            click() {
                Jogo.Globais.flappyBird.pula();
            },
            atualiza() {
                Jogo.Globais.canos.atualiza();
                Jogo.Globais.chao.atualiza();
                Jogo.Globais.flappyBird.atualiza();
                Jogo.Globais.placar.atualiza();
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
                mudaParaTela(Jogo.Telas.INICIO);
            }
        }
    };
    const mensagemGetReady = {
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
    };
    const mensagemGameOver = {
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
            });
        }
    };
    const scoreGame = {
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
                });
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
                });
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
                });
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
                });
            }
        },
        desenha() {
            const pontuacaoAtual = Number(GetStorage(Jogo.KeyNameStorage["lastPoint"]));
            const bestPontuacao = Number(GetStorage(Jogo.KeyNameStorage["bestPoint"]));
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
    };
})(Jogo || (Jogo = {}));
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
window.addEventListener('keypress', function (e) {
    if (Jogo.TelaAtiva.click)
        Jogo.TelaAtiva.click();
});
Jogo.mudaParaTela(Jogo.Telas.INICIO);
loop();
export {};
