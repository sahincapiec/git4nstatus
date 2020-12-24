import IGithubEvent from "src/entities/github-event.interface";
import IGithubGist from "src/entities/github-gist.interface";
import IGithubUser from "src/entities/github-user.interface";

export interface GithubUserDTO {
    login: string,
    events?: [string, IGithubEvent][],
    gists?: IGithubGist[],
}

export default (user: IGithubUser): GithubUserDTO => {
    const eventsMap: [string, IGithubEvent][] = []
    user.events?.forEach((value, key) => eventsMap.push([key, value]))
    return {
        login: user.login,
        events: eventsMap,
        gists: user.gists,
    }
}