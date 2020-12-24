import IGithubEvent from "src/entities/github-event.interface";
import IGitHub from "./github.interface";
const client = require('octonode').client();

export default class Octonode implements IGitHub {
    getEvents: (login: string) => Promise<IGithubEvent[]> = (login: string) => new Promise<IGithubEvent[]>((resolve, reject) => {
        const ghUser = client.user(login);
        ghUser.events((err: any, body: any, headers: { status: string }) => {
            if (err) {
                return reject(err);
            }
            if (headers.status !== "200 OK") {
                return reject(body);
            }
            resolve(body);
        })
    });

    getGists: (login: string) => Promise<IGithubEvent[]> = (login: string) => new Promise<IGithubEvent[]>((resolve, reject) => {
        const gists = client.gist();
        gists.user(login, (err: any, body: any, headers: { status: string }) => {
            if (err) {
                return reject(err);
            }
            if (headers.status !== "200 OK") {
                return reject(body);
            }
            resolve(body);
        })
    });
}