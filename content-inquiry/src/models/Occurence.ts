export class Occurence {
    guid: string;
    count: number;
    link?: string;
    token?: string

    constructor(guid: string, count: number) {
        this.guid = guid;
        this.count = count;
    }
}