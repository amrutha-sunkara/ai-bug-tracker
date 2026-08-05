import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import api from "../services/api";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";



function ProjectDetails(){


const {id}=useParams();


const [project,setProject]=useState(null);

const [bugs,setBugs]=useState([]);





useEffect(()=>{

fetchDetails();

},[]);






const fetchDetails=async()=>{


try{


const response=await api.get(`/projects/${id}`);


setProject(response.data.project);

setBugs(response.data.bugs || []);



}

catch(error){

console.log(error);

}


};








const openBugs =
bugs.filter(
bug=>bug.status==="Open"
).length;



const closedBugs =
bugs.filter(
bug=>bug.status==="Closed"
).length;









const priorityStyle=(priority)=>{


if(priority==="High")

return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";


if(priority==="Medium")

return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";


return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";


};






const statusStyle=(status)=>{


if(status==="Open")

return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";


if(status==="In Progress")

return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";


return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";


};








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







{

project &&

<>



<div className="
bg-white
dark:bg-slate-900
rounded-xl
shadow-lg
p-8
mb-8
border
dark:border-slate-700
">



<div className="
flex
items-center
gap-4
">


<div className="
w-16
h-16
rounded-xl
bg-blue-100
dark:bg-blue-900
flex
items-center
justify-center
text-4xl
">

📁

</div>





<div>


<h1 className="
text-4xl
font-bold
text-gray-800
dark:text-white
">

{project.project_name}

</h1>



<p className="
text-gray-500
dark:text-gray-400
mt-2
">

Project ID #{project.project_id}

</p>



</div>


</div>






<p className="
mt-6
text-gray-700
dark:text-gray-300
text-lg
">

{project.description}

</p>




</div>






<div className="
grid
grid-cols-1
md:grid-cols-3
gap-6
mb-8
">



<div className="
bg-white
dark:bg-slate-900
p-6
rounded-xl
shadow
">

<p className="
text-gray-500
dark:text-gray-400
">

Total Bugs

</p>


<h2 className="
text-4xl
font-bold
dark:text-white
">

{bugs.length}

</h2>


</div>







<div className="
bg-white
dark:bg-slate-900
p-6
rounded-xl
shadow
">


<p className="
text-gray-500
dark:text-gray-400
">

Open Bugs

</p>


<h2 className="
text-4xl
font-bold
text-red-600
">

{openBugs}

</h2>


</div>







<div className="
bg-white
dark:bg-slate-900
p-6
rounded-xl
shadow
">


<p className="
text-gray-500
dark:text-gray-400
">

Closed Bugs

</p>


<h2 className="
text-4xl
font-bold
text-green-600
">

{closedBugs}

</h2>


</div>






</div>







<div className="
bg-white
dark:bg-slate-900
rounded-xl
shadow
p-6
">


<h2 className="
text-2xl
font-bold
mb-6
dark:text-white
">

Project Bugs

</h2>







{

bugs.length>0 ?



<div className="space-y-4">



{

bugs.map((bug)=>(



<div

key={bug.bug_id}

className="
border
dark:border-slate-700
rounded-xl
p-5
hover:shadow-lg
transition
"


>



<div className="
flex
justify-between
items-start
">


<div>


<h3 className="
text-xl
font-bold
dark:text-white
">

{bug.title}

</h3>



<p className="
text-gray-600
dark:text-gray-300
mt-2
">

{bug.description}

</p>



</div>





<div className="flex gap-3">


<span className={`
px-3
py-1
rounded-full
font-semibold
${priorityStyle(bug.priority)}
`}>

{bug.priority}

</span>




<span className={`
px-3
py-1
rounded-full
font-semibold
${statusStyle(bug.status)}
`}>

{bug.status}

</span>



</div>



</div>





</div>


))


}



</div>





:




<div className="
text-center
text-gray-500
dark:text-gray-400
p-8
">


No bugs reported for this project



</div>



}




</div>







</>



}






</div>






</div>





</div>



);


}



export default ProjectDetails;