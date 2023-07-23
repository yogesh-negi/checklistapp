import styles from "./Header.module.css"
import { NavLink } from "react-router-dom"

export let Navigation = (props) => {
    return <header className={styles.header}>
        { props.text.map((text,i)=>{
            return (<span key={text} title={`${text} `} className={styles.navigator}><NavLink to={props.to[i]}>{text}</NavLink></span>)
        })
        }
        </header>
}