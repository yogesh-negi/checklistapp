import React,{useState} from "react"
import useSendRequest from "./useSendRequest"
import { NavLink, useHistory,useParams } from "react-router-dom"
import styles from "./PendingTask.module.css"
import error from "../images/error.webp"
import { Card } from "./card"
import success from "../images/submit-successfully.png"
import wait from "../images/wait.webp"
import { Navigation } from "./Header"
import { newdatabase } from "../databasefile"

export let DelayedtasksDashboard = () => {
      let history = useHistory()
      let taskarray = []
      let [updatedtasklist , setUpdatedtasklist] = useState()
      let [successfullscreen, setscreen] = useState()
      let [helper,setHelper] = useState("")
      let params = useParams()
      let userid = params.user
      let [userdata] = useSendRequest(`https://testproject-619f7-default-rtdb.firebaseio.com/newdatabase/${userid}/personalinfo.json`)
      let [tasklist] = useSendRequest(`https://testproject-619f7-default-rtdb.firebaseio.com/newdatabase/${userid}/dailytaskstatus.json`)
      // if(loading) return false
      Object.keys(tasklist).sort((a,b)=> new Date(a)-new Date(b)).forEach(obj=>{
        if(new Date(obj) >= new Date()) return []
        tasklist[obj].forEach(task => {
          if(task.status !== ""){
            task.plandate = obj
            taskarray.push(task)  
          }
      })
    })

  let filtereddata = taskarray.filter(taskobj => {
    let plandate = new Date(taskobj.plandate).toDateString()
    let actualdate = new Date(taskobj.timestamp).toDateString()
    return actualdate>plandate
  })


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
              <Navigation to={[`/taskdashboard/${userid}`,`/taskdashboard/${userid}/pendingtasks`,`/`]} text={[`Home`,`Pending Tasks`,`Log out`]}/>
              <Card userdata={userdata}/>
              <h1>Delayed Tasks</h1>
              <section className={styles.listcontainer}>
              <table>
              <thead>
              <tr>
              <th>Task</th>
              <th>Interval</th>
              <th>Plan Date</th>
              <th>Completion Date</th>
              </tr>
              </thead>
               <tbody>

              { filtereddata.map((task,i)=>{
                let timestamp = new Date(task.timestamp)
                if(task.userid == userid) {
                  return (<React.Fragment key={`${i}`}>
                  <tr key={`${i}`}>
                  <td>{task.task}</td>
                  <td>{task.taskinterval}</td>
                  <td>{task.plandate}</td>
                  <td>{timestamp.toDateString()}</td>
                  </tr></React.Fragment>)
                }
                        })}
                   </tbody></table>
                    </section>
                   </section>)
  }
