import IGithubGist from "src/entities/github-gist.interface";
import IGithubUser from "src/entities/github-user.interface";
import IGitHub from "src/interfaces/github/github.interface";
import ISanitizer from "src/interfaces/sanitizer/sanitizer.interface";
import IRepository from "./repository.interface";

export default class GistService {
    private github: IGitHub;
    private repository: IRepository;
    private sanitizer: ISanitizer;

    constructor(github: IGitHub, repository: IRepository, sanitizer: ISanitizer) {
        this.github = github;
        this.repository = repository;
        this.sanitizer = sanitizer;
    }

    getGists = (user: IGithubUser) => this.github.getGists(user.login)
        .then((gists: IGithubGist[]) => {
            const sortedGists = gists.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            return sortedGists.slice(0, 3);
        })
        .then(slicedGists => {
            const sanitizedGists = slicedGists.map(gist => this.sanitizer.sanitizeKeys<IGithubGist, IGithubGist>(gist));
            return this.repository.save(user, sanitizedGists).then(_ => slicedGists);
        })
}