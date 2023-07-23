import {useState, useEffect} from "react"

let useSendRequest = (url,obj={}) => {
   let [result, setResult] = useState([])
   let [errormessage, setErrormessage] = useState()
   let [status, setStatus] = useState(null)
   let [loading, setLoading] = useState(true)

   useEffect(()=>{

    fetch(url,obj).then(response=>{
        setLoading(true)
        setStatus(response.status)
        return response.json()
    }).then(data=>{
        setResult(data)
        setLoading(false)
        return data
    }).catch(error=>{
        setLoading(false)
        setErrormessage(error.message)
    })
   },[status])
 
    
    return [result,status,errormessage,loading]

}

export default useSendRequest