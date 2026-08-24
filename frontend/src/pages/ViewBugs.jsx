import { useEffect, useState } from "react";

import api from "../services/api";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";



function ViewBugs(){


const [bugs,setBugs]=useState([]);
const [sprints,setSprints]=useState([]);

const [search,setSearch]=useState("");


const [statusFilter,setStatusFilter]=useState("All");

const [priorityFilter,setPriorityFilter]=useState("All");
const [comments, setComments] = useState({});
const [activities, setActivities] = useState({});



useEffect(()=>{
fetchBugs();
fetchSprints();

},[]);

const fetchBugs = async()=>{

    try{

        const response = await api.get("/api/bugs");

        const bugList = response.data.bugs || [];

        setBugs(bugList);

        bugList.forEach((bug) => {
            fetchComments(bug.bug_id);
            fetchActivity(bug.bug_id);
        });

    }

    catch(error){

        console.log(error.response?.data);

    }

};
const fetchSprints = async () => {
    try {
        const response = await api.get("/api/sprints");

        setSprints(response.data.sprints || []);
    }
    catch (error) {
        console.log(error.response?.data);
    }
};
const fetchComments = async (bugId) => {

    try {

        const response = await api.get(
            `/api/bugs/${bugId}/comments`
        );

        setComments((prev) => ({
            ...prev,
            [bugId]: response.data.comments || []
        }));

    }

    catch(error) {

        console.log(error.response?.data);

    }

};
const fetchActivity = async (bugId) => {
    try {
        const response = await api.get(
            `/api/bugs/${bugId}/activity`
        );

        setActivities((prev) => ({
            ...prev,
            [bugId]: response.data.activities || []
        }));
    }
    catch (error) {
        console.log(error.response?.data);
    }
};
const addComment = async (bugId) => {

    const commentText = prompt("Enter your comment:");

    if (!commentText || !commentText.trim()) {
        return;
    }

    try {

        await api.post(
            `/api/bugs/${bugId}/comments`,
            {
                comment: commentText
            }
        );

        fetchComments(bugId);

    }

    catch(error) {

        console.log(error.response?.data);

    }

};




const updateStatus = async(id,status)=>{

try{

await api.put(`/api/bugs/${id}`,{

status

});

fetchBugs();

}

catch(error){

console.log(error.response?.data);

}

};
const assignSprint = async (bugId, sprintId) => {

    try {

        await api.put(
            `/api/bugs/${bugId}/sprint`,
            {
                sprint_id: Number(sprintId)
            }
        );

        fetchBugs();

    }
    catch (error) {

        console.log(error.response?.data);

        alert(
            error.response?.data?.message ||
            "Failed to assign sprint"
        );

    }

};





const deleteBug = async(id)=>{

try{

await api.delete(`/api/bugs/${id}`);

fetchBugs();

}

catch(error){

console.log(error.response?.data);

}

};
const uploadFile = async (bugId, file) => {

    if (!file) {
        return;
    }

    try {

        const formData = new FormData();

        formData.append("file", file);

        await api.post(
            `/api/bugs/${bugId}/attachments`,
            formData
        );

        alert("File uploaded successfully!");

    }
    catch(error) {

        console.log(error.response?.data);

        alert(
            error.response?.data?.message ||
            "File upload failed"
        );

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









const priorityStyle = (priority) => {

    if (priority === "Critical")
        return "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300";

    if (priority === "High")
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";

    if (priority === "Medium")
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";

    return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
};







const statusStyle = (status) => {

    if (status === "Open")
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";

    if (status === "In Progress")
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";

    if (status === "In Review")
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";

    if (status === "Resolved")
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";

    return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
};
const getNextStatuses = (status) => {

    if (status === "Open") {
        return ["Open", "In Progress"];
    }

    if (status === "In Progress") {
        return ["In Progress", "In Review"];
    }

    if (status === "In Review") {
        return ["In Review", "Resolved"];
    }

    return ["Resolved"];
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

<option>In Review</option>

<option>Resolved</option>

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
<option>Critical</option>

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

    onChange={(e) =>
        updateStatus(
            bug.bug_id,
            e.target.value
        )
    }

    disabled={bug.status === "Resolved"}

    className="
    p-2
    rounded-lg
    border
    dark:bg-slate-800
    dark:border-slate-700
    dark:text-white
    disabled:opacity-60
    "

>

    {
        getNextStatuses(bug.status).map((status) => (

            <option
                key={status}
                value={status}
            >
                {status}
            </option>

        ))
    }

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
<div className="mt-4">

    <label className="
        block
        text-sm
        font-semibold
        text-gray-700
        dark:text-gray-300
        mb-2
    ">
        🏃 Sprint
    </label>

    <select
        value={bug.sprint_id || ""}
        onChange={(e) =>
            assignSprint(
                bug.bug_id,
                e.target.value
            )
        }
        className="
            w-full
            p-3
            rounded-lg
            border
            dark:bg-slate-800
            dark:border-slate-700
            dark:text-white
        "
    >

        <option value="">
            Select Sprint
        </option>

        {sprints.map((sprint) => (

            <option
                key={sprint.sprint_id}
                value={sprint.sprint_id}
            >
                {sprint.sprint_name}
            </option>

        ))}

    </select>

</div>
<div className="mt-5">

    <label className="
        block
        text-sm
        font-semibold
        text-gray-700
        dark:text-gray-300
        mb-2
    ">
        📎 Attach File
    </label>

    <input
        type="file"
        onChange={(e) =>
            uploadFile(
                bug.bug_id,
                e.target.files[0]
            )
        }
        className="
            w-full
            p-2
            rounded-lg
            border
            dark:bg-slate-800
            dark:border-slate-700
            dark:text-white
        "
    />

</div>

{/* Comments */}

<div className="
mt-6
border-t
dark:border-slate-700
pt-5
">

    <h3 className="
    font-bold
    text-lg
    dark:text-white
    mb-3
    ">
        💬 Comments
    </h3>

    {

        comments[bug.bug_id]?.length > 0 ?

        <div className="space-y-3">

            {
                comments[bug.bug_id].map((comment) => (

                    <div
                        key={comment.comment_id}
                        className="
                        bg-gray-50
                        dark:bg-slate-800
                        p-3
                        rounded-lg
                        "
                    >

                        <p className="
                        text-gray-700
                        dark:text-gray-200
                        ">
                            {comment.comment}
                        </p>

                        <p className="
                        text-xs
                        text-gray-500
                        dark:text-gray-400
                        mt-1
                        ">
                            By {comment.username}
                        </p>

                    </div>

                ))
            }

        </div>

        :

        <p className="
        text-sm
        text-gray-500
        dark:text-gray-400
        ">
            No comments yet.
        </p>

    }

    <button
        onClick={() => addComment(bug.bug_id)}
        className="
        mt-4
        bg-blue-600
        hover:bg-blue-700
        text-white
        px-4
        py-2
        rounded-lg
        "
    >
        💬 Add Comment
    </button>

</div>
{/* Activity History */}

<div className="
mt-6
border-t
dark:border-slate-700
pt-5
">

    <h3 className="
        font-bold
        text-lg
        dark:text-white
        mb-3
    ">
        🕒 Activity History
    </h3>

    {
        activities[bug.bug_id]?.length > 0 ?

        <div className="space-y-3">

            {
                activities[bug.bug_id].map((activity) => (

                    <div
                        key={activity.activity_id}
                        className="
                            bg-gray-50
                            dark:bg-slate-800
                            p-3
                            rounded-lg
                        "
                    >

                        <p className="
                            font-semibold
                            text-gray-700
                            dark:text-gray-200
                        ">
                            {activity.action}
                        </p>

                        <p className="
                            text-sm
                            text-gray-600
                            dark:text-gray-300
                            mt-1
                        ">
                            {activity.details}
                        </p>

                        <p className="
                            text-xs
                            text-gray-500
                            dark:text-gray-400
                            mt-1
                        ">
                            By {activity.username}
                            {" • "}
                            {activity.created_at}
                        </p>

                    </div>

                ))
            }

        </div>

        :

        <p className="
            text-sm
            text-gray-500
            dark:text-gray-400
        ">
            No activity yet.
        </p>
    }

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