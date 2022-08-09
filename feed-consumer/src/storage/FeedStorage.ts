import { RssMetadata } from "../model/RssMetadata";

export abstract class FeedStorage {

    constructor() {
        this.init(); 
    }

    abstract init(): Promise<void>;


    abstract findAllRssMetadata() : Promise<RssMetadata[]>;
    abstract createRssMetadata(metadata: RssMetadata): void;
    abstract deleteRssMetadata(name: string):void ;
    abstract updateRssMetadata(metadata: RssMetadata): void;
    

    abstract checkSingleFeed(guid: string) : Promise<boolean>;
    abstract storeFeed(guid: string, link: string) : void;

    abstract upsertToken(token: string, count: number, guid: string) : Promise<void>; 

    abstract createEvent(guid:string, tokens:string[]):void;
}