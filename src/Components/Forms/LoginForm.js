import { useSelector, useDispatch } from "react-redux";
import {NavLink } from "react-router-dom";
import logo from "../images/chukde-1.png"
import styles from "./LoginForm.module.css" 
import {authentication} from "../Store/store"
import { useState } from "react";
import {newdatabase} from "../databasefile"
import useSendRequest from "./useSendRequest"

let LoginForm = () => {
    let dispatcher = useDispatch()
    
    let submithandler = (e) => {
        e.preventDefault()
        let formdata = new FormData(e.target)
        let user = formdata.get("user")
        let password = formdata.get("password")
         if(password == "admin" && user == "admin") {
            dispatcher(authentication({user:user,password:password}))
            return
        }


       fetch(`https://testproject-619f7-default-rtdb.firebaseio.com/newdatabase/${user}.json`).then(res=>{ 
       return res.json()
       }).then(newdata=>{
        if(newdata.personalinfo.password == password)
        {
            dispatcher(authentication({user:user,password:password}))
        } else {
            alert("Invalid userid or password")
        return false
        }
       }).catch(err=>{
            return <p>something went wrong.</p>
       })
        
    }

    return (
        <section className={styles.LoginForm}>
            <div className={styles.wrapper}>
                <div className={styles.imagecontainer}>
                    <img src={logo}/>
                </div>
                <div className={styles.form}>
                <center><h1>Login</h1></center>
                <form onSubmit={submithandler}>
                <label htmlFor="user"> User Id </label>
                <input type="text" id="user" name="user" className="user" required/>
                <label htmlFor="password"> Password </label>
                <input type="text" id="password" name="password" className="password" required/>
                <button type="submit" name="submit" className={styles.submit}> Login </button>
                <center><p>or</p></center>
                <center><NavLink to="signup">Sign up</NavLink></center>
                </form>
                </div>
                </div>
        </section>
    )
}


export default LoginForm