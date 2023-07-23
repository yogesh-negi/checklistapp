import { Fragment, useState } from "react";
import useSendRequest from "./useSendRequest";
import styles from "./ScoreCard.module.css"
import { Navigation } from "./Header";

let ScoreCard = (props) => {
    let alltasksarray = []
    let [tasklist,errormessage,loading] = [props.userdata,props.error,props.loading]
    if(loading) return false
      let data = Object.keys(tasklist.dailytaskstatus).sort((a,b)=> new Date(a)-new Date(b)).map(date=>{
        let pendingdate = new Date(date)
        let currentdate = new Date()
        if(pendingdate>=currentdate) return []
            let object = Object.keys(tasklist.dailytaskstatus[date])
            object.forEach(user=>{
                tasklist.dailytaskstatus[date][user].forEach(taskobj=>
                    Object.keys(taskobj).forEach(key=>{
                        taskobj[key].forEach(task=>{
                            task.actualdate = date
                                    alltasksarray.push(task)
                                    return alltasksarray
                        })
                    })
                )
            })
        })
let userids = Object.keys(props.userdata.userdata).map(key=>props.userdata.userdata[key].user)
let usernames = Object.keys(props.userdata.userdata).map(key=>`${props.userdata.userdata[key].firstname} ${props.userdata.userdata[key].lastname}`)

let fortotaltaskcount = []

for (let i in userids){
    let totaltasks = alltasksarray.filter(user=>{
        return user.userid == userids[i]
     })

     let donetasks = alltasksarray.filter(user=>{
        return user.userid == userids[i] && (user.status == "Done" || user.status == "NA")
     })

     let notdonetasks = alltasksarray.filter(user=>{
        return user.userid == userids[i] && (user.status == "Not Done" || user.status == "")
     })

     let delayed = alltasksarray.filter(user=>{
        return user.userid == userids[i] && user.timestamp && (new Date(user.actualdate).toDateString() < new Date(user.timestamp).toDateString())
     })

     let newobject = {[userids[i]]:{
        total:totaltasks,
        done:donetasks,
        notdone:notdonetasks,
        delayed:delayed
    }}
    fortotaltaskcount.push(newobject)  
}

    return (<section className={styles.wrapper}>
        <div>
        <Navigation text={["Add New Task","Pending Tasks","Logout"]} to={["/newtask","/taskreport","/"]}/>
        </div>
        <section className={styles.container}>
        <h1>Score Card</h1>
        <table>
            <thead>
            <tr>
            <th>Name</th>
            <th>Total</th>
            <th>Done</th>
            <th>Not Done</th>
            <th>Done Score</th>
            <th>Delayed Score</th>
            </tr>
            </thead>
            <tbody>
                {
                    userids.map((array,i)=>{
                        let [total,done,notdone,delayed] = [fortotaltaskcount[i][array].total.length,fortotaltaskcount[i][array].done.length,fortotaltaskcount[i][array].notdone.length,fortotaltaskcount[i][array].delayed.length]
                        let donescore = total !== 0 ? `${Math.round(done/total*100)}%`:0
                        let delayedscore = total !== 0 ? `${Math.round(delayed/total*100)}%`:0 
                        
                        return ( <tr>
                            <td>{usernames[i]}</td>
                            <td>{total}</td>
                            <td>{done}</td>
                            <td>{notdone}</td>
                            <td>{donescore}</td>
                            <td>{delayedscore}</td>
                        </tr>)
                    })
                }
                
            </tbody>
        </table>
        </section>
    </section>)
}

export default ScoreCard