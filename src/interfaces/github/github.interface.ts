import GitHubEvent from "src/entities/github-event.interface";

export default interface IGitHub {
    getEvents: (login: string) => Promise<GitHubEvent[]>,
    getGists: (login: string) => Promise<GitHubEvent[]>,
}