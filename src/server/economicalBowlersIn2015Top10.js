const csv = require('csv-parser');
const fs = require('fs');

const matches = [];
const deliveries = [];
let economicalBowlersIn2015Top10 = {};

fs.createReadStream('../data/matches.csv')
.pipe(csv({}))
.on('data',(data)=> matches.push(data))
.on('end',()=>{
    const matchId = [];
    for(const match of matches){
        if(match.season==='2015'){
            matchId.push(match.id);
        }
    }

    fs.createReadStream('../data/deliveries.csv')
            .pipe(csv({}))
            .on('data',(data)=> deliveries.push(data))
            .on('end',()=>{
                const economicalBowlers={};

                for(const delivery of deliveries){
                    if(matchId.indexOf(delivery.match_id)!=-1){
                        if(economicalBowlers[delivery.bowler]==null){
                            economicalBowlers[delivery.bowler] ={runs:0,balls:0};
                            if(delivery.wide_runs>'0' || delivery.noball_runs>'0'){
                                economicalBowlers[delivery.bowler]['runs']=Number(delivery.wide_runs)+Number(delivery.noball_runs);
                            }
                            else if(delivery.bye_runs>'0' || delivery.legbye_runs>'0'){
                                economicalBowlers[delivery.bowler]['balls']=1;
                            }else{
                                economicalBowlers[delivery.bowler]['runs']=Number(delivery.batsman_runs);
                                economicalBowlers[delivery.bowler]['balls']=1;
                            }
                        }
                        else{
                            if(delivery.wide_runs>'0' || delivery.noball_runs>'0'){
                                economicalBowlers[delivery.bowler]['runs']+=Number(delivery.wide_runs)+Number(delivery.noball_runs);
                            }
                            else if(delivery.bye_runs>'0' || delivery.legbye_runs>'0'){
                                economicalBowlers[delivery.bowler]['balls']+=1;
                            }else{
                                economicalBowlers[delivery.bowler]['runs']+=Number(delivery.batsman_runs);
                                economicalBowlers[delivery.bowler]['balls']+=1;
                            }
                        }
                    }
                }

                for( const data in economicalBowlers){
                    economicalBowlersIn2015Top10[data] = economicalBowlers[data]['runs']/(economicalBowlers[data]['balls']/6.0);
                }

                var economical = [];
                for(var data in economicalBowlersIn2015Top10){
                    economical.push([data,economicalBowlersIn2015Top10[data]]);
                }
                economical.sort((ele1,ele2)=>{
                    return ele1[1]-ele2[1];
                });
                economical = economical.slice(0,10);

                economicalBowlersIn2015Top10 = {};

                for(const [key,value] of economical){
                    economicalBowlersIn2015Top10[key] = value;
                }
                console.log(economicalBowlersIn2015Top10);
                fs.writeFileSync('../public/output/economicalBowlersIn2015Top10.json',JSON.stringify(economicalBowlersIn2015Top10));
            });
});
