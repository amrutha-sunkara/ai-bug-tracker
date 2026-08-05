import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";

import { ThemeContext } from "../context/ThemeContext";


function Navbar({landing=false}){


const navigate = useNavigate();


const username = localStorage.getItem("username");


const {darkMode,setDarkMode}=useContext(ThemeContext);



const logout=()=>{

localStorage.clear();

navigate("/login");

};





return(


<div

className={`
h-20
flex
items-center
justify-between
px-8
transition-all
duration-300
z-50

${landing

?

"absolute top-0 left-0 w-full bg-transparent text-white"

:

"sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow border-b dark:border-slate-700"

}

`}

>




{/* Logo */}


<Link to={username ? "/dashboard" : "/"}>


<h1

className={`
text-3xl
font-bold

bg-gradient-to-r
from-cyan-400
to-purple-500

bg-clip-text
text-transparent

`}

>

🐞 Bug Tracker AI

</h1>


</Link>







<div className="
flex
items-center
gap-6
">





<button

onClick={()=>setDarkMode(!darkMode)}

className="
px-5
py-2
rounded-xl
bg-slate-800
text-white
hover:scale-105
transition

"

>

{
darkMode ? "☀️" : "🌙"
}


</button>







{

username ?


<>


<div className="
hidden
md:flex
items-center
gap-3
px-4
py-2
rounded-xl
bg-white/10
backdrop-blur
">


<div className="
w-10
h-10
rounded-full
bg-blue-600
flex
items-center
justify-center
text-white
font-bold
">


{
username.charAt(0).toUpperCase()
}


</div>


<span className="font-semibold">

{username}

</span>


</div>





<button

onClick={logout}

className="
bg-red-600
hover:bg-red-700
text-white
px-5
py-2
rounded-xl
transition
hover:scale-105

"

>

Logout

</button>



</>



:


<>


<Link

to="/login"

className="
font-semibold
hover:text-cyan-400
transition

"

>

Login

</Link>




<Link

to="/register"

className="
bg-emerald-500
hover:bg-emerald-600
text-white
px-6
py-2
rounded-xl
font-semibold
transition
hover:scale-105

"

>

Register

</Link>


</>


}



</div>





</div>


);


}


export default Navbar;