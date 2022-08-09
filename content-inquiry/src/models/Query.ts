
import natural from "natural";



export class Query {

    text: string;
    tokens: string[];
    

    constructor(text: string) {
        const queryText = text.replace('(',' ( ').replace(')',' ) ').replace(/\s+/g, ' ').trim();                   //https://futurestud.io/tutorials/remove-extra-spaces-from-a-string-in-javascript-or-node-js#:~:text=Use%20JavaScript's%20string.,multiple%20using%20the%20%5Cs%2B%20RegEx.
        this.text = queryText;
        this.tokens = this.findTokens(queryText);
    
    }


    private findTokens(text: string): string[] {
        const array : string[] = natural.PorterStemmer.tokenizeAndStem(text);
        const tokens = array.filter(token => token != ')' && token != '(');
        return tokens;
        
    }

    


    

}
