import { Link } from "react-router-dom";
import aprovameLogo from "../../public/logo-bankme.png";
import { Search } from "lucide-react";

export function Home(){
  return(
    <div className="mx-auto max-w-5xl my-8 max-h-screen">
      <div className="w-full flex grid-cols-2 items-center justify-between h-10">
        <div className="flex grid-cols-2 items-center gap-2">
          <div className="bg-emerald-400 p-2 rounded-md">
            <img src={aprovameLogo} alt="Logo Aprovame" className="h-6 w-5"/>
          </div>
          <div className="flex p-2 rounded-md border border-zinc-600 gap-2">
            <Search stroke="gray" strokeWidth={2}/>
            <input type="text" name="" id="" className="bg-transparent outline-none text-zinc-400" placeholder="Pesquisar recebíveis..."/>
          </div>
        </div>
        
        <div className="flex grid-cols-2 items-center justify-between gap-4 p-1">
          <Link to="/account" className="text-zinc-300">Account</Link>
          <img src="https://github.com/carlospepato.png" alt="" className="h-8 w-8 rounded-full"/>
        </div>
      </div>
    </div>
  )
}