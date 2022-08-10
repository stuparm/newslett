import 'reflect-metadata';
import { Body, Get, Post, JsonController, Put, Delete } from 'routing-controllers';
import { RssMetadata } from '../model/RssMetadata';
import StorageContext from '../context/impl/StorageContext';
import { Container } from 'typedi';
import { FeedStorage } from '../storage/FeedStorage';

@JsonController('/rss')
export class RssController {

  feedStorage: FeedStorage;

  constructor() {
    const storageContext: StorageContext = Container.get(StorageContext);
    this.feedStorage = storageContext.getStorage()!;
  }

  @Post()
  post(@Body() metadata: any) {
    this.feedStorage.createRssMetadata(metadata);
    return { status: 'ok' };
  }

  @Get()
  async get() {
    const metadata: RssMetadata[] = await this.feedStorage.findAllRssMetadata()!;
    return metadata;
  }

  @Put()
  async update(@Body() metadata: any) {
    this.feedStorage.updateRssMetadata(metadata);
    return { status: 'ok' };
  }

  @Delete()
  async delete(@Body() metadata: any) {
    this.feedStorage.deleteRssMetadata(metadata.name);
    return {status: 'ok'};
  }
  
}