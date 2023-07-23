import { useParams } from "react-router-dom"
import dummy from "../images/dummy.jpg"
import styles from "./Card.module.css"
import LSF001 from "../images/LSF001.jpeg"
import LSF002 from "../images/LSF002.jpg"
import LSF003 from "../images/LSF003.jpg"
import LSF004 from "../images/LSF004.jpeg"
// import LSF005 from "../images/LSF005.jpeg"
// import LSF0011 from "../images/LSF0011.jpeg"
// import LSF0012 from "../images/LSF0012.jpeg"
import LSF006 from "../images/LSF006.jpeg"
import LSF007 from "../images/LSF007.jpg"
import LSF008 from "../images/LSF008.png"
import LSF009 from "../images/LSF009.jpg"
import LSF0010 from "../images/LSF0010.jpg"


export let Card = (props) => {
    let images = {LSF001,LSF002,LSF003,LSF004,LSF006,LSF007,LSF008,LSF009,LSF0010 }// LSF005,// LSF0011,// LSF0012

    let params = useParams()
    let userid = params.user
    let userdata = props.userdata
    
    return (<div className={styles.card}>
        <div>
        <img className={styles.cardimage} src={!userdata.dp || userdata.dp=="na" || userdata.dp=="NA" ? dummy : images[userdata.user]} />
        </div>
        <div className={styles.carddetails}>
        <p>{userdata.firstname}</p>
        <p>{userdata.position}</p>
        <p>{userdata.user}</p>
        </div>
      </div>)
}