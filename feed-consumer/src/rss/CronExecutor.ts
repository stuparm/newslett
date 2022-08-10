import { CronJob } from "cron";
import { Service, Container } from 'typedi';
import config from "../config";
import { FeedStorage } from '../storage/FeedStorage';
import StorageContext from '../context/impl/StorageContext';
import { RssParser } from './RssParser';

@Service()
export class CronExecutor {

    feedStorage?: FeedStorage;
    cronJob?: CronJob;

    constructor() {
        this.feedStorage = Container.get(StorageContext).getStorage();
    }

    execute() {

        const expression = config.cron_expression;

        const cronJob = new CronJob(expression, async () => {

            const rssMetadataArr = await this.feedStorage?.findAllRssMetadata();
            rssMetadataArr?.forEach(metatada => {
                let rssParser = new RssParser;
                rssParser.parse(metatada).catch(e => console.log(e));
            });
        });

        cronJob.start();

    }


}