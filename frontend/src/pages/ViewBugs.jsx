import { useEffect, useState } from "react";

import api from "../services/api";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";



function ViewBugs() {


    const [bugs, setBugs] = useState([]);
    const [sprints, setSprints] = useState([]);

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] = useState("All");

    const [priorityFilter, setPriorityFilter] = useState("All");

    const [comments, setComments] = useState({});
    const [activities, setActivities] = useState({});
    const [attachments, setAttachments] = useState({});
    const [rootCauseBug, setRootCauseBug] = useState(null);
    const [rootCauseAnalysis, setRootCauseAnalysis] = useState("");
    const [rootCauseLoading, setRootCauseLoading] = useState(false);
    const [testCaseBug, setTestCaseBug] = useState(null);
    const [testCases, setTestCases] = useState("");
    const [testCaseLoading, setTestCaseLoading] = useState(false);

    

    const fetchBugs = async () => {
  try {
    const response = await api.get("/api/bugs");

    const bugList = response.data.bugs || [];
    setBugs(bugList);
    const attachmentResults = await Promise.all(
    bugList.map(async (bug) => {
        try {
            const response = await api.get(
                `/api/bugs/${bug.bug_id}/attachments`
            );

            return [
                bug.bug_id,
                response.data.attachments || []
            ];
        } catch (error) {
            console.log(error.response?.data);
            return [bug.bug_id, []];
        }
    })
);

setAttachments(Object.fromEntries(attachmentResults));

    // Fetch all comments and activity in one request
    const relatedResponse = await api.get("/api/bugs/related-data");

    setComments(relatedResponse.data.comments || {});
    setActivities(relatedResponse.data.activities || {});
  } catch (error) {
    console.error("Error fetching bugs:", error);
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


    useEffect(() => {

        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchBugs();

        fetchSprints();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



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

        // Refresh all comments and activity after adding a comment
        const relatedResponse = await api.get("/api/bugs/related-data");

        setComments(relatedResponse.data.comments || {});
        setActivities(relatedResponse.data.activities || {});
    }

    catch (error) {
        console.log(error.response?.data);
    }
};



    const updateStatus = async (id, status) => {

        try {

            await api.put(`/api/bugs/${id}`, {

                status

            });

            fetchBugs();

        }

        catch (error) {

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



    const deleteBug = async (id) => {

        try {

            await api.delete(`/api/bugs/${id}`);

            fetchBugs();

        }

        catch (error) {

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

        // Fetch the real attachment record from the database
        const response = await api.get(
            `/api/bugs/${bugId}/attachments`
        );

        setAttachments((prev) => ({
            ...prev,
            [bugId]: response.data.attachments || []
        }));

        alert("File uploaded successfully!");

    } catch (error) {
        console.log(error.response?.data);

        alert(
            error.response?.data?.message ||
            "File upload failed"
        );
    }
};
const downloadAttachment = async (attachment) => {
    try {
        const response = await api.get(
            `/api/attachments/${attachment.attachment_id}/download`,
            {
                responseType: "blob"
            }
        );

        const url = window.URL.createObjectURL(response.data);

        const link = document.createElement("a");
        link.href = url;
        link.download = attachment.file_name;

        document.body.appendChild(link);
        link.click();

        link.remove();
        window.URL.revokeObjectURL(url);

    } catch (error) {
    console.log("DOWNLOAD ERROR:", error);
    console.log("STATUS:", error.response?.status);
    console.log("DATA:", error.response?.data);

    alert(
        error.response?.data?.message ||
        "Failed to download file"
    );
}
};
    const analyzeRootCause = async (bug) => {
    setRootCauseBug(bug);
    setRootCauseAnalysis("");
    setRootCauseLoading(true);

    try {
        const response = await api.post(
            `/api/bugs/${bug.bug_id}/root-cause-analysis`
        );

        setRootCauseAnalysis(
            response.data.root_cause_analysis || "No analysis returned."
        );
    } catch (error) {
        console.log(error.response?.data);
        setRootCauseAnalysis(
            error.response?.data?.message ||
            "Failed to generate root cause analysis."
        );
    } finally {
        setRootCauseLoading(false);
    }
};
const generateTestCases = async (bug) => {
    setTestCaseBug(bug);
    setTestCases("");
    setTestCaseLoading(true);

    try {
        const response = await api.post(
            `/api/bugs/${bug.bug_id}/test-cases`
        );

        setTestCases(
            response.data.test_cases || "No test cases returned."
        );
    } catch (error) {
        console.log(error.response?.data);

        setTestCases(
            error.response?.data?.message ||
            "Failed to generate test cases."
        );
    } finally {
        setTestCaseLoading(false);
    }
};


    const filteredBugs = bugs.filter((bug) => {

        return (

            bug.title
                .toLowerCase()
                .includes(search.toLowerCase())

            &&

            (
                statusFilter === "All" ||
                bug.status === statusFilter
            )

            &&

            (
                priorityFilter === "All" ||
                bug.priority === priorityFilter
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
  if (status === "Reported")
    return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";

  if (status === "Assigned")
    return "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300";

  if (status === "In Progress")
    return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";

  if (status === "Resolved")
    return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";

  if (status === "Verified")
    return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";

  if (status === "Closed")
    return "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300";

  return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
};

    const getNextStatuses = (status) => {
  if (status === "Reported") {
    return ["Reported", "Assigned"];
  }

  if (status === "Assigned") {
    return ["Assigned", "In Progress"];
  }

  if (status === "In Progress") {
    return ["In Progress", "Resolved"];
  }

  if (status === "Resolved") {
    return ["Resolved", "Verified"];
  }

  if (status === "Verified") {
    return ["Verified", "Closed"];
  }

  return ["Closed"];
};
    return (

        <div className="
            flex
            min-h-screen
            bg-gray-100
            dark:bg-slate-950
        ">


            <Sidebar />


            <div className="flex-1">


                <Navbar />


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

                            onChange={(e) => setSearch(e.target.value)}

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

                            onChange={(e) =>
                                setStatusFilter(e.target.value)
                            }

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
<option>Reported</option>
<option>Assigned</option>
<option>In Progress</option>
<option>Resolved</option>
<option>Verified</option>
<option>Closed</option>
                        </select>



                        <select

                            value={priorityFilter}

                            onChange={(e) =>
                                setPriorityFilter(e.target.value)
                            }

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
    md:grid-cols-2
    gap-6
">


                        {

                            filteredBugs.length > 0

                                ?

                                filteredBugs.map((bug) => (

                                    <div

                                        key={bug.bug_id}

                                        className="
    bg-white
    dark:bg-slate-900
    rounded-2xl
    border border-gray-200
    dark:border-slate-800
    shadow-sm
    p-6
    transition-all
    duration-200
    hover:-translate-y-1
    hover:shadow-md
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
    text-xs
    font-semibold
    ${priorityStyle(bug.priority)}
`}>

                                                {bug.priority}

                                            </span>


                                            <span className={`
    px-3
    py-1
    rounded-full
    text-xs
    font-semibold
    ${statusStyle(bug.status)}
`}>

                                                {bug.status}

                                            </span>


                                        </div>



                                        <div className="
    flex
    flex-col
    gap-3
">

                                            <select

                                                value={bug.status}

                                                onChange={(e) =>
                                                    updateStatus(
                                                        bug.bug_id,
                                                        e.target.value
                                                    )
                                                }

                                                disabled={bug.status === "Closed"}

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
                                                    getNextStatuses(bug.status).map(
                                                        (status) => (

                                                            <option
                                                                key={status}
                                                                value={status}
                                                            >

                                                                {status}

                                                            </option>

                                                        )
                                                    )
                                                }

                                            </select>


                                            <div className="flex flex-wrap gap-2">

    <button
        onClick={() => analyzeRootCause(bug)}
        className="
            bg-purple-600
            hover:bg-purple-700
            text-white
            px-4
            py-2
            rounded-lg
            transition
        "
    >
        🤖 Root Cause Analysis
    </button>
    <button
    onClick={() => generateTestCases(bug)}
    className="
        bg-blue-600
        hover:bg-blue-700
        text-white
        px-4
        py-2
        rounded-lg
        transition
    "
>
    🧪 Generate Test Cases
</button>

    <button
        onClick={() =>
            deleteBug(bug.bug_id)
        }
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
                                        </div>



                                        <div className="
                                            mt-4
                                            text-sm
                                            text-gray-500
                                            dark:text-gray-400
                                        ">

                                            Assigned To:

                                            <b className="ml-1">

                                                {bug.assigned_to || "Not Assigned"}

                                            </b>

                                        </div>



                                        {/* Timestamps */}

                                        <div className="
                                            mt-3
                                            text-sm
                                            text-gray-500
                                            dark:text-gray-400
                                        ">

                                            Created At:

                                            <b className="ml-1">

                                                {bug.created_at || "Not Available"}

                                            </b>

                                        </div>



                                        {bug.status === "Resolved" && (

                                            <div className="
                                                mt-2
                                                text-sm
                                                text-green-600
                                                dark:text-green-400
                                            ">

                                                Resolved At:

                                                <b className="ml-1">

                                                    {bug.resolved_at || "Not Available"}

                                                </b>

                                            </div>

                                        )}



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
{attachments[bug.bug_id]?.length > 0 && (
    <div className="
        mt-4
        rounded-lg
        bg-gray-50
        dark:bg-slate-800
        p-4
    ">
        <h4 className="
            font-semibold
            text-gray-700
            dark:text-gray-200
            mb-2
        ">
            📎 Attachments
        </h4>

        <div className="space-y-2">
            {attachments[bug.bug_id].map((attachment) => (
                <div
                    key={attachment.attachment_id}
                    className="
                        flex
                        items-center
                        justify-between
                        bg-white
                        dark:bg-slate-700
                        p-3
                        rounded-lg
                    "
                >
                    <button
    onClick={() => downloadAttachment(attachment)}
    className="
        text-sm
        text-blue-600
        hover:text-blue-800
        dark:text-blue-400
        dark:hover:text-blue-300
        hover:underline
    "
>
    📄 {attachment.file_name}
</button>
                    <span className="
                        text-xs
                        text-gray-500
                        dark:text-gray-400
                    ">
                        {attachment.uploaded_at}
                    </span>
                </div>
            ))}
        </div>
    </div>
)}


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

                                                comments[bug.bug_id]?.length > 0

                                                    ?

                                                    <div className="space-y-3">

                                                        {

                                                            comments[bug.bug_id].map(
                                                                (comment) => (

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

                                                                )
                                                            )

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

                                                onClick={() =>
                                                    addComment(bug.bug_id)
                                                }

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

                                                activities[bug.bug_id]?.length > 0

                                                    ?

                                                    <div className="space-y-3">

                                                        {

                                                            activities[bug.bug_id].map(
                                                                (activity) => (

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

                                                                )
                                                            )

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

                    {/* AI ROOT CAUSE ANALYSIS MODAL */}
                    {rootCauseBug && (
                        <div className="
                            fixed
                            inset-0
                            z-50
                            flex
                            items-center
                            justify-center
                            bg-black/50
                            p-4
                        ">

                            <div className="
                                w-full
                                max-w-2xl
                                max-h-[85vh]
                                overflow-y-auto
                                rounded-2xl
                                bg-white
                                p-6
                                shadow-2xl
                                dark:bg-slate-900
                            ">

                                <div className="
                                    flex
                                    items-center
                                    justify-between
                                    mb-5
                                ">

                                    <div>
                                        <h2 className="
                                            text-2xl
                                            font-bold
                                            dark:text-white
                                        ">
                                            🤖 AI Root Cause Analysis
                                        </h2>

                                        <p className="
                                            mt-1
                                            text-sm
                                            text-gray-500
                                            dark:text-gray-400
                                        ">
                                            Bug #{rootCauseBug.bug_id}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => {
                                            setRootCauseBug(null);
                                            setRootCauseAnalysis("");
                                        }}
                                        className="
                                            text-2xl
                                            text-gray-500
                                            hover:text-gray-800
                                            dark:hover:text-white
                                        "
                                    >
                                        ✕
                                    </button>

                                </div>

                                <div className="
                                    mb-5
                                    rounded-xl
                                    bg-gray-50
                                    p-4
                                    dark:bg-slate-800
                                ">

                                    <p className="
                                        font-semibold
                                        text-gray-800
                                        dark:text-white
                                    ">
                                        {rootCauseBug.title}
                                    </p>

                                    <p className="
                                        mt-2
                                        text-sm
                                        text-gray-600
                                        dark:text-gray-300
                                    ">
                                        {rootCauseBug.description}
                                    </p>

                                </div>

                                {rootCauseLoading ? (
                                    <div className="
                                        py-10
                                        text-center
                                        text-gray-600
                                        dark:text-gray-300
                                    ">
                                        <p className="text-lg">
                                            🤖 Analyzing bug...
                                        </p>

                                        <p className="
                                            mt-2
                                            text-sm
                                            text-gray-500
                                        ">
                                            Gemini is generating the root cause analysis.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="
                                        whitespace-pre-wrap
                                        text-sm
                                        leading-7
                                        text-gray-700
                                        dark:text-gray-200
                                    ">
                                        {rootCauseAnalysis}
                                    </div>
                                )}
                                                                                       </div>
                        </div>
                    )}

                    
{testCaseBug && (
    <div className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/50
        p-4
    ">

        <div className="
            w-full
            max-w-3xl
            max-h-[85vh]
            overflow-y-auto
            rounded-2xl
            bg-white
            p-6
            shadow-2xl
            dark:bg-slate-900
        ">

            <div className="
                flex
                items-center
                justify-between
                mb-5
            ">

                <div>
                    <h2 className="
                        text-2xl
                        font-bold
                        dark:text-white
                    ">
                        🧪 AI Test Case Generator
                    </h2>

                    <p className="
                        mt-1
                        text-sm
                        text-gray-500
                        dark:text-gray-400
                    ">
                        Bug #{testCaseBug.bug_id}
                    </p>
                </div>

                <button
                    onClick={() => {
                        setTestCaseBug(null);
                        setTestCases("");
                    }}
                    className="
                        text-2xl
                        text-gray-500
                        hover:text-gray-800
                        dark:hover:text-white
                    "
                >
                    ✕
                </button>

            </div>

            <div className="
                mb-5
                rounded-xl
                bg-gray-50
                p-4
                dark:bg-slate-800
            ">

                <p className="
                    font-semibold
                    text-gray-800
                    dark:text-white
                ">
                    {testCaseBug.title}
                </p>

                <p className="
                    mt-2
                    text-sm
                    text-gray-600
                    dark:text-gray-300
                ">
                    {testCaseBug.description}
                </p>

            </div>

            {testCaseLoading ? (

                <div className="
                    py-12
                    text-center
                    text-gray-600
                    dark:text-gray-300
                ">

                    <p className="text-lg">
                        🤖 Generating test cases...
                    </p>

                    <p className="
                        mt-2
                        text-sm
                        text-gray-500
                        dark:text-gray-400
                    ">
                        Gemini is preparing test scenarios for this bug.
                    </p>

                </div>

            ) : (

                <div className="
                    whitespace-pre-wrap
                    text-sm
                    leading-7
                    text-gray-700
                    dark:text-gray-200
                ">
                    {testCases}
                </div>

            )}

        </div>

    </div>
)}

                           

                </div>

            </div>

        </div>

    );

}


export default ViewBugs;