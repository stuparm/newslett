import { useExpressServer } from 'routing-controllers';
import { Service } from 'typedi';
import { Context } from '../Context';
import { QueryController } from '../../api/QueryController';
import config from '../../config';
import * as WebSocket from 'ws';
import express from 'express';
import http from 'http';
import { WebSocketController } from '../../api/WebSocketController';


@Service()
export class WebContext extends Context {

    webSocketServer!: WebSocket.Server;

    async load(): Promise<void> {
        this.startWebServer();
    }

    startWebServer() {


        const app = express();
        const server = http.createServer(app);      
      
        const webSocketServer = new WebSocket.Server({server});
        const webSocketController = new WebSocketController();

        webSocketServer.on('connection', ((conn) => {
            webSocketController.acceptConnection(conn);
        }));

        useExpressServer(app, { controllers: [QueryController] });

        server.listen(config.port, () => {
            console.log(`>>> Web context is started (${config.port})`);
        }).on('error', (err: any) => {
            console.error(err);
            process.exit(1);
        });
    }

}

