import { useEffect, useState } from "react";

import api from "../services/api";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";



function ViewBugs(){


const [bugs,setBugs]=useState([]);

const [search,setSearch]=useState("");

const [statusFilter,setStatusFilter]=useState("All");

const [priorityFilter,setPriorityFilter]=useState("All");








useEffect(()=>{

fetchBugs();

},[]);






const fetchBugs=async()=>{


try{


const response=await api.get("/bugs");

setBugs(response.data.bugs || []);


}

catch(error){

console.log(error);

}



};








const updateStatus=async(id,status)=>{


try{


await api.put(`/bugs/${id}`,{

status

});


fetchBugs();


}

catch(error){

console.log(error);

}


};








const deleteBug=async(id)=>{


try{


await api.delete(`/bugs/${id}`);


fetchBugs();



}

catch(error){

console.log(error);

}


};









const filteredBugs=bugs.filter((bug)=>{


return (

bug.title
.toLowerCase()
.includes(search.toLowerCase())

&&

(
statusFilter==="All" ||
bug.status===statusFilter
)

&&

(
priorityFilter==="All" ||
bug.priority===priorityFilter
)


);


});









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








<h1 className="
text-4xl
font-bold
dark:text-white
mb-2
">

🐞 Bug Management

</h1>



<p className="
text-gray-600
dark:text-gray-400
mb-8
">

Track, update and manage software issues

</p>









{/* Filters */}



<div className="
bg-white
dark:bg-slate-900
rounded-xl
shadow
p-6
mb-8
grid
md:grid-cols-3
gap-5
">





<input


placeholder="Search bugs..."

value={search}

onChange={(e)=>setSearch(e.target.value)}

className="
p-3
rounded-xl
border
dark:bg-slate-800
dark:border-slate-700
dark:text-white
"


/>







<select


value={statusFilter}

onChange={(e)=>setStatusFilter(e.target.value)}

className="
p-3
rounded-xl
border
dark:bg-slate-800
dark:border-slate-700
dark:text-white
"


>


<option>All</option>

<option>Open</option>

<option>In Progress</option>

<option>Closed</option>


</select>







<select


value={priorityFilter}

onChange={(e)=>setPriorityFilter(e.target.value)}

className="
p-3
rounded-xl
border
dark:bg-slate-800
dark:border-slate-700
dark:text-white
"


>


<option>All</option>

<option>High</option>

<option>Medium</option>

<option>Low</option>


</select>







</div>









{/* Bug Cards */}





<div className="
grid
grid-cols-1
lg:grid-cols-2
gap-6
">





{

filteredBugs.length>0 ?



filteredBugs.map((bug)=>(




<div

key={bug.bug_id}

className="
bg-white
dark:bg-slate-900
rounded-2xl
shadow-lg
p-6
border
dark:border-slate-700
hover:-translate-y-1
transition
"

>







<div className="
flex
justify-between
mb-4
">





<div>


<h2 className="
text-xl
font-bold
dark:text-white
">

{bug.title}

</h2>


<p className="
text-gray-600
dark:text-gray-300
mt-2
">

{bug.description}

</p>


</div>







🐞



</div>









<div className="
flex
gap-3
mb-5
">


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









<div className="
flex
justify-between
items-center
">





<select


value={bug.status}

onChange={(e)=>
updateStatus(
bug.bug_id,
e.target.value
)
}


className="
p-2
rounded-lg
border
dark:bg-slate-800
dark:border-slate-700
dark:text-white
"


>


<option>Open</option>

<option>In Progress</option>

<option>Closed</option>


</select>







<button


onClick={()=>deleteBug(bug.bug_id)}

className="
bg-red-600
hover:bg-red-700
text-white
px-4
py-2
rounded-lg
transition
"


>

Delete

</button>







</div>








<div className="
mt-4
text-sm
text-gray-500
dark:text-gray-400
">

Assigned To:
<b>
 {bug.assigned_to || "Not Assigned"}
</b>

</div>






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
">

No bugs found


</div>



}







</div>









</div>







</div>







</div>



);


}



export default ViewBugs;