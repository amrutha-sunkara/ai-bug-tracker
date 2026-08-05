import { useState } from "react";

import api from "../services/api";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import toast from "react-hot-toast";


function CreateProject(){

const [projectName,setProjectName]=useState("");
const [description,setDescription]=useState("");
const [loading,setLoading]=useState(false);


const handleSubmit = async(e)=>{

e.preventDefault();

try{

setLoading(true);


const response = await api.post("/api/projects",{

project_name: projectName,

description: description

});



toast.success(
"🚀 Project created successfully!"
);



setProjectName("");

setDescription("");



}

catch(error){


console.log(error.response?.data);


toast.error(
error.response?.data?.message ||
"❌ Unable to create project"
);


}


finally{

setLoading(false);

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


<div className="
p-8
flex
justify-center
">


<div className="
w-full
max-w-2xl
">


<div className="mb-8">


<h1 className="
text-4xl
font-bold
text-gray-800
dark:text-white
">

Create Project

</h1>


<p className="
text-gray-600
dark:text-gray-400
mt-2
">

Create and manage a new software project

</p>


</div>




<form

onSubmit={handleSubmit}

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


<div>


<label className="
block
font-semibold
mb-2
text-gray-700
dark:text-gray-300
">

📁 Project Name

</label>



<input

type="text"

placeholder="Enter project name"

value={projectName}

onChange={(e)=>setProjectName(e.target.value)}

className="
w-full
p-4
rounded-xl
border
dark:bg-slate-800
dark:border-slate-700
dark:text-white
focus:ring-2
focus:ring-blue-500
outline-none
"

required

/>


</div>




<div>


<label className="
block
font-semibold
mb-2
text-gray-700
dark:text-gray-300
">

📝 Project Description

</label>



<textarea

rows="6"

placeholder="Describe your project..."

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
focus:ring-2
focus:ring-blue-500
outline-none
"

required

/>


</div>




<button

disabled={loading}

className="
w-full
bg-blue-600
text-white
py-4
rounded-xl
font-semibold
hover:bg-blue-700
transition
"

>


{

loading

?

"Creating Project..."

:

"🚀 Create Project"

}


</button>



</form>



</div>


</div>


</div>


</div>

);


}


export default CreateProject;