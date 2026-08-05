import { useEffect, useState } from "react";

import api from "../services/api";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import toast from "react-hot-toast";


function ReportBug(){

const [projects,setProjects]=useState([]);

const [users,setUsers]=useState([]);

const [title,setTitle]=useState("");

const [description,setDescription]=useState("");

const [priority,setPriority]=useState("Medium");

const [projectId,setProjectId]=useState("");

const [assignedTo,setAssignedTo]=useState("");

const [aiReport,setAiReport]=useState("");

const [aiLoading,setAiLoading]=useState(false);



useEffect(()=>{

fetchProjects();

fetchUsers();

},[]);





const fetchProjects = async()=>{

try{

const response = await api.get("/api/projects");

setProjects(response.data.projects || []);

}

catch(error){

console.log(error);

}

};





const fetchUsers = async()=>{

try{

const response = await api.get("/api/users");

setUsers(response.data.users || []);

}

catch(error){

console.log(error);

}

};






const generateAIReport = async()=>{


if(!description){

toast.error("Please enter bug description");

return;

}


try{


setAiLoading(true);


setAiReport(
"🤖 Gemini AI is analyzing your bug..."
);



const response = await api.post("/api/improve_bug",{

description

});



setAiReport(
response.data.bug_report
);



toast.success(
"✨ AI report generated!"
);


}


catch(error){


console.log(error.response?.data);


toast.error(
"AI generation failed"
);


}


finally{


setAiLoading(false);


}


};






const submitBug = async(e)=>{


e.preventDefault();



if(!projectId){

toast.error("Please select a project");

return;

}



if(!assignedTo){

toast.error("Please assign a developer");

return;

}



try{


await api.post("/api/bugs",{


title,

description: aiReport || description,

priority,

project_id: projectId,

assigned_to: assignedTo


});



toast.success(
"🐞 Bug reported successfully!"
);



setTitle("");

setDescription("");

setAiReport("");

setProjectId("");

setAssignedTo("");

setPriority("Medium");



}


catch(error){


console.log(error.response?.data);



toast.error(

error.response?.data?.message ||

"Bug submission failed"

);


}


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
text-gray-800
dark:text-white
mb-2
">

🐞 Report Bug

</h1>


<p className="
text-gray-600
dark:text-gray-400
mb-8
">

Create bug reports and improve them using Gemini AI

</p>




<form

onSubmit={submitBug}

className="
bg-white
dark:bg-slate-900
rounded-2xl
shadow-xl
p-8
border
dark:border-slate-700
space-y-6
"

>




<div className="
grid
md:grid-cols-2
gap-6
">



<div>


<label className="
font-semibold
dark:text-gray-300
">

Bug Title

</label>



<input

value={title}

onChange={(e)=>setTitle(e.target.value)}

placeholder="Enter bug title"

className="
w-full
mt-2
p-3
rounded-xl
border
dark:bg-slate-800
dark:border-slate-700
dark:text-white
"

required

/>


</div>





<div>


<label className="
font-semibold
dark:text-gray-300
">

Priority

</label>



<select

value={priority}

onChange={(e)=>setPriority(e.target.value)}

className="
w-full
mt-2
p-3
rounded-xl
border
dark:bg-slate-800
dark:border-slate-700
dark:text-white
"

>


<option>High</option>

<option>Medium</option>

<option>Low</option>


</select>



</div>



</div>







<select

value={projectId}

onChange={(e)=>setProjectId(e.target.value)}

className="
w-full
p-3
rounded-xl
border
dark:bg-slate-800
dark:border-slate-700
dark:text-white
"

required

>


<option value="">

Select Project

</option>


{

projects.map(project=>(

<option

key={project.project_id}

value={project.project_id}

>

{project.project_name}

</option>

))

}


</select>







<select

value={assignedTo}

onChange={(e)=>setAssignedTo(e.target.value)}

className="
w-full
p-3
rounded-xl
border
dark:bg-slate-800
dark:border-slate-700
dark:text-white
"

required

>


<option value="">

Assign Developer

</option>


{

users.map(user=>(

<option

key={user.user_id}

value={user.user_id}

>

{user.username}

</option>


))

}


</select>







<textarea

rows="5"

placeholder="Describe the bug..."

value={description}

onChange={(e)=>setDescription(e.target.value)}

className="
w-full
p-4
rounded-xl
border
dark:bg-slate-800
dark:border-slate-700
dark:text-white
"

required

/>







<div className="
bg-gradient-to-r
from-purple-600
to-blue-600
rounded-xl
p-6
text-white
">


<h2 className="
text-2xl
font-bold
mb-3
">

✨ Gemini AI Assistant

</h2>



<p className="mb-4 opacity-90">

Convert your bug description into a professional QA report

</p>



<button

type="button"

onClick={generateAIReport}

disabled={aiLoading}

className="
bg-white
text-purple-700
px-6
py-3
rounded-xl
font-semibold
hover:scale-105
transition
"

>


{

aiLoading

?

"🤖 Gemini is thinking..."

:

"✨ Generate AI Report"

}


</button>


</div>








<textarea

rows="10"

value={aiReport}

readOnly

placeholder="AI generated bug report appears here..."

className="
w-full
p-4
rounded-xl
border
bg-gray-50
dark:bg-slate-800
dark:border-slate-700
dark:text-white
"

/>







<button

className="
w-full
bg-blue-600
hover:bg-blue-700
text-white
py-4
rounded-xl
font-bold
text-lg
transition
hover:scale-[1.02]
"

>

🚀 Submit Bug

</button>





</form>



</div>


</div>


</div>


);


}


export default ReportBug;