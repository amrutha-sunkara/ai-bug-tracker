import {useState,useContext} from "react";

import {Link} from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import api from "../services/api";

import {ThemeContext} from "../context/ThemeContext";
import { Bug } from "lucide-react";


export default function Register(){



const {darkMode}=useContext(ThemeContext);



const [username,setUsername]=useState("");

const [email,setEmail]=useState("");

const [password,setPassword]=useState("");

const [role,setRole]=useState("Developer");





const handleSubmit = async (e) => {

    e.preventDefault();


    try {


        const response = await api.post("/api/register", {

            username,
            email,
            password,
            role

        });



        alert(response.data.message);



        setUsername("");

        setEmail("");

        setPassword("");

        setRole("Developer");



    }


    catch(error) {


        alert(

            error.response?.data?.message ||

            "Registration Failed"

        );


    }


};







return(

<>


<Navbar/>


<div className={`
min-h-screen
flex
items-center
justify-center
px-5


${darkMode

?

"bg-gradient-to-br from-slate-950 via-slate-900 to-black"

:

"bg-gradient-to-br from-emerald-100 via-blue-100 to-purple-200"

}

`}>



<form

onSubmit={handleSubmit}

className={`
w-full
max-w-md
p-10
rounded-3xl
shadow-2xl
border
backdrop-blur-xl
hover:scale-[1.02]
transition


${darkMode

?

"bg-slate-900/80 border-slate-700 text-white"

:

"bg-white/80 border-white"

}

`}


>




<div className="text-center mb-8">


<div className="flex justify-center mb-4">

<Bug

size={60}

strokeWidth={2}

className="
text-white
bg-emerald-600
rounded-full
p-3
shadow-lg
"

/>

</div>



<h1 className="
text-4xl
font-bold
mt-4

bg-gradient-to-r
from-emerald-600
to-blue-600

bg-clip-text
text-transparent

">

Create Account

</h1>



<p className="
text-gray-500
dark:text-gray-400
mt-2
">

Join Bug Tracker AI

</p>



</div>







<input

placeholder="Username"

value={username}

onChange={(e)=>setUsername(e.target.value)}

required


className={`
w-full
p-4
mb-4
rounded-xl
border

${darkMode

?

"bg-slate-800 border-slate-700 text-white"

:

"bg-white"

}

`}

/>








<input

type="email"

placeholder="Email Address"

value={email}

onChange={(e)=>setEmail(e.target.value)}

required


className={`
w-full
p-4
mb-4
rounded-xl
border

${darkMode

?

"bg-slate-800 border-slate-700 text-white"

:

"bg-white"

}

`}

/>









<input

type="password"

placeholder="Password"

value={password}

onChange={(e)=>setPassword(e.target.value)}

required


className={`
w-full
p-4
mb-4
rounded-xl
border

${darkMode

?

"bg-slate-800 border-slate-700 text-white"

:

"bg-white"

}

`}

/>








<select

value={role}

onChange={(e)=>setRole(e.target.value)}

className={`
w-full
p-4
mb-6
rounded-xl
border

${darkMode

?

"bg-slate-800 border-slate-700 text-white"

:

"bg-white"

}

`}

>


<option>Developer</option>

<option>Tester</option>

<option>Manager</option>


</select>








<button

className="
w-full
py-4
rounded-xl
font-bold
text-white

bg-gradient-to-r
from-emerald-600
to-blue-600

hover:scale-105
transition

shadow-lg

"

>

Create Account ✨


</button>







<p className="text-center mt-6">


Already have an account?


<Link

to="/login"

className="
text-blue-600
font-semibold
ml-2
"

>

Login

</Link>


</p>



</form>



</div>



<Footer/>


</>


);


}