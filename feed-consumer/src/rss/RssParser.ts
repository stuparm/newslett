import Parser from 'rss-parser';
import { RssMetadata, ExternalLink } from '../model/RssMetadata';
import { getContent } from './Scraper';
import publishContent from './Publisher';
import { ContentEvent } from '../model/ContentEvent';
import { Container } from 'typedi';
import { FeedStorage } from '../storage/FeedStorage';
import StorageContext from '../context/impl/StorageContext';

export class RssParser {

    storage: FeedStorage;

    constructor() {
        this.storage = Container.get(StorageContext).getStorage()!;
    }

    async parse(metadata: RssMetadata) {

        

        const rssParser = new Parser({
            headers: {'User-Agent': 'newslett/feeed-consumer'},  // Parser (from rss-parser) has User-Agent as optional header (with ?) -> we must set it, otherwise some rss feeds will return 403
        });
        
        
        const feed = await rssParser.parseURL(metadata.rssUrl);
        const items = feed.items;
        
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            

            const guid = item.guid!;
            const exist = await this.storage.checkSingleFeed(guid);
            // console.log(`${guid} exist -> ${exist}`);
            if (!exist) {
                
            
                const link = this.getExternalLink(metadata, item);
                

                const content = await getContent(metadata, item);

                const contentEvent : ContentEvent = {
                    content: content!,
                    guid: item.guid!,
                    link: link 
                };
                // console.log(`publish content internaly ${contentEvent.guid}`);
                publishContent(contentEvent!);
            }

        }

    }

    private getExternalLink(metadata: RssMetadata, item: any) {
        switch(metadata.externalLink) { 
            case ExternalLink.GUID: { 
                return item.guid!;
            } 
            case ExternalLink.LINK: { 
                return item.link!;
            } 
            case ExternalLink.UNDEFINED: { 
                throw new Error(`external link is not defined in rss metadata ${JSON.stringify(metadata)}`);
             } 
            default: { 
               //statements; 
               break; 
            } 
         } 
    }

}