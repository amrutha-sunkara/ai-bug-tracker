import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";


function ViewProjects(){

const [projects,setProjects]=useState([]);

const navigate=useNavigate();



const getProjects=async()=>{

try{

const response = await api.get("/api/projects");

setProjects(response.data.projects || []);

}

catch(error){

console.log(
error.response?.data || error.message
);

}


};


useEffect(()=>{

// eslint-disable-next-line react-hooks/set-state-in-effect
getProjects();

},[]);
return(

<div className="
flex
min-h-screen
bg-gray-100
dark:bg-slate-950
">


<Sidebar/>





<div className="flex-1">


<Navbar/>





<div className="p-8">





<h1 className="
text-3xl
font-bold
mb-2
text-gray-800
dark:text-white
">

Projects

</h1>



<p className="
text-gray-600
dark:text-gray-400
mb-8
">

Manage and track all software projects

</p>








<div className="
grid
grid-cols-1
md:grid-cols-2
lg:grid-cols-3
gap-6
">





{

projects.length > 0 ?


projects.map((project)=>(


<div

key={project.project_id}

onClick={()=>navigate(`/project/${project.project_id}`)}

className="
cursor-pointer
bg-white
dark:bg-slate-900
rounded-xl
shadow-lg
p-6
border
border-gray-200
dark:border-slate-700
hover:shadow-2xl
hover:-translate-y-1
transition
"


>




<div className="
flex
justify-between
items-center
mb-4
">



<div className="
w-12
h-12
rounded-xl
bg-blue-100
dark:bg-blue-900
flex
items-center
justify-center
text-2xl
">

📂

</div>




<span className="
text-sm
text-gray-500
dark:text-gray-400
">

ID #{project.project_id}

</span>



</div>









<h2 className="
text-xl
font-bold
text-blue-600
dark:text-blue-400
mb-3
">

{project.project_name}

</h2>








<p className="
text-gray-600
dark:text-gray-300
line-clamp-3
">

{project.description}

</p>








<button

onClick={(e)=>{

e.stopPropagation();

navigate(`/project/${project.project_id}`);

}}

className="
mt-6
w-full
bg-blue-600
hover:bg-blue-700
text-white
py-2
rounded-lg
transition
"

>

View Details

</button>





</div>



))


:




<div className="
col-span-full
bg-white
dark:bg-slate-900
rounded-xl
p-10
text-center
text-gray-500
dark:text-gray-400
shadow
">


No projects available



</div>



}





</div>







</div>






</div>





</div>


);


}


export default ViewProjects;