const csv = require('csv-parser');
const fs = require('fs');

const matches = [];
const matchesWonPerTeamPerYear = {};

fs.createReadStream('../data/matches.csv')
.pipe(csv({}))
.on('data',(data)=>matches.push(data))
.on('end',()=>{
    
    for(const match of matches){
        if(matchesWonPerTeamPerYear[match.season]==null){
            matchesWonPerTeamPerYear[match.season] = {};
            matchesWonPerTeamPerYear[match.season][match.winner]=1;
        }
        else{
            if(matchesWonPerTeamPerYear[match.season][match.winner]==null){
                matchesWonPerTeamPerYear[match.season][match.winner]=1;
            }else{
                matchesWonPerTeamPerYear[match.season][match.winner]+=1;
            }
        }
    }
    console.log(matchesWonPerTeamPerYear);
    fs.writeFileSync('../public/output/matchesWonPerTeamPerYear.json',JSON.stringify(matchesWonPerTeamPerYear));
});