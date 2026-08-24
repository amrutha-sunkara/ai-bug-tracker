import { NavLink } from "react-router-dom";



function Sidebar(){
  
    const role = localStorage.getItem("role");


const menu = [

    {
        name:"Dashboard",
        path:"/dashboard",
        icon:"📊",
        roles:["Manager","Tester","Developer"]
    },

    {
        name:"Create Project",
        path:"/create-project",
        icon:"📁",
        roles:["Manager"]
    },

    {
        name:"Projects",
        path:"/view-projects",
        icon:"🗂️",
        roles:["Manager","Tester","Developer"]
    },

    {
        name:"Report Bug",
        path:"/report-bug",
        icon:"🤖",
        roles:["Manager","Tester"]
    },

    {
        name:"Bug Management",
        path:"/view-bugs",
        icon:"🐞",
        roles:["Manager","Tester","Developer"]
    },
    {
    name:"Sprint Management",
    path:"/sprint-management",
    icon:"🏃",
    roles:["Manager","Tester","Developer"]
},

    {
        name:"AI Resolution Assistance",
        path:"/ai-resolution",
        icon:"🤖",
        roles:["Manager","Tester","Developer"]
    }

];




return(



<div className="
w-72
min-h-screen
bg-white
dark:bg-slate-900
border-r
dark:border-slate-700
p-6
transition
">







{/* Brand */}



<div className="
mb-10
">


<h1 className="
text-3xl
font-bold
bg-gradient-to-r
from-blue-500
to-purple-600
bg-clip-text
text-transparent
">

Bug Tracker

</h1>


<p className="
text-sm
text-gray-500
dark:text-gray-400
mt-2
">

AI Powered Management

</p>


</div>










<nav className="
space-y-3
">





{

 menu
        .filter((item) => item.roles.includes(role))
        .map((item)=>(


<NavLink


key={item.path}

to={item.path}



className={({isActive})=>`


flex
items-center
gap-4
px-4
py-3
rounded-xl
font-semibold
transition
duration-300


${

isActive

?

"bg-blue-600 text-white shadow-lg"

:

"text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"

}



`}



>



<span className="text-xl">

{item.icon}

</span>



<span>

{item.name}

</span>



</NavLink>



))


}




</nav>







{/* Bottom */}



<div className="
absolute
bottom-6
w-60
bg-gradient-to-r
from-blue-600
to-purple-600
rounded-xl
p-4
text-white
">


<p className="
font-bold
">

✨ Gemini AI

</p>


<p className="
text-sm
opacity-90
">

Smart bug reports powered by AI

</p>


</div>







</div>



);


}


export default Sidebar;