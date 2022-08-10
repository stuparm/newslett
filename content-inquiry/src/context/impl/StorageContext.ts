import { Service } from 'typedi';
import { Context } from '../Context';
import config from '../../config';
import { TokenStorage } from '../../storage/TokenStorage';
import { MongoTokenStorage } from '../../storage/MongoTokenStorage';


@Service()
export class StorageContext extends Context {

    private tokenStorage! : TokenStorage;

    async load(): Promise<void> {

        const storage = config.storage;

        if ('mongo' === storage) {
            this.tokenStorage = new MongoTokenStorage();
        }   

        if (this.tokenStorage === undefined) {
            throw new Error('storage context not initialized');
        }
        console.log('>>> Storage context is started');
    }

    getStorage() {
        return this.tokenStorage;
    }
  



}