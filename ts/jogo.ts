import { Config } from './config'
import { Game } from './game/index';
import { Service } from './service/scoreapiService';
import { Storage } from './storage';

namespace Jogo.PageEvents {
    export function CarregarPlacar() {
        Service.HttpService.ListarPontuacao().then((data) => {
            console.log(data);
            const ulPlacar = document.querySelector<HTMLUListElement>('#list-placar');
            ulPlacar.innerHTML = ""
            data.map((item, idx) => {
                let liItem = document.createElement('li')
                liItem.className = 'list-group-item'
                liItem.innerText = `${(idx + 1)}º ${item.nick} - ${item.point}`
                ulPlacar.appendChild(liItem);
            })
        });
    }
    export function Main() {

        document.getElementById('game-canvas').addEventListener('click', function () {
            if (Storage.Get<string>(Config.KeyNameStorage.nickName) == "") {
                GetNickName();
                Service.HttpService.CriarPontuacao();
            }
            if (Game.Main.TelaAtiva.click) {
                Game.Main.TelaAtiva.click();
            }
        });

        window.addEventListener('keypress', function (e: KeyboardEvent) {
            if (Game.Main.TelaAtiva.click)
                Game.Main.TelaAtiva.click()
        })
        document.querySelector('#pills-placar-tab').addEventListener('click', function () {
            CarregarPlacar();
        })
        Game.Main.mudaParaTela(Game.Main.Telas.INICIO);
        loop();
    }
    function GetNickName() {
        let resposta: boolean;
        let nickName: string;
        do {
            nickName = prompt('digite um usuario');
            resposta = confirm(`usuario escolhido :${nickName} correto?`)
        } while (resposta == false)
        Storage.Set(Config.KeyNameStorage.nickName, nickName)
    }
    function loop() {
        Game.Main.TelaAtiva.desenha();
        Game.Main.TelaAtiva.atualiza();
        Config.frames += 1;
        requestAnimationFrame(loop);
    }
}

Jogo.PageEvents.Main()