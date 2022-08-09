import natural from "natural";


export function simplify (content: string) : string[]{
    return natural.PorterStemmer.tokenizeAndStem(content);
}
