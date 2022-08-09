import { Occurence } from "../models/Occurence";
import { Query } from '../models/Query';
import natural from 'natural';


const OR = 'OR';
const AND = 'AND';


// export class QueryEvaluation {
export function evaluateSingle(query: Query, guid: string, tokens: string[]): Occurence | undefined{
    const occurences : Map<string, Occurence[]> 
            = new Map(tokens.map(token =>  [ token, [ new Occurence(guid,1) ] ] ));
    
    // TODO: handle error if multiple occurences are returned, now array with at most 1 occurence is returned
    const resultArr : Occurence[] = evaluate(query, occurences);
    if (resultArr === undefined || resultArr.length === 0)
        return undefined;
    else
        return resultArr[0];

}

export function evaluate(query: Query, map: Map<string, Occurence[]>): Occurence[] {
    const postfix = toPostfix(query.text);
    const result = execute(postfix, map);
    const filteredResult : Occurence[] = removeDuplicates(result);
    return filteredResult;


}



function toPostfix(text: string): string[] {

    const fields: string[] = text.split(' ');
    const stack: string[] = [];
    const queue: string[] = [];


    if (fields.length === 0) { return []; }

    fields.forEach(field => {

        if (field === AND || field === OR) {
            let last = stack[stack.length - 1]; // stack.peek
            while (stack.length > 0 && last === AND) {
                queue.push(stack.pop()!);
                last = stack[stack.length - 1]; // stack.peek
            }
            stack.push(field);
        }

        else if (field === '(') {
            stack.push(field);
        }

        else if (field === ')') {
            let last = stack[stack.length - 1]; // stack.peek
            while (stack.length > 0 && last != '(') {
                queue.push(stack.pop()!);
                last = stack[stack.length - 1]; // stack.peek
            }
            if (stack.length === 0)
                throw new Error('closed bracket found, but there is no opened');

            stack.pop(); // remove left bracket
        }

        else { // field === token
            queue.push(natural.PorterStemmer.stem(field));
        }
    });
    while (stack.length != 0) {
        queue.push(stack.pop()!);
    }
    return queue;

}

function execute(postfixQueue: string[], map: Map<string, Occurence[]>): Occurence[] {

    const stack: Occurence[][] = [];
    postfixQueue.forEach(el => {
        if (el === AND || el == OR) {
            const arr1 = stack.pop();
            const arr2 = stack.pop();
            if (el === AND) {
                const andResult = intersection(arr1!, arr2!);
                stack.push(andResult);
            }
            else if (el === OR) {
                const orResult = union(arr1!, arr2!);
                stack.push(orResult);
            }

        } else {
            const arr = map.has(el) ? map.get(el) : [];
            stack.push(arr!);
        }
    })

    return stack[0];



}

function intersection(arr1: Occurence[], arr2: Occurence[]): Occurence[] {
    const result: Occurence[] = [];
    while (arr1.length > 0 && arr2.length > 0) {
        if (arr1[0].guid < arr2[0].guid)
            arr1.shift();                           // move left array
        else if (arr1[0].guid > arr2[0].guid)
            arr2.shift();                           // move right array
        else {
            // arr1[0].guid == arr2[0].guid
            const el = arr1[0];
            result.push(el);

            arr1.shift();                           // move left and
            arr2.shift();                           // right array 

        }
    }

    return result;
}


function union(arr1: Occurence[], arr2: Occurence[]): Occurence[] {
    const result: Occurence[] = [];
    while (arr1.length > 0 && arr2.length > 0) {
        if (arr1[0].guid < arr2[0].guid) {
            result.push(arr1.shift()!);
        }
        else if (arr1[0].guid > arr2[0].guid)
            result.push(arr2.shift()!);
        else {
            // arr1[0].guid == arr2[0].guid
            const el = arr1[0];
            result.push(el);

            arr1.shift();                           // move left and
            arr2.shift();                           // right array 
        }
    }
    while (arr1.length > 0) result.push(arr1.shift()!);              // populate with the rest 
    while (arr2.length > 0) result.push(arr2.shift()!);              // (from first or second array)

    return result;


}

function removeDuplicates(array: Occurence[]) {
    const uniqueGuidArr : string[] = [];
    const uniqueObjArr = array.filter(el => {
        const isDuplicate = uniqueGuidArr.includes(el.guid);
        if (!isDuplicate) {
            uniqueGuidArr.push(el.guid);
            return true;
        } else {
            return false;
        }
    });
    return uniqueObjArr;
}