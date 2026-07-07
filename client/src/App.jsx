import Login from "./component/Login"
import Otp from "./component/Otp"
import Signup from "./component/Signup"
import {BrowserRouter,Routes,Route} from "react-router-dom"
function App() {
 

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/login-otp" element={<Otp/>} />
      </Routes>
     </BrowserRouter>


        //   <Route path="/signup" Component={<Signup/>}/>
    //   <Route path="/login" Component={<Login/>}/>
    //   <Route path="/login-otp" Component={<Otp/>} />
    //   <Route path="/signup-otp" Component={<Otp/>}/>

  )
}

export default App
