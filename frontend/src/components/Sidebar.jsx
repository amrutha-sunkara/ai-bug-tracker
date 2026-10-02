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
dark:bg-gradient-to-b
dark:from-[#11152A]
dark:to-[#17132F]
border-r
border-violet-100
dark:border-purple-500/20
p-6
transition
shadow-[4px_0_20px_rgba(139,92,246,0.06)]
dark:shadow-[4px_0_25px_rgba(124,58,237,0.10)]
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

"bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-[0_6px_18px_rgba(99,102,241,0.25)]"
:

"text-gray-700 dark:text-slate-300 hover:bg-violet-50 dark:hover:bg-purple-500/10"
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