import React,{Fragment, useState} from "react"
import useSendRequest from "./useSendRequest"
import { NavLink, useHistory,useParams } from "react-router-dom"
import styles from "./PendingTask.module.css"
import success from "../images/submit-successfully.png"
import error from "../images/error.webp"
import wait from "../images/wait.webp"
import { Card } from "./card"
import {listupdatestatus,alreadysubmitted} from "../Store/store"
import { Navigation } from "./Header"
import TodaysTasks from "./TodaysTaskslist"
import ScoreSummary from "./Scoresummary"
import {newdatabase} from "../databasefile"


export let PendingTaskDashboard = () => {

      let history = useHistory()
      let taskarray = []
      let [updatedtasklist , setUpdatedtasklist] = useState()
      let [successfullscreen, setscreen] = useState()
      let [helper,setHelper] = useState("")
      let params = useParams()
      let userid = params.user
      let [userdata] = useSendRequest(`https://testproject-619f7-default-rtdb.firebaseio.com/newdatabase/${userid}/personalinfo.json`)
      let [usertaskdata] = useSendRequest(`https://testproject-619f7-default-rtdb.firebaseio.com/newdatabase/${userid}/dailytaskstatus.json`)
      // if(loading) return false
      Object.keys(usertaskdata).sort((a,b)=> new Date(a)-new Date(b)).forEach(datekey=>{
        usertaskdata[datekey].forEach(task=>{
          let condition = task.status == "N/A" || task.status == "" || task.status == "Not Done"
          if(condition){
            task.plandate = datekey
            taskarray.push(task)
          }
        })
    })
  // if(!filtereddata || filtereddata.length == 0){
  //     return <div className={styles.successfullscreen} style={{height:"10vw",display:"block"}}>
  //       <h1>No pending tasks right now</h1>
  //       <h3><NavLink to="/login">Go back to login page</NavLink></h3>
  //       </div>
  // }
  
  
  let submithandler = async (e,taskobject) => {

      taskobject.status = e.target.value
      taskobject.timestamp = new Date()
  
  let date = new Date(taskobject.taskdate).toDateString()

  setscreen("wait saving data")

  //  if(loading) {
  //   return (<div className={styles.successfullscreen}>
  //         <p><img src={wait}/></p>
  //         <p>Loading your tasks...</p>
  //         <p>Please Wait....</p>
  //     </div>)
  // }
  console.log(usertaskdata[date])
  let indexoftask = usertaskdata[date].findIndex(taskobj => taskobj.taskid == taskobject.taskid)
  
  fetch(`https://testproject-619f7-default-rtdb.firebaseio.com/newdatabase/${userid}/dailytaskstatus/${date}/${indexoftask}.json`,{
  method:"PATCH",
  body:JSON.stringify({status:taskobject.status,timestamp:taskobject.timestamp})
  }).then((res)=>{
   console.log("request submitted successfully")
    window.location.reload()
  }).catch(err=>{
    setscreen("Something went wrong.")
    return
  })
  
  }

  
  // if(loading) {
  //   return (<div className={styles.successfullscreen}>
  //         <p><img src={wait}/></p>
  //         <p>Loading your tasks...</p>
  //         <p>Please Wait....</p>
  //     </div>)
  // }


  // if(errormessage) {
  //   return (<div className={styles.successfullscreen}>
  //         <p><img src={error}/></p>
  //         <p>{errormessage}</p>
  //         <p>something went wrong</p>
  //         <a href="/">go back to login page</a>
  //     </div>)
  // }

  
  return (<section className={styles.list_wrapper}>
              <span className={styles.successfullscreen}>{successfullscreen}</span>
              <Navigation to={[`/taskdashboard/${userid}`,`/taskdashboard/${userid}/delayedtasks`,`/`]} text={[`Home`,`Delayed Tasks`,`Log out`]}/>
              <Card userdata={userdata}/>
              <ScoreSummary userdata={userdata}/>
              <h1>Pending Tasks</h1>
              <section className={styles.listcontainer}>
              <form>
              <table>
              <thead>
              <tr>
              <th>Task</th>
              <th>Interval</th>
              <th>Date</th>
              <th>Status</th>
              </tr>
              </thead>
               <tbody>
              { taskarray.map((task,i)=>{
                  let taskobject = {
                              taskdate:task.plandate,
                              taskid:task.taskid
                            }
                              return (<React.Fragment key={`${Math.random()}`}>
                              <tr key={`${i}`}>
                              <td>{task.task}</td>
                              <td>{task.taskinterval}</td>
                              <td>{task.plandate}</td>
                              <td><select id={task.taskid} name="status" onChange={(e)=>{submithandler(e,taskobject)}}>
                                      <option value="Not Done">Not Done</option>
                                      <option value="NA">N/A</option>
                                      <option value="Done">Done</option>
                                       </select></td></tr></React.Fragment>)
                        })
                   }
                   </tbody></table>
                    </form>
                    </section>
                   </section>)
  }


export let TaskDasboard = () => {
    let history = useHistory()
    let params = useParams()
    let userid = params.user
    let [userdata,status_1,errormessage_1,loading_1] = useSendRequest(`https://testproject-619f7-default-rtdb.firebaseio.com/newdatabase/${userid}/personalinfo.json`)
    let [tasklist,status_2,errormessage_2,loading_2] = useSendRequest(`https://testproject-619f7-default-rtdb.firebaseio.com/newdatabase/${userid}/dailytaskstatus.json`)
  if(loading_2 || loading_1) {
    return (<div className={styles.successfullscreen}>
          <p><img src={wait}/></p>
          <p>Loading your tasks...</p>
          <p>Please Wait....</p>
      </div>)
  }
  
    let todaystasks = tasklist[new Date().toDateString()]
    
    let component = (<Fragment><Navigation to={[`${history.location.pathname}/pendingtasks`,`${history.location.pathname}/delayedtasks`,`/`]} text={[`Pending tasks`,`Delayed tasks`,"Log out"]}/>
    <TodaysTasks userdata = {userdata} todaystask={todaystasks}/></Fragment>)
    
    if(todaystasks==undefined) return component
    let taskstatus = todaystasks.every(x => x.status !== "")

    return (<Fragment>
      <Navigation to={[`${history.location.pathname}/pendingtasks`,`${history.location.pathname}/delayedtasks`,`/`]} text={[`Pending tasks`,`Delayed tasks`,"Log out"]}/>
      { taskstatus ? <div className={styles.list_wrapper}><img height="20%" width="20%" src={success}/><p>You have already filled the checklist.</p></div>:<TodaysTasks userdata = {userdata} todaystask={todaystasks}/>}
    </Fragment>)
  }