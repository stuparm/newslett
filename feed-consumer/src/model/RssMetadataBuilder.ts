import { RssMetadata, ContentLocation, ExternalLink } from "./RssMetadata";


export class RssMetadataBuilder {

    private rssMetadata: RssMetadata;

    constructor() {
        this.rssMetadata = {
            rssUrl: '',
            name: '',
            contentLocation: ContentLocation.UNDEFINED,
            contentDomSelector: '',
            externalLink: ExternalLink.UNDEFINED
        };
    }

    rssUrl(rssUrl : string) : RssMetadataBuilder {
        this.rssMetadata.rssUrl = rssUrl;
        return this;
    }

    name(name : string) : RssMetadataBuilder {
        this.rssMetadata.name = name;
        return this;
    }

    contentLocation(contentLocation : ContentLocation) : RssMetadataBuilder {
        this.rssMetadata.contentLocation = contentLocation;
        return this;
    }

    contentDomSelector(contentDomSelector : string) : RssMetadataBuilder {
        this.rssMetadata.contentDomSelector = contentDomSelector;
        return this;
    }

    externalLink(externalLink : ExternalLink) : RssMetadataBuilder {
        this.rssMetadata.externalLink = externalLink;
        return this;
    }

    build(): RssMetadata {
        return this.rssMetadata;
    }



}