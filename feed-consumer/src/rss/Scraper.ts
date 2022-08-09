import fetch from 'node-fetch';
import { load } from 'cheerio';
import { RssMetadata, ContentLocation } from '../model/RssMetadata';
import Parser from 'rss-parser';




export async function getContent(metadata: RssMetadata, item: { [key: string]: any; } & Parser.Item) {

    const contentLoc: ContentLocation = metadata.contentLocation;

    if (contentLoc === ContentLocation.GUID) {
        const link = item.guid;
        const response = await fetch(link!);
        const body = await response.text();


        const $ = load(body);
        const content = $(metadata.contentDomSelector).text();
        return `${item.title} ${content}`;
    }

    if (contentLoc === ContentLocation.CONTENT_ENCODED) {

        let body = item['content:encoded'];
        if (body === undefined) {
            console.log(`content (tag) does not exist in ${metadata.name} for item ${item.title}`);
        }
        const $ = load(body!);
        const content = $(metadata.contentDomSelector).text();

        return `${item.title} ${content}`;
    }

}



