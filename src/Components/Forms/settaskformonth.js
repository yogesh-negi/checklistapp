
// update tasks for whole month
let fetchrequest = async(nextdate)=>{
  let fetchreq = await fetch("https://testproject-619f7-default-rtdb.firebaseio.com/newdatabase.json")
  let res = await fetchreq.json()
  let data = await res
  
   let formateddate = new Date(nextdate)
   
  let userlist = Object.keys(data)

    let formatteddata = Object.keys(data).map(user=>{
        
        return data[user].definedtasks
    })

      
   let tasklist = formatteddata.map(obj=>{
     let combinedarray = []
      let todaydate = new Date();
      if(obj == undefined) return []

       let dailytask = obj.filter(obj2=>{
        if(formateddate.getDay() == 0 && obj2.userid !== "LSF0040") return false
         return obj2.taskinterval == "Daily"
       })
       let weeklytask = obj.filter(obj2=>{
        return new Date(obj2.taskdate).getDay() == new Date(formateddate).getDay() && obj2.taskinterval == "Weekly"
       })
       
       let fortnightly = obj.filter(obj2=>{
        let targetdate = new Date(obj2.taskdate).getDate()
        let dateobj = new Date()
        let date = dateobj.setDate(targetdate + 14)
         return (dateobj.getDate() == formateddate.getDate() || formateddate.getDate() == targetdate) && obj2.taskinterval == "Fortnightly"
       })
              
       let monthly = obj.filter(obj2=>{
        return new Date(obj2.taskdate).getDate() == new Date(formateddate).getDate() && obj2.taskinterval == "Monthly"
      })

      let quaterly = obj.filter(obj2=>{
        let targetdate = new Date(obj2.taskdate)
          
        if(obj2.taskinterval !== "Quaterly") return false

        return (formateddate.getMonth() == targetdate.getMonth() || formateddate.getMonth() == targetdate.getMonth()+3 || formateddate.getMonth() == targetdate.getMonth()+6 || formateddate.getMonth() == targetdate.getMonth()+9) && formateddate.getDate() == targetdate.getDate()

      })

      let halfyearly = obj.filter(obj2=>{
        let targetdate = new Date(obj2.taskdate)
          
        if(obj2.taskinterval !== "Halfyearly") return false

        return (formateddate.getMonth() == targetdate.getMonth() || formateddate.getMonth() == targetdate.getMonth()+6) && formateddate.getDate() == targetdate.getDate()

      })


      let Yearly = obj.filter(obj2=>{
        let targetdate = new Date(obj2.taskdate)
          
        if(obj2.taskinterval !== "Yearly") return false

        return formateddate.getMonth() == targetdate.getMonth() && formateddate.getDate() == targetdate.getDate()

      })


       combinedarray = [...dailytask,...weeklytask,...fortnightly,...monthly,...quaterly,...halfyearly,...Yearly];
     
     return combinedarray
   })
  
  userlist.forEach((user,i)=>{
    fetch(`https://testproject-619f7-default-rtdb.firebaseio.com/newdatabase/${user}/dailytaskstatus/${formateddate.toDateString()}.json`,{
          method:"PUT",
          body:JSON.stringify(tasklist[i])
        })
   })
     
}

let todaysdate = new Date("02-12-2023") // the date will be the start date when you want to add task
let year = todaysdate.getFullYear()
let month = todaysdate.getMonth()
let day = todaysdate.getDate()

// this look will have to run on the last day of every month so it can run and update the task list for next 30 days in database
for(let i=0;i<=1;i++){
  let formateddate = new Date(`${month+1}/${day+i}/${year}`).toDateString()
  if(formateddate !== "Invalid Date"){
       fetchrequest(formateddate)
  } 
}



//_______________________________________________________________________________________________________________________________________________________________________

// this is the code to complete old pending task of a user this will be run for a single user.

let dailytaskstatus =  [] // paste dailytaskstatus obj here 



dailytaskstatus.forEach(datekey=>{
  Object.keys(datekey).forEach(date=>{
    if(new Date(date)<new Date("04-05-2023")){
      datekey[date].forEach(obj=>{
        let status = obj.status
        if(status == ""){
          obj.status = "Done"
          obj.timestamp = new Date()
        }
      })
    }
  })
})

fetch(`https://testproject-619f7-default-rtdb.firebaseio.com/newdatabase/[userid]/dailytaskstatus.json`,{
  method:"PUT",
  body:JSON.stringify(dailytaskstatus[0]),
})






//____________________________________________________________________________________________________________________________________________








  // function for mapping dailytasklist to submittedtaskdashboard

fetch("https://check-list-app-a4e41-default-rtdb.firebaseio.com/data/dailytaskstatus.json")
.then(res=>{
  return res.json()
}).then(response => {
  let dayslist = Object.keys(response)
  dayslist.map(day=>{
      let keysarray = Object.keys(response[day])
      keysarray.map(key=>{
        let arrayofusers = response[day][key]
        arrayofusers.map(user => {
          let userid = Object.keys(user)
          userid.map(id=>{
            console.log(user[id])
           
          })
        })
      })
  })
})