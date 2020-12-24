import IGithubEvent from "./github-event.interface";
import IGithubGist from "./github-gist.interface";

export default interface IGithubUser {
    login: string,
    events?: Map<string, IGithubEvent>,
    gists?: IGithubGist[],
}