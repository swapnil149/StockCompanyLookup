//  Remove trailing spaces in the field, and also convert input string to lowercase

const http = require('http');
const fs = require('fs');
const { MongoClient } = require('mongodb');

const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb+srv://swapnil283gupta:Atlas1234@cluster0.p5e2iw8.mongodb.net/';

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        fs.readFile(__dirname + '/index.html', 'utf-8', (err, content) => {
            if (err) {
                console.error(err);
                res.writeHead(500);
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content);
            }
        });
    } else if (req.method === 'POST' && req.url === '/lookup') {
        let data = '';
        req.on('data', chunk => {
            data += chunk.toString();
        });

        req.on('end', async () => {
            const parsedData = new URLSearchParams(data);
            const searchType = parsedData.get('searchType');
            const searchQuery = parsedData.get('searchQuery');

            try {
                const client = new MongoClient(MONGODB_URI, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                });
                await client.connect();
                const db = client.db('Stock_List');
                const collection = db.collection('companies');

                let query = {};
                if (searchType === 'symbol') {
                    query = { ticker: new RegExp(searchQuery, 'i') }; // 'i' for case-insensitive
                } else if (searchType === 'name') {
                    query = { name: new RegExp(searchQuery, 'i') }; // 'i' for case-insensitive
                }

                // let query = {};
                // if (searchType === 'symbol') {
                //     query = { ticker: searchQuery };
                // } else if (searchType === 'name') {
                //     query = { name: searchQuery };
                // }

                const matchingCompanies = await collection.find(query).toArray();

                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(`
                    <ul>
                        ${matchingCompanies.map(company => `<li>${company.name} (${company.ticker}): ${company.price}</li>`).join('')}
                    </ul>
                `);
                res.end();

                client.close();
            } catch (error) {
                console.error(error);
                res.writeHead(500);
                res.end('An error occurred.');
            }
        });
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
