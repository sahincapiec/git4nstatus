interface IDatabase {
    save: (collection: string, data: object[]) => Promise<any>,
    find: (collection: string, filter: any) => Promise<any[]>,
    close: () => Promise<void>,
}