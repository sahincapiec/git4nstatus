export default interface IGithubEvent {
    id: string,
    created_at: string,
    [name: string]: any,
}