import 'reflect-metadata'; 
import { exit } from 'process';        
import Container from 'typedi';
import { Context } from './context/Context';
import { StorageContext } from './context/impl/StorageContext';
import { WebContext } from './context/impl/WebContext';
import { QueryContext } from './context/impl/QueryContext';



const contexts: Context[] = [
    Container.get(StorageContext),
    Container.get(WebContext),
    Container.get(QueryContext)
];

function bootstrapServer() {

    contexts.forEach(
        async context => { await context.load().catch(err => {
            console.error(err);
            exit(1);
        })  
    });
}

bootstrapServer();