import { Service } from 'typedi';
import { CronExecutor } from '../../rss/CronExecutor';
import { Context } from '../Context';


@Service()
export default class RssContext extends Context {

    async load()  {
        
        const cronExecutor = new CronExecutor;
        cronExecutor.execute();
        console.log(`>>> Rss context is started`);
    }

    status() {
        return '';
    }
}
