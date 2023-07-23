import { Fragment, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./ScoreCard.module.css"
import useSendRequest from "./useSendRequest";

let ScoreSummary = () => {
    let alltasksarray = []
    let params = useParams()
    let currentuser = params.user
    let [tasklist,status,errormessage,loading] = useSendRequest(`https://testproject-619f7-default-rtdb.firebaseio.com/newdatabase/${currentuser}/dailytaskstatus.json`)
      let data = Object.keys(tasklist).sort((a,b)=> new Date(a)-new Date(b)).map(date=>{
        let pendingdate = new Date(date)
        let currentdate = new Date() 
        if(pendingdate>=currentdate) return []
                        tasklist[date].forEach(task=>{
                            task.actualdate = date
                            alltasksarray.push(task)
                            return alltasksarray
                        })
                    })


let fortotaltaskcount = []
    
     let donetasks = alltasksarray.filter(user=>{
        return user.status == "Done" || user.status == "NA"
     })

     let notdonetasks = alltasksarray.filter(user=>{
        return user.status == "Not Done" || user.status == ""
     })

     let delayed = alltasksarray.filter(user=>{
        return user.timestamp && (new Date(user.actualdate).toDateString() < new Date(user.timestamp).toDateString())
     })

     let newobject = {[currentuser]:{
        total:alltasksarray,
        done:donetasks,
        notdone:notdonetasks,
        delayed:delayed
    }}
    fortotaltaskcount.push(newobject)

    return (<section>
                {
                    fortotaltaskcount.map((array,i)=>{
                        let taskobject = array[Object.keys(array)]
                        let [total,done,notdone,delayed] = [taskobject.total.length,taskobject.done.length,taskobject.notdone.length,taskobject.delayed.length]
                        return ( <div className={styles.scoresummary} key={Math.random()}>
                            <p>Total : {total}</p>
                            <p>Done : {done}</p>
                            <p>Not Done : {notdone}</p>
                        </div>)
                    })
                }
    </section>)
}

export default ScoreSummary