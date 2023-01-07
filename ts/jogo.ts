import { Config } from './config'
import { Game } from './game/index';

namespace Jogo.PageEvents {

    export function Main() {

        document.getElementById('game-canvas').addEventListener('click', function () {
            if (Game.Main.TelaAtiva.click) {
                Game.Main.TelaAtiva.click();
            }
        });
        window.addEventListener('keypress', function (e: KeyboardEvent) {
            if (Game.Main.TelaAtiva.click)
                Game.Main.TelaAtiva.click()
        })
        Game.Main.mudaParaTela(Game.Main.Telas.INICIO);
        loop();
    }
    function loop() {
        Game.Main.TelaAtiva.desenha();
        Game.Main.TelaAtiva.atualiza();
        Config.frames = Config.frames + 1;
        requestAnimationFrame(loop);
    }
}

Jogo.PageEvents.Main()