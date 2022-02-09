async function filtro(members) {
   statesFilter(await members)
}

if (document.title.includes('Senate')) {
   var urlFetch = "https://api.propublica.org/congress/v1/113/senate/members.json"
   filtro(call()) 
} else if (document.title.includes('House')){
   var urlFetch = "https://api.propublica.org/congress/v1/113/house/members.json"
   filtro(call())
}

var app = new Vue({  
   el: '#app',  
   data: {    
     members: []
   }
});

async function call(){
   let res = await fetch( urlFetch, {
            type: 'GET',
            datatype: 'json',
            headers: {'X-API-Key':'BCmBwTEWmToWdKS5i1AFvCsqvz44mAeFJdxhiH0Y',
            }});
   let data = await res.json()
   app.members = data.results[0].members
   chooseStates(app.members)
   localStorage.setItem('members',JSON.stringify(app.members))
   return app.members
}

function statesFilter(members) {

  var states = [];
  members.forEach( member => {
     states.push(member.state);
  });
  const statesNew = new Set(states); //Set no permite elementos duplicados
  states = [...statesNew].sort();

  for (let i = 0; i < states.length; i++) {
     var options = `<option value="${states[i]}"> ${states[i]} </option>`
     document.getElementById("statesSelect").innerHTML += options;
  }
}

var checks = document.getElementsByName("party")

function chooseStates(members) {
  var chosenState = document.getElementById("statesSelect").value;
  var memberState = [];
  members.forEach(member => {
     if (chosenState == member.state) {
        memberState.push(member)
     } else if (chosenState == 'All') {
        memberState.push(member)
     }
  });
  chooseParty(memberState)
  return memberState;
}

function chooseParty(membersNew) {
  var memberParty = [];
  var specialCases = [];

  checks.forEach(check => {
     specialCases.push(check.checked);
     if (check.checked == true) {

      membersNew.forEach(member =>{

         if (check.value == member.party){

            memberParty.push(member);

         };

      });

   };

  });
  app.members = memberParty;
  if (specialCases[0] == true && specialCases[1] == true && specialCases[2] == true) {
   app.members = membersNew;
  } else if (specialCases[0] == false && specialCases[1] == false && specialCases[2] == false) {
   app.members = membersNew;
  }
}; 

function membersLocalStorage(){
   let members = JSON.parse(localStorage.getItem("members"))
   chooseStates(members)
}
