

export function countTokens(tokens: string[] ) : { [token: string] : number } {

    const dict : { [token: string] : number } = {};
    tokens.forEach(token => {
        if (dict[token] != undefined) {
            dict[token]++;
        } else {
            dict[token] = 1; 
        }
    });
    
    return dict;

}

