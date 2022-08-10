import { Context } from '../Context';
import { subscribe } from '../../index/Indexer';
import { Service } from 'typedi';

@Service()
export default class IndexContext extends Context {


    async load() {

        subscribe();
        console.log(`>>> Index context is started`);

    }

}