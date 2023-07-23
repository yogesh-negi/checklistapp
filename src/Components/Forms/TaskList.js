import useSendRequest from "./useSendRequest"
import {useLocation,useParams} from "react-router-dom"
import {useState,useEffect} from "react"
import styles from "./TodaysTaskslist.module.css"
import {Navigation} from "./Header"
import error from "../images/error.webp"
import wait from "../images/wait.webp"


export let TaskList = (props) => {
    let [image, setImage] = useState({})
    let params = useParams()
    let dailytasks, weeklytask, fortnightlytask, monthlytask, quaterly, halfyearly, yearly
    let history = useLocation();
    let userid = params.user
    let tasklist = props.tasklist
    let combinedarray = tasklist

    // if(loading) {
    //   return (<div className={styles.successfullscreen}>
    //       <p><img src={wait}/></p>
    //       <p>{"Please wait loding data.."}</p>
    //       </div>)
    // }

    
    // let data = tasklist[Object.keys(tasklist)].listoftasks.filter(obj=>{
    //   return obj[userid]
    // })
    

    if(combinedarray == undefined) {
      return <div className={styles.successfullscreen}><p>No tasks found for the user :{userid}</p></div>
    }
      // dailytasks = data[0][userid].filter(task=>task.taskinterval == "daily" || task.taskinterval == "Daily")
      // weeklytask = data[0][userid].filter(task=>task.taskinterval == "Weekly" && new Date(task.taskdate).getDay() == new Date().getDay())
      // fortnightlytask = data[0][userid].filter(task=>task.taskinterval == "Fortnightly" && (new Date(task.taskdate).getDate() == new Date().getDate() || (new Date(task.taskdate).getDate()+14) == new Date().getDate()))
      // monthlytask = data[0][userid].filter(task=>task.taskinterval == "Monthly" && new Date(task.taskdate).getDate() == new Date().getDate())
      // halfyearly = data[0][userid].filter(task=>task.taskinterval == "Half-yearly" && new Date(task.taskdate).getDate() == new Date().getDate() && new Date(task.taskdate).getMonth() == new Date().getMonth()+1)
      // let combinedarray = [...dailytasks,...weeklytask,...fortnightlytask,...monthlytask,...halfyearly]


    return  (<tbody>{
      combinedarray.map((task,i)=>{ 
        return (
        <tr className={styles.taskdashboard} key={i}>
        <td>{task.task} </td><td>{task.taskinterval}</td>
        <td><select id={task.taskid} name="status">
        <option value="">Select Status</option>
        <option value="Done">Done</option>
        <option value="NA">N/A</option>
        <option value="Not Done">Not Done</option>
        </select></td>
        <td><input type="text" name="remarks" id={task.taskid} className="remarks"/></td>
        <td style={{"display":"none"}}><input type="text" name="taskid" defaultValue={task.taskid}/></td>
        <td style={{"display":"none"}}><input type="text" name="task" defaultValue={task.task} /></td>
        <td style={{"display":"none"}}><input type="text" name="taskinterval" defaultValue={task.taskinterval} /></td>
        </tr>
    )
    })
    }
    </tbody>)
} 


export let SubmittedTasksDashboard = (props) => {
let [image, setImage] = useState({})
let [successfullscreen, setscreen] = useState("")
let listoftask = []
let [filtereduser, setfilterUser] = useState("LSF001")
let [filteredlist, setFilteredtask] = useState(listoftask)
let [tasklist,status,errormessage,loading] = useSendRequest(`https://testproject-619f7-default-rtdb.firebaseio.com/newdatabase.json`)
if(loading) {
  return (<div className={styles.successfullscreen}>
      <p><img src={wait}/></p>
      <p>{"Please wait loding data.."}</p>
      </div>)
}
Object.keys(tasklist).forEach(obj=>{
  if(tasklist[obj].dailytaskstatus == undefined) return false
   Object.keys(tasklist[obj].dailytaskstatus).forEach(plandate=>{
          tasklist[obj].dailytaskstatus[plandate].forEach(task=>{
            task.plandate = plandate
            listoftask.push(task)
          })
          })
        })  

// if(errormessage) {
//   return (<div className={styles.successfullscreen}>
//       <p><img src={error}/></p>
//       <p>{errormessage}</p>
//       </div>)
// }


let userfilter = (e) => {
  setfilterUser(e.target.value)
    setFilteredtask(listoftask.filter(obj=>{
      return obj.userid == e.target.value
    }))
}

let statusfilter = (e) => {

  setFilteredtask(listoftask.filter(obj=>{
    return obj.status == e.target.value && obj.userid == filtereduser
  }))
}

        return (<section className={styles.task_wrapper}>{successfullscreen !=="" ? <div className={styles.successfullscreen}><img src={image}/><p>{successfullscreen}</p><p><a href="/">go back to login page</a></p></div> :
        <section>
          <div><Navigation text={["Score Card","Add New Task","Logout"]} to={["Scorecard","/newtask","/"]}/></div>
            <form>
            <h2>Select user id</h2>
            <select onChange={userfilter}>
            {Object.keys(tasklist).map((user,i)=>{
                return <option key={i} value={user}>{user}</option> 
            })
            }
             </select>
             <h2>Select user status</h2>
            <select onChange={statusfilter}>
            <option value="Done">Done</option> 
            <option value="Not Done">Not Done</option> 
            <option value="">Not updated</option>
            <option value="NA">NA</option>
            </select>
            </form>
            <div style={{height:"45vw"}} className={styles.formcontainer}>
            <table>
            <thead>
            <tr>
            <td>Task</td>
            <td>Userid</td>
            <td>Plan Date</td>
            <td>Interval</td>
            <td>Status</td>
            <td>Completion Date</td>
            <td>Remarks</td>
            </tr>
            </thead>
             <tbody>
             {filteredlist.map((task,i)=>{
                          let timestamp = task.timestamp && new Date(task.timestamp).toDateString()
                          return (<tr key={`${i}`}> 
                            <td style={{width:"30vw"}}>{task.task}</td>
                            <td>{task.userid}</td>
                            <td style={{width:"10vw"}}>{task.plandate}</td>
                            <td>{task.taskinterval}</td>
                            <td>{task.status}</td>
                            <td style={{width:"10vw"}}>{timestamp}</td>
                            <td className={styles.remarks}>{task.remarks}</td>
                            </tr>)
                        })
                        }
     
              </tbody></table> 
                </div>
                </section>
            }</section>)
    }