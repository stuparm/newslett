import {Context} from "../Context";
import config from "../../config";
import { Service } from "typedi";
import { MongoFeedStorage } from "../../storage/MongoFeedStorage";
import { FeedStorage } from "../../storage/FeedStorage";


@Service()
export default class StorageContext extends Context {

    
    feedStorage?: FeedStorage;


    async load(): Promise<void> {
    
        const storageType = config.storage;

        // decide which storage will be initialized, so far we have only mongo
        if ('mongo' === storageType) {
            this.feedStorage = new MongoFeedStorage();
            
        } 
        console.log('>>> Storage context is started');

    }

    status() {
        return '';
    }


    getStorage() {
        return this.feedStorage;
    }

}
