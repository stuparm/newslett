

export function printTableHeader(queryText: string) {
    console.log('-+------------------------------------------------------')
    console.log('');
    console.log('-+------------------------------------------------------')
    console.log(` | query: ${queryText}`);
    console.log(`-+------------------------------------------------------`)
} 

export function printRow(link: string) {
    console.log(` | ${link}`);
}