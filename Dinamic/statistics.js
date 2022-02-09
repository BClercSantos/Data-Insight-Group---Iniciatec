var stats = new Vue({  
    el: '#stats',  
    data: {    
        democrats:[],
        republicans:[],
        independents:[] 
    }
 });

 var least = new Vue({  
    el: '#least',  
    data: {    
        leastLoyalMembers:[],
        leastEngagedMembers:[] 
    }
 });

 var most = new Vue({  
    el: '#most',  
    data: {    
        mostLoyalMembers:[],
        mostEngagedMembers:[] 
    }
 });

 if (document.title.includes('Senate')) {
    var urlFetch = "https://api.propublica.org/congress/v1/113/senate/members.json"
    console.log('Senate')
 } else if (document.title.includes('House')){
    var urlFetch = "https://api.propublica.org/congress/v1/113/house/members.json"
    console.log('House')
 }

async function call(){
    
        let res = await fetch(urlFetch, {
                 type: 'GET',
                 datatype: 'json',
                 headers: {'X-API-Key':'BCmBwTEWmToWdKS5i1AFvCsqvz44mAeFJdxhiH0Y',
                }});
        let data = await res.json();


let members = data.results[0].members;

    let democrats = []
    let republicans = []
    let independents = []

    members.forEach(member => {
        if (member.party == 'D') {
            democrats.push(member)        
        } else if (member.party == 'R') {
            republicans.push(member)
        } else if (member.party == 'ID') {
            independents.push(member)
        }
    });

function averageVotesWParty (members){
    let averageVotes = 0
    members.forEach(member =>{
        averageVotes += member.votes_with_party_pct/members.length
    })
    return averageVotes.toFixed(2);
}

let membersDebugged = [];
members.forEach(member => {
    if (member.total_votes != 0) {
        membersDebugged.push(member)
    }
})


let amount = parseInt(membersDebugged.length*0.10)

    let orderArrayByVWP = [];
    let orderArrayByMissedVotes = [];
    membersDebugged.forEach(member => {
        orderArrayByVWP.push(member);
        orderArrayByMissedVotes.push(member);
    })
    orderArrayByVWP.sort((a,b) => a.votes_with_party_pct - b.votes_with_party_pct)
    orderArrayByMissedVotes.sort((a,b) => a.missed_votes - b.missed_votes)
    

function minVotesWParty(members,amount) {
    let leastLoyalMembers = [];
    for (let i = 0; i < amount; i++) {
        leastLoyalMembers.push(members[i])
    }
    return leastLoyalMembers;

}
function maxVotesWParty(members, amount) {
    let mostLoyalMembers = [];
    for (let i = (members.length - 1); i > (members.length - 1 - amount); i--) {
        mostLoyalMembers.push(members[i]); 
    }
    return mostLoyalMembers;

}

function minMissedVotes(members,amount) {
    let leastEngaged = [];
    for (let i = (members.length - 1); i > (members.length - 1 - amount); i--) {
        leastEngaged.push(members[i])
    }
    return leastEngaged;

}

function maxMissedVotes(members,amount) {
    let mostEngaged = [];
    for (let i = 0; i < amount; i++) {
        mostEngaged.push(members[i])
    }
    return mostEngaged;

}

let statistics = {
    "democrats":{
        "quantity": democrats.length,
        "averageVotesWParty": averageVotesWParty(democrats),
    },
    "republicans":{
        "quantity": republicans.length,
        "averageVotesWParty": averageVotesWParty(republicans),
    },
    "independents":{
        "quantity": independents.length,
        "averageVotesWParty": averageVotesWParty(independents),
    },
    "leastLoyalMembers": minVotesWParty(orderArrayByVWP,amount),
    "mostLoyalMembers":maxVotesWParty(orderArrayByVWP,amount),
    "leastEngagedMembers":minMissedVotes(orderArrayByMissedVotes,amount),
    "mostEngagedMembers": maxMissedVotes(orderArrayByMissedVotes,amount),
}
stats.democrats = statistics.democrats;
stats.republicans = statistics.republicans;
stats.independents = statistics.independents;
least.leastLoyalMembers = statistics.leastLoyalMembers;
least.leastEngagedMembers = statistics.leastEngagedMembers;
most.mostLoyalMembers = statistics.mostLoyalMembers;
most.mostEngagedMembers = statistics.mostEngagedMembers;
}
call()



