import { Body, Get, JsonController, Post } from "routing-controllers";
import Container from 'typedi';
import { QueryContext } from '../context/impl/QueryContext';
import { printRow, printTableHeader } from '../util/Stdout';

@JsonController('/stdout')
export class QueryController {

    queryContext: QueryContext = Container.get(QueryContext);

    @Post()
    post(@Body() query: any) {
   
        printTableHeader(query.text);
        this.queryContext.registerQuery( query.text, ((link:string) => printRow(link)));
        this.queryContext.subscribeQuery( query.text,  ((link:string) => printRow(link)));
        return {status: 'ok'};
    }

}