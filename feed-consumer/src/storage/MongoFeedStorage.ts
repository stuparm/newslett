import config from '../config';
import * as mongoDB from 'mongodb';
import { FeedStorage } from './FeedStorage';
import { RssMetadata } from '../model/RssMetadata';
import { RssMetadataBuilder } from '../model/RssMetadataBuilder';

export class MongoFeedStorage extends FeedStorage {
    
    rssMetadataCollection!: mongoDB.Collection;
    feedCollection! : mongoDB.Collection;
    tokenCollection!: mongoDB.Collection;
    eventCollection!: mongoDB.Collection;

    async init() {
        
        const connString = config.mongo_connection_string;

        const mongoClient: mongoDB.MongoClient = new mongoDB.MongoClient(connString);
        await mongoClient.connect();
        
        const dbName = config.mongo_db_name;
        const db: mongoDB.Db = mongoClient.db(dbName);

        this.feedCollection = db.collection(config.mongo_feed_collection);
        this.tokenCollection = db.collection(config.mongo_token_collection);
        this.rssMetadataCollection = db.collection(config.mongo_rss_metadata_collection);
        this.eventCollection = db.collection(config.mongo_event_collection);
    }

    /**
     * TODO: <findAll> pulls all metadata objects into main memory and it could cause memory overflow
     * Change the implementation and introduce offsets (similar to pagination)
     */
    async findAllRssMetadata(): Promise<RssMetadata[]> {
        const docArray = await this.rssMetadataCollection?.find().toArray();
        const metadataArray  = docArray?.map(doc => new RssMetadataBuilder()
                                    .rssUrl(doc.rssUrl)
                                    .name(doc.name)
                                    .contentLocation(doc.contentLocation)
                                    .contentDomSelector(doc.contentDomSelector)
                                    .externalLink(doc.externalLink)
                                    .build());
                                    
        if (metadataArray === undefined)
            return [];
        return metadataArray;
    }

    createRssMetadata(metadata: RssMetadata): void {
        this.rssMetadataCollection?.insertOne(metadata);
    }

    deleteRssMetadata(name: string):void {
        this.rssMetadataCollection.deleteOne({name: name});
    }

    updateRssMetadata(metadata: RssMetadata):void {
        this.rssMetadataCollection.updateOne({name: metadata.name}, { $set: metadata });
    }

    async checkSingleFeed(guid: string) : Promise<boolean> {
        const count  =  await this.feedCollection?.count({guid: guid});
        // TODO: check the edge cases (like count > 1)
        if (count === undefined || count < 1  ) {
            return false;
        }
        return true; //if ( count === 1 )
    
    }

    storeFeed(guid: string, link: string): void {
        const query = {guid: guid};
        const obj = {
            guid: guid,
            link: link
        }
        const options = { upsert: true };
        this.feedCollection?.updateOne(query, {$set: obj}, options);
    }

    async upsertToken(token: string, count: number, guid: string) {
        const query = {token: token};
        const item = {
            count: count,
            guid: guid
        }
        const updateDoc = { $push : {"items" : item} };
        const options = { upsert: true };
        await this.tokenCollection?.updateOne(query, updateDoc, options);
    }

    createEvent(guid: string, tokens: string[]) {
        const event = {
            guid: guid,
            tokens: tokens
        }
        this.eventCollection.insertOne(event);
    }

   
}