import { Config } from '../config'
import { Storage } from '../storage';
export namespace Service {

    export class HttpService {
        static ListarPontuacao(): IResponseScore[] {
            let result: IResponseScore[] = [];

            const xhr = new XMLHttpRequest();

            xhr.open("GET", Config.Constant.API.Listar, false);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onreadystatechange = function () {
                if (this.readyState === 4) {
                    xhr.onreadystatechange = null;
                    if (this.status === 200) {
                        result = JSON.parse(this.response);
                    } else {
                        console.log(this.responseText);
                    }
                }
            };
            xhr.send();
            return result;
        }
        static AtualizaPontuacao() {
            const xhr = new XMLHttpRequest();

            xhr.open("PUT", Config.Constant.API.Listar, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onreadystatechange = function () {
                if (this.readyState === 4) {
                    xhr.onreadystatechange = null;
                }
            };
            const payload = {
                nick: Storage.Get<string>(Config.KeyNameStorage.nickName),
                point: Storage.Get<number>(Config.KeyNameStorage.bestPoint)
            }
            xhr.send(JSON.stringify(payload));
        }
        static CriarPontuacao() {
            const xhr = new XMLHttpRequest();

            xhr.open("POST", Config.Constant.API.Listar, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onreadystatechange = function () {
                if (this.readyState === 4) {
                    xhr.onreadystatechange = null;
                }
            };
            const payload = {
                nick: Storage.Get<string>(Config.KeyNameStorage.nickName),
                point: Storage.Get<number>(Config.KeyNameStorage.bestPoint) || 0
            }
            xhr.send(JSON.stringify(payload));
        }
    }

    interface IResponseScore {
        nick: string;
        point: number;
    }
}