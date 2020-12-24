import IGithubGist from "src/entities/github-gist.interface";
import IGithubUser from "src/entities/github-user.interface";
import IDatabase from "src/interfaces/database/database.interface";
import IRepository from "./repository.interface";

export default class GistRepository implements IRepository {
    private db: IDatabase;
    COLLECTION = "gists";

    constructor(db: IDatabase) {
        this.db = db;
    }

    save = (user: IGithubUser, gists: IGithubGist[]) =>
        this.db.find(this.COLLECTION, { _id: { $in: gists.map(g => g.id) } })
            .then((gistsAlreadySaved: IGithubGist[]) => gistsAlreadySaved.map(gist => gist.id))
            .then(idsAlreadySaved => gists.filter(gist => !idsAlreadySaved.includes(gist.id)))
            .then(unsavedGists => this.db.save(
                this.COLLECTION,
                unsavedGists.map(gist => ({ ...gist, _id: gist.id, githubuser: user.login }))
            ).then(_ => { }));

}