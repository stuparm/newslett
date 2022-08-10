import { Query } from '../models/Query';
import Container from 'typedi';
import PubSub from 'pubsub-js'
import config from '../config';
import { EventInternal } from '../models/EventInternal';
import { evaluateSingle } from './QueryEvaluation';
import { Occurence } from '../models/Occurence';
import { TokenStorage } from '../storage/TokenStorage';
import { StorageContext } from '../context/impl/StorageContext';

export class SubscriptionQueryHandler {

    subscriptions : Map<Query, Function>; //id -> expression

    tokenStorage: TokenStorage = Container.get(StorageContext).getStorage();

    constructor() {
        this.subscriptions = new Map<Query, Function>(); //function(link);

    }

    listen() {
        PubSub.subscribe(config.event_content, (topic: string, event: EventInternal)=> {
            
            const guid = event.guid;
            const tokens = event.tokens;
            this.subscriptions.forEach((func, query) => {
                const occurence : Occurence | undefined = evaluateSingle(query,guid, tokens); 
                if (occurence !== undefined) {
                    const guid = occurence.guid;
                    this.tokenStorage.findLink(guid).then(link  => {
                        
                        if (link !== undefined) {
                            func(link);
                        }
                    })
                }
              });
        } 
        );
    }

    subscribe(query: Query, onEvent: Function) {
        this.subscriptions.set(query, onEvent);
       
        
    }

    

    

}