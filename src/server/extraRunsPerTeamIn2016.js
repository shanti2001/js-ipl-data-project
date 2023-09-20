const csv = require('csv-parser');
const fs = require('fs');

const matches = [];
const deliveries = [];
const extraRunsPerTeam = {};

fs.createReadStream('../data/matches.csv')
.pipe(csv({}))
.on('data',(data)=> matches.push(data))
.on('end',()=>{
    const matchId = [];
    for(const match of matches){
        if(match.season==='2016'){
            matchId.push(match.id);
        }
    }
    
    fs.createReadStream('../data/deliveries.csv')
            .pipe(csv({}))
            .on('data',(data)=> deliveries.push(data))
            .on('end',()=>{
                for(const delivery of deliveries){
                    if(matchId.indexOf(delivery.match_id)!=-1){
                        if(extraRunsPerTeam[delivery.bowling_team]==null){
                            extraRunsPerTeam[delivery.bowling_team]=Number(delivery.extra_runs);
                        }
                        else{
                            extraRunsPerTeam[delivery.bowling_team]+=Number(delivery.extra_runs);
                        }
                    }
                }
                console.log(JSON.stringify(extraRunsPerTeam));
                fs.writeFileSync('../public/output/extraRunsPerTeamIn2016.json',JSON.stringify(extraRunsPerTeam));
            });
});
