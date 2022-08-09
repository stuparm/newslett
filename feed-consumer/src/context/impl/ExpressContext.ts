import config from '../../config';

import { createExpressServer } from 'routing-controllers';

import { Context } from '../Context';

import { Service } from 'typedi';
import { RssController } from '../../api/RssController';


@Service()
export default class ExpressContext extends Context {


    
    async load() {
        await this.startServer();
    }

    status() {
        return '';
    }

    async startServer() {
        const app = createExpressServer({
            controllers: [RssController] 
        });
    
        app.listen(config.port, () => {
            console.log(`>>> Web context is started ${config.port}`);
        }).on('error', (err: any) => {
            console.error(err);
            process.exit(1);
        });
    
    }
    

}



