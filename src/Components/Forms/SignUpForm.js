import {Fragment, useEffect, useState} from "react";
import logo from "../images/chukde-1.png"
import styles from "./SignUpForm.module.css" 
import error from "../images/error.webp"
import success from "../images/submit-successfully.png"
import wait from "../images/wait.webp"
import { Navigation } from "./Header";

function SignupForm(){
    let [successfullscreen, setscreen] = useState("")
    let [image,setImage] = useState()
    let [newuserid, setNewUserid] = useState()

    useEffect(()=>{

        let fetchusers = async () => {
            let fetchreq = await fetch("https://testproject-619f7-default-rtdb.firebaseio.com/newdatabase.json");
            let response = await fetchreq.json()
            let existingusers = Object.keys(response).map(user => Number(user.split("LSF")[1]))
            let lastuser = existingusers.sort((a,b)=>a-b)[existingusers.length-1]
            let newuser = lastuser+1
            setNewUserid("LSF00"+newuser)
        }
        fetchusers()
    },[])

    let submithandler =(e) => {
        e.preventDefault()
        setscreen("Saving your data pleae wait...")
        setImage(wait)
        let data = new FormData(e.target)
        let formdata = {
            user:data.get("user"),
            firstname:data.get("firstname"),
            lastname:data.get("lastname"),
            position:data.get("position"),
            phone:data.get("mobile"),
            email:data.get("email"),
            password:data.get("password"),
            dp:data.get("image"),
        }
        fetch(`https://testproject-619f7-default-rtdb.firebaseio.com/newdatabase/${newuserid}.json`,{
            method:"PUT",
            body:JSON.stringify({personalinfo:formdata,definedtasks:[{}]})
          }).then((response)=>{
                if(response.status == 200 ){
                    setscreen("Data saved successfully")
                    setImage(success)
                }
                return response
          })
          .catch(err=>{
            setscreen(err.message)
            setImage(error)
          })
    }

            {successfullscreen !=="" && <div className={styles.successfullscreen}><img src={image}/><p>{successfullscreen}</p></div>}
            return (
            <Fragment>
            <Navigation text={["login"]} to={["/"]}/>
            <div className={styles.SignupForm}>
                <div className={styles.imagecontainer}>
                    <img src={logo}/>
                </div>
                <div className={styles.formcontainer}>
                <center><h1>Sign up</h1></center>
                <form onSubmit={submithandler}>
                <label htmlFor="user"> User Id </label>
                <input type="text" id="user" name="user" defaultValue={newuserid} className="user" required/>
                <label htmlFor="first_name"> First Name </label>
                <input type="text" id="first_name" name="firstname" className="first_name" required/>
                <label htmlFor="last_name"> Last Name </label>
                <input type="text" id="last_name" name="lastname" className="last_name"/>
                <label htmlFor="position"> Position </label>
                <input type="text" id="position" name="position" className="position"/>
                <label htmlFor="image" title="your photo"> Image url </label>
                <input type="text" id="image" name="image" className="image" required />
                <label htmlFor="email"> Email </label>
                <input type="text" id="email" name="email" className="email" required/>
                <label htmlFor="password"> Password </label>
                <input type="password" id="password" name="password" className="password" required/>
                <button type="submit" name="submit" className={styles.submit}> Sign up </button>
                </form>
                </div>
                </div>
        </Fragment>
    )
}


export default SignupForm