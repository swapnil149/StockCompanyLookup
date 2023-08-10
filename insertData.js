const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;

const MONGODB_URI = 'mongodb+srv://swapnil283gupta:Atlas1234@cluster0.p5e2iw8.mongodb.net/';
const companyData = [];

const client = new MongoClient(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function run() {
    try {
        await client.connect();
        console.log("connected");

        // Read the CSV file
        const data = fs.readFileSync('companies.csv', 'utf-8');
        const lines = data.split('\n');

        lines.forEach((line, index) => {
            if(index !=0 && line !== ""){
                const [name, ticker, price] = line.split(',');
                companyData.push({ name, ticker, price });
            }
        });

        const db = client.db('Stock_List');
        const collection = db.collection('companies');

        collection.insertMany(companyData, (err, result) => {
            if (err) {
                console.error(err);
            } else {
                console.log('Data inserted successfully.');
                client.close();
            }
        });
    } finally {
        console.log("Done done!");
    }
}

run().catch(console.dir);

