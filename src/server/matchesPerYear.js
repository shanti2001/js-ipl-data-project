const csv = require('csv-parser');
const fs = require('fs');

const matches = [];
const matchesPerYears = {};

fs.createReadStream('../data/matches.csv')
.pipe(csv({}))
.on('data',(data)=> matches.push(data))
.on('end',()=>{
    
    for(const match of matches){
        if(matchesPerYears[match.season]==null){
            matchesPerYears[match.season] = 1;
        }
        else{
            matchesPerYears[match.season]+=1;
        }
    }
    console.log(JSON.stringify(matchesPerYears));
    fs.writeFileSync('../public/output/matchesPerYear.json',JSON.stringify(matchesPerYears));
});
