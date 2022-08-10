
import { Context } from '../Context';
import { Query } from '../../models/Query';
import { Service } from 'typedi';

import { QueryHandler } from '../../query/QueryHandler';
import { SubscriptionQueryHandler } from '../../query/SubscriptionQueryHandler';

@Service()
export class QueryContext extends Context {


    queryHandler!: QueryHandler;
    subscriptionQueryHandler! : SubscriptionQueryHandler;

    async load(): Promise<void> {
        this.queryHandler = new QueryHandler();
        this.subscriptionQueryHandler = new SubscriptionQueryHandler();
         
        this.subscriptionQueryHandler.listen();
        console.log(`>>> Query context is started`);
    }
    
    async registerQuery(text: string, func: Function) { // function(link) 
        const queryObj = new Query(text);
        const result = await this.queryHandler.searchFeed(queryObj);
        
        result.forEach(el => {  func(el.link); });

    }

    subscribeQuery(text: string, func: Function) {
        const query : Query = new Query(text);
        this.subscriptionQueryHandler.subscribe(query, func);
    }

   

}

// function sleep(ms: number) {
//     return new Promise((resolve) => {
//       setTimeout(resolve, ms);
//     });
//   }