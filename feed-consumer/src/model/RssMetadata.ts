export class RssMetadata  {
    rssUrl: string;    // path to the feed
    name: string;      // name of the feed (decrypt, blockworks, ...)
    contentLocation: ContentLocation;   // content can be within the feed (<content> tag), or externalized as a separate html page
    contentDomSelector: string;         // how to find the text witinh the content
    externalLink: ExternalLink

    constructor(rssUrl: string, name: string, contentLocation: ContentLocation, contentDomSelector: string, externalLink : ExternalLink) {
        this.rssUrl = rssUrl;
        this.name = name;
        this.contentLocation = contentLocation;
        this.contentDomSelector = contentDomSelector;
        this.externalLink = externalLink;
    }
}




export enum ContentLocation {
    CONTENT = 'CONTENT',
    CONTENT_ENCODED = 'CONTENT_ENCODED',
    GUID = 'GUID',
    UNDEFINED = 'UNDEFINED'
}

export enum ExternalLink {
    GUID = 'GUID',
    LINK = 'LINK',
    UNDEFINED = 'UNDEFINED'
}



    