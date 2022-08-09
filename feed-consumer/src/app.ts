import 'reflect-metadata';          // has to be fisrt line because of annotations

import { exit } from 'process';
import ExpressContext from './context/impl/ExpressContext';
import StorageContext from './context/impl/StorageContext';
import {Context} from './context/Context';
import { Container } from 'typedi';
import RssContext from './context/impl/RssContext';
import IndexContext from './context/impl/IndexContext';

const contexts: Context[] = [
    Container.get(ExpressContext),
    Container.get(StorageContext),
    Container.get(RssContext),
    Container.get(IndexContext)
];

function bootstrapServer() {

    contexts.forEach(
        async context => { await context.load().catch(err => {
            console.error(err);
            exit(1);
        })  
    });
}


function getStatus() {
    contexts.forEach(
        context => { 
            context.status();
    });  
    
}


bootstrapServer();


