import PubSub from 'pubsub-js'
import config from "../config";
import { simplify } from './Stemmer';
import { ContentEvent } from '../model/ContentEvent';
import { countTokens } from './Counter';
import { FeedStorage } from '../storage/FeedStorage';
import { Container } from 'typedi';
import StorageContext from '../context/impl/StorageContext';




function handleContent(topic: string, contentEvent: ContentEvent) {
    const tokens : string[] = simplify(contentEvent.content);
    
    const countDict = countTokens(tokens);

    // ----
    // slow / inneficient code block
    // should not be executed too often
    // if needed, the whole <index (subscriber)> module can be extracted and scaled out 
    const storage: FeedStorage = Container.get(StorageContext).getStorage()!;
    for (let [token, count] of Object.entries(countDict)) {
        storage.upsertToken(token, count, contentEvent.guid);
    }

    const guid = contentEvent.guid;
    const link = contentEvent.link;
    
    storage.storeFeed(guid, link); 
    // console.log(`{store event -> ${guid} : ${tokens.length}}`);
    storage.createEvent(guid, Object.keys(countDict))


}

export function subscribe() {
    PubSub.subscribe(config.event_content, handleContent);
}
