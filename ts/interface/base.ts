
export namespace Interface.Utils {
    export type Globais = {
        flappyBird?: Interface.Elements.IFlappybird;
        chao?: Interface.Elements.IChao;
        canos?: Interface.Elements.ICano;
        placar?: Interface.Elements.IPlacar;
    }
    export type Pages = {
        INICIO: IPageGame;
        JOGO: IPageGame;
        GAME_OVER: IPageGame;
    }

    export interface IPageGame {
        click: Function
        atualiza?: Function
        desenha?: Function
        inicializa: Function
    }
    export type TypeTrilha = "HIT" | "PULO" | "CAIU" | "PONTO";
    export interface IBaseModel {
        spriteX: number
        spriteY: number
        largura: number
        altura: number
        x: number
        y: number
    }

    export type Movimento = {
        spriteX: number;
        spriteY: number;
    }
    export interface Dimensoes {
        x: number;
        y: number;
        canoCeu?: {
            x: number
            y: number
        }
        canoChao?: {
            x: number
            y: number
        }
    }
    export interface IScoreMain {
        desenha(): void;
        none: Interface.Utils.IScore;
        bronze: Interface.Utils.IScore;
        prata: Interface.Utils.IScore;
        ouro: Interface.Utils.IScore;
    }
    export interface IScore extends Interface.Utils.IBaseModel {
        desenha(): void;
    }

}
export namespace Interface.Elements {
    export interface IMessage extends Interface.Utils.IBaseModel {
        desenha(): void;
    }
    export interface IFlappybird extends Interface.Utils.IBaseModel {
        gravidade: number
        velocidade: number
        pulo: number
        movimentos: Interface.Utils.Movimento[]
        frameAtual: number
        pula: Function
        atualizaOFrameAtual: Function
        desenha: Function
        atualiza(action: Function, _engine: Interface.Utils.Globais): void
    }
    export interface IPlacar {
        pontuacao: number;
        desenha: Function
        atualiza: Function
    }
    export interface ICano {
        largura: number
        altura: number
        chao: Interface.Utils.Movimento
        ceu: Interface.Utils.Movimento
        espaco: number,
        pares: Interface.Utils.Dimensoes[]
        temColisaoComOFlappyBird(par: Interface.Utils.Dimensoes, _flappyBird: IFlappybird): boolean
        desenha: Function
        atualiza(action: Function, _flappyBird: IFlappybird): void
    }

    export interface IChao extends Interface.Utils.IBaseModel {
        desenha(): void;
        atualiza(): void;
    }
}