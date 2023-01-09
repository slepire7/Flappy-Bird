import { Config } from '../config'
import { Storage } from '../storage';
export namespace Service {

    export class HttpService {
        static ListarPontuacao(): Promise<IResponseScore[]> {
            return fetch(Config.Constant.API.Listar).then(res => res.json()).then(res => res as IResponseScore[]);
        }
        static AtualizaPontuacao() {

            const payload = {
                nick: Storage.Get<string>(Config.KeyNameStorage.nickName),
                point: Storage.Get<number>(Config.KeyNameStorage.bestPoint)
            }
            fetch(Config.Constant.API.Atualizar, {
                method: 'PUT',
                body: JSON.stringify(payload),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => res.ok)
        }
        static CriarPontuacao() {
            const payload = {
                nick: Storage.Get<string>(Config.KeyNameStorage.nickName),
                point: Storage.Get<number>(Config.KeyNameStorage.bestPoint) || 0
            }
            fetch(Config.Constant.API.Criar, {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => res.ok)

        }
    }

    interface IResponseScore {
        nick: string;
        point: number;
    }
}