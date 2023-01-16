import { Interface } from "../interface/base";
import { Storage } from "../storage";
export namespace Config.Constant {
    export const API = {
        Atualizar: 'https://flappybirdapi.azurewebsites.net/api/Put?code=9MNUOUmKKqCavdFrMwWBDPCPzV5jduvpV3PQAEWVMqTuAzFuARgB6A==',
        Criar: 'https://flappybirdapi.azurewebsites.net/api/Post?code=P7gtMsQyyVYhGGeoFjFHqYyHcE-IJOF4WSnzfKjpx-ikAzFu3oVfjw==',
        Listar: 'https://flappybirdapi.azurewebsites.net/api/Get?code=97ZirDQdmfpy4V8o4HSGP31IzHS9zBp8uGv6X-rAgq05AzFuALUcNA=='
    }
}
export namespace Config {
    export const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    export const contexto = canvas.getContext('2d') as CanvasRenderingContext2D;
    export let IsPause = false;
    export let Frames = 0;
    export const KeyNameStorage = {
        lastPoint: 'FlappyBird1.0Lp',
        bestPoint: 'FlappyBird1.0bp',
        currentPoint: 'FlappyBird1.0cp',
        nickName: 'FlappyBird_nickname'
    }
    const hostnameDev = ['localhost', '127.0.0.1']
    const isDeveloper = hostnameDev.includes(window.location.hostname);

    export const TrilhasSonoras = {
        "HIT": () => new Audio(`${isDeveloper == false ? '../Flappy-Bird/' : '../'}assets/efeitos/hit.wav`),
        'PULO': () => new Audio(`${isDeveloper == false ? '../Flappy-Bird/' : '../'}assets/efeitos/pulo.wav`),
        'CAIU': () => new Audio(`${isDeveloper == false ? '../Flappy-Bird/' : '../'}assets/efeitos/caiu.wav`),
        'PONTO': () => new Audio(`${isDeveloper == false ? '../Flappy-Bird/' : '../'}assets/efeitos/ponto.wav`)
    }
    export const sprites = new Image();
    sprites.src = `${isDeveloper == false ? '../Flappy-Bird/' : '../'}assets/texture/sprites.png`;
    export const Draw = (Model: Interface.Utils.IBaseModel) => {
        contexto.drawImage(
            Config.sprites,
            Model.spriteX, Model.spriteY,
            Model.largura, Model.altura,
            Model.x, Model.y,
            Model.largura, Model.altura,
        )
    }

    export function fazColisao(a: Interface.Utils.IBaseModel, b: Interface.Utils.IBaseModel) {

        const aY = a.y + a.altura;
        const bY = b.y;
        return aY >= bY;
    }

}
export namespace Config.Method {
    export function randomIntFromInterval(min: number, max: number) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
    export function ClearMemory() {
        Frames = 0;
        Storage.Set(KeyNameStorage.currentPoint, 0)
    }
    export function IsNegative(number: number) {
        return Math.sign(number) === -1
    }
}