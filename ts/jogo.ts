interface BaseModel {
    spriteX: number
    spriteY: number
    largura: number
    altura: number
    x: number
    y: number
    desenha(): void
    atualiza(): void
}
const som_HIT = new Audio();
som_HIT.src = '../efeitos/hit.wav';

const sprites = new Image();
sprites.src = '../sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');
namespace Jogo.Event {
    let frames = 0;
    const KeyNameStorage = {
        lastPoint: 'FlappyBird1.0Lp',
        bestPoint: 'FlappyBird1.0bp'
    }
    function SetStorage(key: string, value: string) {
        localStorage.setItem(key, value);
    }
    function GetStorage(key: string) {
        return localStorage.getItem(key);
    }
    // function Draw(Model: BaseModel) {
    //     contexto.drawImage(
    //         sprites,
    //         Model.spriteX, Model.spriteY,
    //         Model.largura, Model.altura,
    //         Model.x, Model.y,
    //         Model.largura, Model.altura,
    //     )
    // }
    export class Placar {
        public pontuacao: number = 0;
        desenha(): void {
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
        }
        atualiza(): void {
            const intervaloDeFrames = 20;
            const passouOIntervalo = frames % intervaloDeFrames === 0;

            if (passouOIntervalo) {
                this.pontuacao = this.pontuacao + 1;
            }
        }

    }
}