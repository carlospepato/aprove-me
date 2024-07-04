import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/home";
import { Login } from "./pages/login";
import { Account } from "./pages/account";

export function Router(){
  return(
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/account" element={<Account/>}/>
    </Routes>
  )
}