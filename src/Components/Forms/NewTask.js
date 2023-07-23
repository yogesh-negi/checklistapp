import {useEffect,useState} from "react";
import logo from "../images/chukde.png"
import error from "../images/error.webp"
import success from "../images/submit-successfully.png"
import wait from "../images/wait.webp"
import styles from "./NewTask.module.css" 
import useSendRequest from "./useSendRequest";
import {Navigation} from "./Header"
import { NavLink } from "react-router-dom";

function NewTaskForm(){
    let [successfullscreen, setScreen] = useState("")
    let [image,setImage] = useState()
    let [userid, setUserid] = useState("")
    const taskinterval = ["Daily","Weekly","Fortnightly","Monthly","Quaterly","Half-yearly","Yearly"]
    let [userdata] = useSendRequest(`https://testproject-619f7-default-rtdb.firebaseio.com/newdatabase.json`)
    let listofuserid = Object.keys(userdata)
    let addtaskhandler = (e) => {
        e.preventDefault()
        setScreen("please wait")
        setImage(wait)
        let formdata = new FormData(e.target)
        let userid = formdata.get("userid")
        let existinguser = userdata[userid]
        let taskid = existinguser.definedtasks == undefined ? 1 : (existinguser.definedtasks.length)+1

        let formatteddata = {
            remarks:"",
            status:"",
            taskid:taskid,
            taskdate:formdata.get("date"),
            task:formdata.get("task"),
            userid:formdata.get("userid"),
            taskinterval:formdata.get("taskinterval")
        }
        if(existinguser.definedtasks==undefined){
            fetch(`https://testproject-619f7-default-rtdb.firebaseio.com/newdatabase/${userid}/definedtasks.json`,{
                method:"PUT",
                body:JSON.stringify([formatteddata])
            })
        } else {
            existinguser.definedtasks.push(formatteddata)
               }


        let updatetasklist = async () => {
            let fetchrequest = await fetch(`https://testproject-619f7-default-rtdb.firebaseio.com/newdatabase/${userid}/definedtasks.json`,{
                method:"PUT",
                body:JSON.stringify(existinguser.definedtasks)
            })
            let response = await fetchrequest.json()
                setImage(success)
                setScreen("task submitted successfully")
                return response
        }

            try {
                updatetasklist()
            } catch (error) {
                setImage(error)
            }

    }
    
let onchangehandler = (e) => {
    setUserid(e.target.value)
}

    return (<span>
        <div><Navigation text={["Submitted Tasks","Logout"]} to={["/taskreport","/"]}/></div>
        {successfullscreen !=="" ? <div className={styles.successfullscreen } ><img src={image}/><p>{successfullscreen}</p><p><a href="/">go back to login page</a></p></div> :
        <div>
        <section className={styles.SignupForm}>
                <div className={styles.form}>
                <center><h1>Add New Task</h1></center>
                <form onSubmit={addtaskhandler}>
                    <label className={styles.input}> Select user Id</label>
                <select onChange={onchangehandler} name="userid">
                    {listofuserid.map((userid,i)=>{
                        return (<option key={i} value={userid}>{userid}</option>)
                    })}
                </select>
                <label className={styles.input}> Select Task Interval </label>
                <select name="taskinterval">
                    {taskinterval.map((interval,i)=>{
                        return (<option key={i} value={interval}>{interval}</option>)
                    })}
                </select>
                <label className={styles.input}>Select date</label>
                <input type="date" name="date"/>
                <input type="text" name="taskid" style={{display:"none"}}/><br/><br/><br/>
                <label htmlFor="newtask" className={styles.input}> Task Description </label><br/><br/>
                <textarea name="task" rows="10" cols="80" style={{resize:"none"}}></textarea><br/><br/>
                <button type="submit" name="submit" className={styles.submit}> Add Task  </button>
                </form>
        </div>
        </section>
    </div>
    } </span>)
}


export default NewTaskForm