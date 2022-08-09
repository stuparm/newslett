import { QueryContext } from '../context/impl/QueryContext';
import Container from 'typedi';
import * as WebSocket from 'ws';
export class WebSocketController {
    
    queryContext: QueryContext;
    connections: Set<WebSocket.WebSocket > = new Set<WebSocket.WebSocket>();
 

    constructor() {
        
        this.queryContext = Container.get(QueryContext);
    }


    acceptConnection(connection: WebSocket.WebSocket) {

        this.connections.add(connection);
        connection.send(`Welcome to Newslett. You can filter the newest articles using the query form (term1 AND term2) OR (term3 OR term4)`);


        connection.addEventListener("message", (event) => {
            
            const queryText = event.data.toString();
            this.queryContext.registerQuery(queryText, ((link:string) => {connection.send(link);}));
            this.queryContext.subscribeQuery(queryText, ((link:string) => {connection.send(link);}));
            
        });

        connection.addEventListener("close", () => this.connections.delete(connection));

        

        

    }

}


function getByValue(map: Map<any, any>, searchValue: any) {
    for (let [key, value] of map.entries()) {
      if (value === searchValue)
        return key;
    }
  }




