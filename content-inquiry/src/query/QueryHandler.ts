import { Query } from '../models/Query';
import { TokenStorage } from '../storage/TokenStorage';
import Container from 'typedi';
import { StorageContext } from '../context/impl/StorageContext';
import { Occurence } from '../models/Occurence';
import { evaluate } from './QueryEvaluation';


export class QueryHandler {

    tokenStorage: TokenStorage;


    constructor() {
        this.tokenStorage = Container.get(StorageContext).getStorage();
        
    }

    async searchFeed(query: Query): Promise<Occurence[]>  {

        const tokens = query.tokens;
        const map : Map<string, Occurence[]> = await this.tokenStorage.findOccurences(tokens); // token -> array
        
        const result: Occurence[] = evaluate(query, map);
        for (let i = 0; i < result.length; i++) {
            const el = result[i];
            const link = await this.tokenStorage.findLink(el.guid);
            el.link = link;
            
        }
        return result;
    }




    
}






