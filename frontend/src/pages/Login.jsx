import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import api from "../services/api";

import { ThemeContext } from "../context/ThemeContext";
import { Bug } from "lucide-react";

export default function Login(){


const navigate = useNavigate();

const {darkMode}=useContext(ThemeContext);



const [email,setEmail]=useState("");

const [password,setPassword]=useState("");

const [message,setMessage]=useState("");





const handleLogin = async (e) => {

    e.preventDefault();

    try {

        const response = await api.post("/api/login", {
            email,
            password
        });


        localStorage.clear();


        localStorage.setItem(
            "token",
            response.data.token
        );


        localStorage.setItem(
            "username",
            response.data.username
        );


        localStorage.setItem(
            "email",
            response.data.email
        );


        localStorage.setItem(
            "role",
            response.data.role || "Developer"
        );


        navigate("/dashboard");


    }

    catch(error) {


        setMessage(
            error.response?.data?.message ||
            "Invalid Email or Password"
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

transition-all

${darkMode

?

"bg-gradient-to-br from-slate-950 via-slate-900 to-black"

:

"bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-200"

}

`}>



<form

onSubmit={handleLogin}

className={`
w-full
max-w-md
p-10
rounded-3xl
shadow-2xl
backdrop-blur-xl
border
transition
hover:scale-[1.02]

${darkMode

?

"bg-slate-900/80 border-slate-700 text-white"

:

"bg-white/80 border-white text-gray-900"

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
bg-blue-600
rounded-full
p-3
shadow-lg
"

/>

</div>


<h1 className="
text-4xl
font-bold
bg-gradient-to-r
from-blue-600
to-purple-600
bg-clip-text
text-transparent
">

Welcome Back

</h1>


<p className="
mt-3
text-gray-500
dark:text-gray-400
">

Login to Bug Tracker AI

</p>


</div>






<input

type="email"

placeholder="Email Address"

value={email}

onChange={(e)=>setEmail(e.target.value)}

required


className={`
w-full
p-4
rounded-xl
mb-5
border
outline-none
transition

focus:ring-2
focus:ring-blue-500

${darkMode

?

"bg-slate-800 border-slate-700 text-white"

:

"bg-white border-gray-300"

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
rounded-xl
mb-6
border
outline-none

focus:ring-2
focus:ring-blue-500


${darkMode

?

"bg-slate-800 border-slate-700 text-white"

:

"bg-white border-gray-300"

}

`}

/>








<button

className="
w-full
py-4
rounded-xl
font-bold
text-white

bg-gradient-to-r
from-blue-600
to-purple-600

hover:scale-105
transition

shadow-lg

"

>

Login 🚀


</button>






{

message &&

<p className="
text-red-500
text-center
mt-5
font-semibold
">

{message}

</p>


}




</form>


</div>



<Footer/>


</>

);


}