import PubSub from 'pubsub-js'
import config from "../config";
import { ContentEvent } from '../model/ContentEvent';


export default function publishContent(content: ContentEvent) {
    PubSub.publish(config.event_content, content);
}