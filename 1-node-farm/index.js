const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate');

// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);

// const textOut = `this is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('file written');

// fs.readFile('./txt/start.txt', 'utf-8', (err, data) => {
//     if (err) return console.log('error');
//     fs.readFile(`./txt/${data}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
//         fs.readFile(`./txt/append.txt`, 'utf-8', (err, data3) => {
//             console.log(data3);
//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//                 console.log('your file has been written');
//             });
//         });
//     });
// });
// console.log('will read file');\


const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const slugs = dataObj.map(el => slugify(el.productName, {lower: true}));
const server = http.createServer((req, res) => {

    const {query, pathname} = url.parse(req.url, true);
    // Overview
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {'Content-type': 'text/html'});
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        let output = tempOverview.replace(/{%PRODUCT_CARDS%}/g,  cardsHtml);
        res.end(output);

    // Product
    } else if (pathname === '/product') {
        try {
            const product = dataObj[query.id];
            const output = replaceTemplate(tempProduct, product);
            res.writeHead(200, {'Content-type': 'text/html'});
            res.end(output);
        } catch (error) {
            res.writeHead(404, {
                'Content-type': 'text/html',
                'my-own-header': 'hello-world'
            });
            res.end('<h1>page not found</h1>'); 
        }

    // API
    } else if (pathname === '/api') {
        res.writeHead(200, {'Content-type': 'application/json'});
        res.end(data);

    // Not Found 
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>page not found</h1>');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('listening to requests on port 8000');
});