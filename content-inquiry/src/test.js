var parser = require('lucene-query-parser');

var node = parser.parse('(eth OR ethereum) AND bitcoin');

console.log(node);
print(node);


function print(node) {
    left = node.left;
    if (left != undefined) {
        print(node.left);
    }

    console.log(`${node.term || node.operator} `);

    right = node.right;
    if (right != undefined) {
        print(node.right);
    }
}