import { Occurence } from "../models/Occurence";


export abstract class TokenStorage {

    constructor() {
        this.init();  
    }

    abstract init(): Promise<void>;

    abstract findOccurences(tokens: string[]): Promise<Map<string,Occurence[]>>;
    abstract findLink(guid: string): Promise<string>;
    abstract listenForFeedChange(): void;

}