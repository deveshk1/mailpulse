// //npm install csvtojson

const filename ='mail3'
// const fs = require('fs')
// const csv = require('csvtojson')

const csvFilePath =`../resources/${filename}.csv`;

// csv()
// .fromFile(csvFilePath)
// .then((jsonObj)=>{
//     console.log(jsonObj);


// const jsonFilePath =`../resources/${filename}.json`;
// fs.writeFileSync(jsonFilePath,JSON.stringify(jsonObj,null,2),'utf-8');
// console.log('converted');
// })
// .catch((error)=>{
//     console.error("error occured in conversion");
// });
const fs = require('fs');
const csv = require('csv-parser');

function processCSV(filePath) {
    return new Promise((resolve, reject) => {
        const results = [];
        const subtotals = [];
        let totalToBePaid = null;

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                // Filter out rows that are completely null or only have whitespace
                const isEmptyRow = Object.values(row).every(value => !value || value.trim() === '');

                if (!isEmptyRow) {
                    if (row['SG Ref No'] && row['SG Ref No'].toLowerCase().includes('total')) {
                        // Handle the "Total to be paid" row
                        totalToBePaid = {
                            amount: row['Flow Amount'],
                            currency: row['Payment\n Currency'],
                            paymentDate: row['Payment Date']
                        };
                    } else if (row['Time Basis'] && row['Time Basis'].toLowerCase().includes('subtotal')) {
                        // Handle subtotal rows
                        subtotals.push({
                            type: row['Time Basis'].replace('Subtotal ', '').trim(),
                            amount: row['Flow Amount'],
                            currency: row['Payment\n Currency']
                        });
                    } else {
                        // Regular data rows
                        results.push({
                            "SG Ref No": row['SG Ref No'],
                            "Buy/Sell": row['Buy/Sell'],
                            "Trade Date": row['Trade Date'],
                            "Flow Type": row['Flow Type'],
                            "Quantity": row['Quantity'],
                            "Ric": row['Ric'],
                            "Start Date": row['Start Date'],
                            "End Date": row['End Date'],
                            "Payment Date": row['Payment Date'],
                            "Initial Price": row['Initial Price'],
                            "Final Price": row['Final Price'],
                            "Currency": row['Currency'],
                            "FX Rate Reference": row['FX Rate Reference'],
                            "Initial FX Rate": row['Initial FX Rate'],
                            "Final FX Rate": row['Final FX Rate'],
                            "Reference Rate": row['Reference Rate'],
                            "Rate Value": row['Rate Value'],
                            "Spread": row['Spread'],
                            "NB Days": row['NB Days'],
                            "Time Basis": row['Time Basis'],
                            "Flow Amount": row['Flow Amount'],
                            "Payment Currency": row['Payment\n Currency']
                        });
                    }
                }
            })
            .on('end', () => {
                resolve({
                    data: results,
                    subtotals: subtotals,
                    totalToBePaid: totalToBePaid
                });
            })
            .on('error', reject);
    });
}

// Usage
const filePath = csvFilePath // Update with your actual file path

processCSV(filePath)
    .then((jsonResult) => {
        console.log('Final JSON:', JSON.stringify(jsonResult, null, 2));

        // Optionally, save the result to a JSON file
        fs.writeFileSync(`${filename}.json`, JSON.stringify(jsonResult, null, 2));
    })
    .catch((error) => {
        console.error('Error processing CSV:', error);
    });
