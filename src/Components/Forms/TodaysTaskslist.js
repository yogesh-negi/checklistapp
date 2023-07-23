import React, {useState,useContext} from "react"
import logo from "../images/chukde.png"
import error from "../images/error.webp"
import success from "../images/submit-successfully.png"
import wait from "../images/wait.webp"
import dummy from "../images/dummy.jpg"
import styles from "./TodaysTaskslist.module.css"
import {useLocation, useParams} from "react-router-dom"
import { TaskList } from "./TaskList"
import useSendRequest from "./useSendRequest"
import { Card } from "./card"
import { Pendingtaskstatus } from "./TaskDashboard"
import ScoreSummary from "./Scoresummary"

function TodaysTasks(props){

    let [successfullscreen, setscreen] = useState()
    let [image,setImage] = useState()
    let params = useParams()
    let index;
    let history = useLocation();
    let userid = params.user
    let userdata = props.userdata
    let tasklist = props.todaystask
 
    // let errormessage = props.error
    // let loading = props.loading

    let submithandler = async (e) => {
        e.preventDefault()        
        setscreen("please wait")
        setImage(wait)

        let data = new FormData(e.target)
        let task = data.getAll("task");
        let status = data.getAll("status")
        let taskid = data.getAll("taskid")
        let remarks = data.getAll("remarks")
        let taskinterval = data.getAll("taskinterval")

        let formdata = task.map((task,i)=>{
            return {
              task:task,
              status:status[i],
              taskid:taskid[i],
              remarks:remarks[i],
              taskinterval:taskinterval[i],
              userid:userid,
              timestamp:new Date()
          }
        })

        
    if(task.length == 0) {

      alert("can't submit blank form")
      setscreen("something went wrong")
      setImage(error)

      return (<div className={styles.successfullscreen}>
            <p><img src={error}/></p>
            <p>something went wrong</p>
            <a href="/">go back to login page</a>
        </div>)
    }

let date = new Date().toDateString()
     
  fetch(`https://testproject-619f7-default-rtdb.firebaseio.com/newdatabase/${userid}/dailytaskstatus/${date}.json`,{
    method:"PUT",
    body:JSON.stringify(formdata)
  }).then(response=>{
    if(response.status == 200){
      setImage(success)
      setscreen("You made it through")
    }
  }).catch(err=>{
      setscreen("OOPS something went wrong")
     setImage(error)
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

    
    // if(errormessage || !activeuser || !userdata) {
    //   return (<div className={styles.successfullscreen}>
    //         <p><img src={error}/></p>
    //         <p>{errormessage}</p>
    //         <p>something went wrong</p>
    //         <a href="/">go back to login page</a>
    //     </div>)
    // }



    return (
        <section className={styles.task_wrapper}>
                {successfullscreen ? <div><p><img src={image} height="300" width="300"/></p><p>{successfullscreen}</p></div>:
                <React.Fragment>
                  <ScoreSummary userdata={userdata}/>
                  <Card userdata={userdata}/>
                  <center>
                  <h1> Today's Tasks </h1>
                </center>
                <section className={styles.formcontainer}>
                <form onSubmit={submithandler}>
                <table>
                <thead>
                <tr>
                <th>Task</th>
                <th>Interval</th>
                <th>Status</th>
                <th>Remarks</th>
                </tr>
                </thead>
                <TaskList tasklist={tasklist}/>
                </table>
                <button type="submit" name="submit"> submit  </button>
                </form>
                </section>
                </React.Fragment>}
        </section>
    )
}


export default TodaysTasks