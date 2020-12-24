import IGithubEvent from "src/entities/github-event.interface";
import IGithubUser from "src/entities/github-user.interface";
import IRepository from "./repository.interface";

export default class EventRepository implements IRepository {
    private db: IDatabase;
    COLLECTION = "events";

    constructor(db: IDatabase) {
        this.db = db;
    }

    save = (user: IGithubUser, events: IGithubEvent[]) =>
        this.db.find(this.COLLECTION, { _id: { $in: events.map(g => g.id) } })
            .then((eventsAlreadySaved: IGithubEvent[]) => eventsAlreadySaved.map(gist => gist.id))
            .then(idsAlreadySaved => events.filter(event => !idsAlreadySaved.includes(event.id)))
            .then(unsavedEvents => this.db.save(this.COLLECTION, unsavedEvents.map(event => ({ ...event, _id: event.id, githubuser: user.login }))).then(_ => { }));
}