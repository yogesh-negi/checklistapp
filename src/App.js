import logo from './logo.svg';
import index from "./index.css"
import {Switch,Route,Redirect,useHistory} from "react-router-dom"
import SignupForm from "./Components/Forms/SignUpForm"
import LoginForm from "./Components/Forms/LoginForm"
import NewTaskForm from './Components/Forms/NewTask';
import {TaskDasboard} from "./Components/Forms/TaskDashboard.js"
import {useSelector} from "react-redux"
import {SubmittedTasksDashboard} from "./Components/Forms/TaskList"
import { PendingTaskDashboard } from './Components/Forms/TaskDashboard';
import {DelayedtasksDashboard} from "./Components/Forms/DelayedTasks"

function App() {
  let date = new Date()
  let history = useHistory();
  document.title = "LifeStyle Checklist"
  let validation = useSelector(state=>state.validated)
  let user = useSelector(state=>state.user)
  if(validation && user == "ADMIN") {
    history.replace(`/taskreport`,validation)
  } else if(user !=="" && validation) {
    history.replace(`/taskdashboard/${user}`,validation)
  }


  return (
    <div className='app-container'>
      <Switch>
      <Route path="/" exact>
        <LoginForm/>
      </Route>
      <Route path="/signup">
      <SignupForm/>
      </Route>
      <Route path="/newtask">
      <NewTaskForm/>
      </Route>
      <Route path="/taskdashboard/:user" exact>
      <TaskDasboard/>
      </Route>
      <Route path="/taskdashboard/:user/pendingtasks">
      <PendingTaskDashboard/>
      </Route>
      <Route path="/taskdashboard/:user/delayedtasks">
      <DelayedtasksDashboard/>
      </Route>
      <Route path="/taskreport" >
      <SubmittedTasksDashboard/>
      </Route>
      </Switch>
    </div>
  );
}

export default App;
