import config from '../config';
import * as mongoDB from 'mongodb';
import { TokenStorage } from './TokenStorage';
import { Occurence } from '../models/Occurence';
import { EventInternal } from '../models/EventInternal';
import PubSub from 'pubsub-js'
export class MongoTokenStorage extends TokenStorage {
    
   
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
        this.eventCollection = db.collection(config.mongo_event_collection);

        this.listenForFeedChange();

        

    }

   

    // async upsertToken(token: string, count: number, guid: string) {
    //     const query = {token: token};
    //     const item = {
    //         count: count,
    //         guid: guid
    //     }
    //     const updateDoc = { $push : {"items" : item} };
    //     const options = { upsert: true };
    //     await this.tokenCollection?.updateOne(query, updateDoc, options);
    // }

    async findOccurences(tokens: string[]): Promise<Map<string,Occurence[]>> {
        
        const tokenOccurenceArr = await this.tokenCollection.find({token: { $in: tokens}}).toArray();
        const map = new Map(tokenOccurenceArr.map(occur => [occur.token, occur.items.sort(occurenceComprator)]));  // foe better efficiency, this array should be sorted inside mongo (during insert)
        return map;
    }

    async findLink(guid: string): Promise<string> {
        const feedArr = await this.feedCollection.find({guid: guid}).toArray();
        if (feedArr.length === 0)
            return '';
        else
            return feedArr[0].link;
    }

    listenForFeedChange(): void {
        
        const changeStream = this.eventCollection.watch();
        changeStream.on("change", next => {
            // process any change event
            
            if (next.operationType === 'insert') {
                
                const event = next.fullDocument;
                const guid = event.guid;
                const tokens = event.tokens;
                const eventInternal : EventInternal =  {guid, tokens};
                // console.log(`new event arrived -> ${guid}`);
                PubSub.publish(config.event_content, eventInternal);
                
            }
        });

    }

}

function occurenceComprator( a:Occurence, b:Occurence )
  {
  if ( a.guid < b.guid){ return -1; }
  if ( a.guid > b.guid) { return 1; }
  return 0;
}