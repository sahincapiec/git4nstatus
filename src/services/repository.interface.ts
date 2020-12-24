import IGithubEvent from "src/entities/github-event.interface";
import IGithubGist from "src/entities/github-gist.interface";
import IGithubUser from "src/entities/github-user.interface";

export default interface IRepository {
    COLLECTION: string,
    save: (user: IGithubUser, data: IGithubEvent[] | IGithubGist[]) => Promise<void>,
}