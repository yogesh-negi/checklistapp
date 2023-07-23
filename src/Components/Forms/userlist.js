import { Fragment } from "react"

export let Userlist = (props) => {
    let userlist = props.userdata
    return (<Fragment>
        {Object.keys(userlist).map(key=>{
            let userobject = userlist[key]
            return <ul style={{TextDecoration:"none"}}>
                     <li>{userobject.user}</li>
                    <li>{`${userobject.firstname} ${userobject.lastname}`}</li>
                    <li>{userobject.position}</li>
                    <li>{userobject.email}</li>
            </ul>
        })}
    </Fragment>)
}