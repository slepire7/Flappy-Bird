const TrilhasSonoras = [
    {
        tipo: 'HIT',
        Som: new Audio('../efeitos/hit.wav')
    },
    {
        tipo: 'PULO',
        Som: new Audio('../efeitos/pulo.wav')
    },
    {
        tipo: 'CAIU',
        Som: new Audio('../efeitos/caiu.wav')
    },
    {
        tipo: 'PONTO',
        Som: new Audio('../efeitos/ponto.wav')
    },
];
const sprites = new Image();
sprites.src = '../sprites.png';
const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');
var Jogo;
(function (Jogo) {
    Jogo.Globais = {};
    Jogo.frames = 0;
    const KeyNameStorage = {
        lastPoint: 'FlappyBird1.0Lp',
        bestPoint: 'FlappyBird1.0bp'
    };
    function SetStorage(key, value) {
        localStorage.setItem(key, value);
    }
    function GetStorage(key) {
        return localStorage.getItem(key);
    }
    function Draw(Model) {
        contexto.drawImage(sprites, Model.spriteX, Model.spriteY, Model.largura, Model.altura, Model.x, Model.y, Model.largura, Model.altura);
    }
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
    const planoDeFundo = {
        spriteX: 390,
        spriteY: 0,
        largura: 275,
        altura: 204,
        x: 0,
        y: canvas.height - 204,
        desenha: () => {
            contexto.fillStyle = '#70c5ce';
            contexto.fillRect(0, 0, canvas.width, canvas.height);
            Draw(planoDeFundo);
            Draw({
                spriteX: planoDeFundo.spriteX,
                spriteY: planoDeFundo.spriteY,
                largura: planoDeFundo.largura,
                altura: planoDeFundo.altura,
                x: (planoDeFundo.x + planoDeFundo.largura),
                y: planoDeFundo.y
            });
        },
        atualiza() {
        }
    };
    const chao = {
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
            Draw(this);
            Draw({
                spriteX: this.spriteX,
                spriteY: this.spriteY,
                largura: this.largura,
                altura: this.altura,
                x: (this.x + this.largura),
                y: this.y
            });
        },
    };
    class Cano {
        constructor() {
            this.largura = 52;
            this.altura = 400;
            this.chao = {
                spriteX: 0,
                spriteY: 169,
            };
            this.ceu = {
                spriteX: 52,
                spriteY: 169,
            };
            this.espaco = 80;
            this.pares = [];
        }
        desenha() {
            this.pares.forEach((par) => {
                const yRandom = par.y;
                const espacamentoEntreCanos = 90;
                const canoCeuX = par.x;
                const canoCeuY = yRandom;
                Draw({
                    spriteX: this.ceu.spriteX, spriteY: this.ceu.spriteY,
                    largura: this.largura,
                    altura: this.altura,
                    x: canoCeuX,
                    y: canoCeuY,
                });
                const canoChaoX = par.x;
                const canoChaoY = this.altura + espacamentoEntreCanos + yRandom;
                Draw({
                    spriteX: this.chao.spriteX, spriteY: this.chao.spriteY,
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
                    TrilhasSonoras.find(o => o.tipo === "HIT").Som.play();
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
        constructor() {
            this.frameAtual = 0;
            this.spriteX = 0;
            this.spriteY = 0;
            this.largura = 33;
            this.altura = 24;
            this.x = 10;
            this.y = 50;
            this.gravidade = 0.25;
            this.velocidade = 0;
            this.pulo = 4.6;
            this.movimentos = [
                { spriteX: 0, spriteY: 0, },
                { spriteX: 0, spriteY: 26, },
                { spriteX: 0, spriteY: 52, },
                { spriteX: 0, spriteY: 26, },
            ];
            this.desenha = () => {
                this.atualizaOFrameAtual();
                const { spriteX, spriteY } = this.movimentos[this.frameAtual];
                const { altura, largura, x, y, } = this;
                Draw({
                    spriteX,
                    spriteY,
                    altura,
                    largura,
                    x,
                    y,
                });
            };
            this.atualiza = () => {
                if (fazColisao(this, Jogo.Globais.chao)) {
                    TrilhasSonoras.find(o => o.tipo === "CAIU").Som.play();
                    mudaParaTela(Jogo.Telas.GAME_OVER);
                    return;
                }
                this.velocidade = this.velocidade + this.gravidade;
                this.y = this.y + this.velocidade;
            };
        }
        pula() {
            TrilhasSonoras.find(o => o.tipo === "PULO").Som.play();
            this.velocidade = -this.pulo;
        }
        ;
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
    }
    Jogo.flappyBird = flappyBird;
    class Placar {
        constructor() {
            this.pontuacao = 0;
        }
        desenha() {
            contexto.font = '35px "VT323"';
            contexto.textAlign = 'right';
            contexto.fillStyle = 'white';
            contexto.fillText(`${this.pontuacao}`, canvas.width - 10, 35);
            SetStorage(KeyNameStorage["lastPoint"], this.pontuacao.toString());
            let bestP = Number(GetStorage(KeyNameStorage["bestPoint"]));
            if (bestP === 0) {
                SetStorage(KeyNameStorage["bestPoint"], this.pontuacao.toString());
            }
            else {
                let lastP = Number(GetStorage(KeyNameStorage["lastPoint"]));
                if (lastP > bestP)
                    SetStorage(KeyNameStorage["bestPoint"], this.pontuacao.toString());
            }
        }
        ;
        atualiza() {
            const intervaloDeFrames = 20;
            const passouOIntervalo = Jogo.frames % intervaloDeFrames === 0;
            if (passouOIntervalo) {
                TrilhasSonoras.find(o => o.tipo === "PONTO").Som.play();
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
                Jogo.Globais.chao = chao;
                Jogo.Globais.canos = new Jogo.Cano();
            },
            desenha() {
                planoDeFundo.desenha();
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
                planoDeFundo.desenha();
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
        desenha() {
            Draw(this);
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
            Draw(this);
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
                Draw(scoreGame.none);
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
                Draw(scoreGame.bronze);
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
                Draw(scoreGame.prata);
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
                Draw(scoreGame.ouro);
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
