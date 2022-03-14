export type Globais = {
    flappyBird?: any;
    chao?: any;
    canos?: any;
    placar?: any;
}
export type Pages = {
    INICIO: IPageGame;
    JOGO: IPageGame;
    GAME_OVER: IPageGame;
}
export type ScoreGame = {
    none: IBaseModel
    bronze: IBaseModel
    prata: IBaseModel
    ouro: IBaseModel
    desenha: Function
}
export interface TrilhaSonara {
    tipo: TypeTrilha
    Som: HTMLAudioElement
}
export type TypeTrilha = "HIT" | "PULO" | "CAIU" | "PONTO";
export interface IBaseModel extends IBaseAction {
    spriteX: number
    spriteY: number
    largura: number
    altura: number
    x: number
    y: number
}
export interface IPageGame {
    click: Function
    atualiza: Function
    desenha: Function
    inicializa: Function
}
export interface IFlappybird extends IBaseModel {
    gravidade: number
    velocidade: number
    pulo: number
    movimentos: Movimento[]
    frameAtual: number
    pula: Function
    atualizaOFrameAtual: Function
}
export interface ICano extends IBaseAction {
    largura: number
    altura: number
    chao: Movimento
    ceu: Movimento
    espaco: number,
    pares: Dimensoes[]
    temColisaoComOFlappyBird(par: Dimensoes): boolean
}
export interface IBaseAction {
    desenha?: Function
    atualiza?: Function
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