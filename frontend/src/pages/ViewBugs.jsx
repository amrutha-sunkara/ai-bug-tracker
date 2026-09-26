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
    <div
        className="
            fixed inset-0 z-50
            flex items-center justify-center
            bg-slate-950/70
            backdrop-blur-md
            p-4
        "
    >
        <div
            className="
                relative
                w-full max-w-4xl
                max-h-[90vh]
                overflow-hidden
                rounded-[28px]
                border border-purple-200/30
                bg-white
                shadow-[0_25px_80px_rgba(88,28,135,0.25)]
                dark:bg-slate-950
                dark:border-purple-500/20
            "
        >

            {/* Decorative glows */}
            <div
                className="
                    pointer-events-none
                    absolute -top-32 -right-32
                    h-72 w-72
                    rounded-full
                    bg-purple-500/20
                    blur-3xl
                "
            />

            <div
                className="
                    pointer-events-none
                    absolute -bottom-32 -left-32
                    h-72 w-72
                    rounded-full
                    bg-indigo-500/20
                    blur-3xl
                "
            />

            {/* Header */}
            <div
                className="
                    relative
                    flex items-center justify-between
                    border-b border-gray-200
                    px-6 py-5
                    dark:border-slate-800
                "
            >
                <div className="flex items-center gap-4">

                    <div
                        className="
                            flex h-12 w-12
                            items-center justify-center
                            rounded-2xl
                            bg-gradient-to-br
                            from-purple-600
                            via-indigo-500
                            to-blue-500
                            text-2xl
                            shadow-lg
                            shadow-purple-500/25
                        "
                    >
                        🧠
                    </div>

                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <h2
                                className="
                                    text-xl
                                    font-bold
                                    text-gray-900
                                    dark:text-white
                                "
                            >
                                AI Root Cause Analysis
                            </h2>

                            <span
                                className="
                                    rounded-full
                                    bg-purple-100
                                    px-2.5 py-1
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-wider
                                    text-purple-700
                                    dark:bg-purple-500/15
                                    dark:text-purple-300
                                "
                            >
                                AI Powered
                            </span>
                        </div>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-gray-500
                                dark:text-slate-400
                            "
                        >
                            Analyze the underlying cause of this software defect
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => {
                        setRootCauseBug(null);
                        setRootCauseAnalysis("");
                    }}
                    className="
                        flex h-9 w-9
                        items-center justify-center
                        rounded-xl
                        bg-gray-100
                        text-gray-500
                        transition
                        hover:bg-gray-200
                        hover:text-gray-900
                        dark:bg-slate-800
                        dark:text-slate-400
                        dark:hover:bg-slate-700
                        dark:hover:text-white
                    "
                >
                    ✕
                </button>
            </div>

            {/* Scrollable Content */}
            <div
                className="
                    relative
                    max-h-[calc(90vh-89px)]
                    overflow-y-auto
                    p-6
                "
            >

                {/* Bug Context */}
                <div
                    className="
                        mb-6
                        overflow-hidden
                        rounded-2xl
                        border
                        border-purple-100
                        bg-gradient-to-r
                        from-purple-50
                        via-indigo-50
                        to-blue-50
                        dark:border-purple-500/20
                        dark:from-purple-500/10
                        dark:via-indigo-500/5
                        dark:to-blue-500/10
                    "
                >
                    <div
                        className="
                            flex items-center gap-2
                            border-b
                            border-purple-100
                            px-5 py-3
                            dark:border-purple-500/10
                        "
                    >
                        <span className="text-sm">
                            🐞
                        </span>

                        <span
                            className="
                                text-xs
                                font-bold
                                uppercase
                                tracking-wider
                                text-purple-700
                                dark:text-purple-300
                            "
                        >
                            Bug Context
                        </span>

                        <span
                            className="
                                ml-auto
                                rounded-full
                                bg-white/70
                                px-3 py-1
                                text-xs
                                font-semibold
                                text-gray-600
                                dark:bg-slate-900/50
                                dark:text-slate-300
                            "
                        >
                            #{rootCauseBug.bug_id}
                        </span>
                    </div>

                    <div className="px-5 py-4">

                        <div className="flex flex-wrap gap-2 mb-3">

                            <span
                                className="
                                    rounded-full
                                    bg-purple-100
                                    px-3 py-1
                                    text-xs
                                    font-semibold
                                    text-purple-700
                                    dark:bg-purple-500/15
                                    dark:text-purple-300
                                "
                            >
                                {rootCauseBug.priority}
                            </span>

                            <span
                                className="
                                    rounded-full
                                    bg-blue-100
                                    px-3 py-1
                                    text-xs
                                    font-semibold
                                    text-blue-700
                                    dark:bg-blue-500/15
                                    dark:text-blue-300
                                "
                            >
                                {rootCauseBug.status}
                            </span>

                        </div>

                        <h3
                            className="
                                text-base
                                font-bold
                                text-gray-900
                                dark:text-white
                            "
                        >
                            {rootCauseBug.title}
                        </h3>

                        <p
                            className="
                                mt-2
                                text-sm
                                leading-6
                                text-gray-600
                                dark:text-slate-300
                            "
                        >
                            {rootCauseBug.description}
                        </p>

                    </div>
                </div>

                {/* Loading State */}
                {rootCauseLoading ? (

                    <div
                        className="
                            flex
                            min-h-[330px]
                            flex-col
                            items-center
                            justify-center
                            rounded-2xl
                            border
                            border-purple-100
                            bg-gradient-to-b
                            from-purple-50/80
                            to-white
                            dark:border-purple-500/20
                            dark:from-purple-500/10
                            dark:to-slate-900
                        "
                    >

                        <div
                            className="
                                relative
                                mb-6
                                flex h-20 w-20
                                items-center justify-center
                            "
                        >

                            <div
                                className="
                                    absolute inset-0
                                    animate-ping
                                    rounded-full
                                    bg-purple-400/20
                                "
                            />

                            <div
                                className="
                                    relative
                                    flex h-16 w-16
                                    items-center justify-center
                                    rounded-2xl
                                    bg-gradient-to-br
                                    from-purple-600
                                    to-indigo-500
                                    text-3xl
                                    shadow-xl
                                    shadow-purple-500/30
                                "
                            >
                                🧠
                            </div>

                        </div>

                        <h3
                            className="
                                text-lg
                                font-bold
                                text-gray-900
                                dark:text-white
                            "
                        >
                            Analyzing root cause
                        </h3>

                        <p
                            className="
                                mt-2
                                max-w-md
                                text-center
                                text-sm
                                leading-6
                                text-gray-500
                                dark:text-slate-400
                            "
                        >
                            Gemini is analyzing the bug details and
                            identifying possible underlying causes.
                        </p>

                        <div
                            className="
                                mt-6
                                flex items-center gap-1.5
                            "
                        >
                            <span
                                className="
                                    h-2 w-2
                                    animate-bounce
                                    rounded-full
                                    bg-purple-500
                                "
                            />

                            <span
                                className="
                                    h-2 w-2
                                    animate-bounce
                                    rounded-full
                                    bg-indigo-500
                                    [animation-delay:150ms]
                                "
                            />

                            <span
                                className="
                                    h-2 w-2
                                    animate-bounce
                                    rounded-full
                                    bg-blue-500
                                    [animation-delay:300ms]
                                "
                            />
                        </div>

                    </div>

                ) : (

                    <div>

                        {/* Result Header */}
                        <div
                            className="
                                mb-4
                                flex
                                flex-wrap
                                items-center
                                justify-between
                                gap-3
                            "
                        >
                            <div>

                                <div
                                    className="
                                        flex items-center gap-2
                                    "
                                >
                                    <span
                                        className="
                                            flex h-8 w-8
                                            items-center justify-center
                                            rounded-lg
                                            bg-emerald-100
                                            text-sm
                                            dark:bg-emerald-500/15
                                        "
                                    >
                                        ✓
                                    </span>

                                    <h3
                                        className="
                                            font-bold
                                            text-gray-900
                                            dark:text-white
                                        "
                                    >
                                        Root Cause Analysis
                                    </h3>
                                </div>

                                <p
                                    className="
                                        mt-1
                                        ml-10
                                        text-xs
                                        text-gray-500
                                        dark:text-slate-400
                                    "
                                >
                                    AI-generated analysis of the underlying issue
                                </p>

                            </div>

                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(
                                        rootCauseAnalysis
                                    );
                                }}
                                className="
                                    inline-flex
                                    items-center gap-2
                                    rounded-xl
                                    border
                                    border-purple-200
                                    bg-purple-50
                                    px-4 py-2
                                    text-xs
                                    font-semibold
                                    text-purple-700
                                    transition
                                    hover:bg-purple-100
                                    dark:border-purple-500/20
                                    dark:bg-purple-500/10
                                    dark:text-purple-300
                                    dark:hover:bg-purple-500/20
                                "
                            >
                                📋 Copy Analysis
                            </button>

                        </div>

                        {/* AI Output */}
                        <div
                            className="
                                rounded-2xl
                                border
                                border-gray-200
                                bg-white
                                p-5
                                shadow-sm
                                dark:border-slate-800
                                dark:bg-slate-900
                            "
                        >

                            <div
                                className="
                                    mb-4
                                    flex items-center gap-2
                                "
                            >
                                <span
                                    className="
                                        h-2 w-2
                                        rounded-full
                                        bg-emerald-500
                                    "
                                />

                                <span
                                    className="
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-wider
                                        text-gray-500
                                        dark:text-slate-400
                                    "
                                >
                                    AI Output
                                </span>
                            </div>

                            <div
                                className="
                                    whitespace-pre-wrap
                                    text-sm
                                    leading-7
                                    text-gray-700
                                    dark:text-slate-200
                                "
                            >
                                {rootCauseAnalysis}
                            </div>

                        </div>

                        {/* Footer */}
                        <div
                            className="
                                mt-5
                                flex
                                items-center
                                justify-between
                                rounded-xl
                                bg-gray-50
                                px-4 py-3
                                dark:bg-slate-900/70
                            "
                        >

                            <p
                                className="
                                    text-xs
                                    text-gray-500
                                    dark:text-slate-400
                                "
                            >
                                ✨ Generated with AI assistance
                            </p>

                            <button
                                onClick={() => {
                                    setRootCauseBug(null);
                                    setRootCauseAnalysis("");
                                }}
                                className="
                                    rounded-xl
                                    bg-gray-900
                                    px-4 py-2
                                    text-xs
                                    font-semibold
                                    text-white
                                    transition
                                    hover:bg-gray-700
                                    dark:bg-white
                                    dark:text-slate-900
                                    dark:hover:bg-gray-200
                                "
                            >
                                Done
                            </button>

                        </div>

                    </div>

                )}

            </div>
        </div>
    </div>
)}
                    
{testCaseBug && (
    <div className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-slate-950/70
        backdrop-blur-md
        p-4
    ">
        <div className="
            relative
            w-full max-w-4xl
            max-h-[90vh]
            overflow-hidden
            rounded-[28px]
            border border-violet-200/30
            bg-white
            shadow-[0_25px_80px_rgba(76,29,149,0.25)]
            dark:bg-slate-950
            dark:border-violet-500/20
        ">

            {/* Decorative glow */}
            <div className="
                pointer-events-none
                absolute -top-32 -right-32
                h-72 w-72
                rounded-full
                bg-fuchsia-500/20
                blur-3xl
            " />

            <div className="
                pointer-events-none
                absolute -bottom-32 -left-32
                h-72 w-72
                rounded-full
                bg-violet-500/20
                blur-3xl
            " />

            {/* Header */}
            <div className="
                relative
                flex items-center justify-between
                border-b border-gray-200
                dark:border-slate-800
                px-6 py-5
            ">

                <div className="flex items-center gap-4">

                    <div className="
                        flex h-12 w-12
                        items-center justify-center
                        rounded-2xl
                        bg-gradient-to-br
                        from-violet-600
                        via-fuchsia-500
                        to-pink-500
                        text-2xl
                        shadow-lg
                        shadow-violet-500/25
                    ">
                        🧪
                    </div>

                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="
                                text-xl
                                font-bold
                                text-gray-900
                                dark:text-white
                            ">
                                AI Test Case Generator
                            </h2>

                            <span className="
                                rounded-full
                                bg-violet-100
                                px-2.5 py-1
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-wider
                                text-violet-700
                                dark:bg-violet-500/15
                                dark:text-violet-300
                            ">
                                AI Powered
                            </span>
                        </div>

                        <p className="
                            mt-1
                            text-sm
                            text-gray-500
                            dark:text-slate-400
                        ">
                            Intelligent test scenarios generated from your bug
                        </p>
                    </div>

                </div>

                <button
                    onClick={() => {
                        setTestCaseBug(null);
                        setTestCases("");
                    }}
                    className="
                        flex h-9 w-9
                        items-center justify-center
                        rounded-xl
                        bg-gray-100
                        text-gray-500
                        transition
                        hover:bg-gray-200
                        hover:text-gray-900
                        dark:bg-slate-800
                        dark:text-slate-400
                        dark:hover:bg-slate-700
                        dark:hover:text-white
                    "
                >
                    ✕
                </button>

            </div>

            {/* Scrollable content */}
            <div className="
                relative
                max-h-[calc(90vh-89px)]
                overflow-y-auto
                p-6
            ">

                {/* Bug Context */}
                <div className="
                    mb-6
                    overflow-hidden
                    rounded-2xl
                    border
                    border-violet-100
                    bg-gradient-to-r
                    from-violet-50
                    via-fuchsia-50
                    to-pink-50
                    dark:border-violet-500/20
                    dark:from-violet-500/10
                    dark:via-fuchsia-500/5
                    dark:to-pink-500/10
                ">

                    <div className="
                        flex items-center gap-2
                        border-b
                        border-violet-100
                        px-5 py-3
                        dark:border-violet-500/10
                    ">
                        <span className="text-sm">🐞</span>

                        <span className="
                            text-xs
                            font-bold
                            uppercase
                            tracking-wider
                            text-violet-700
                            dark:text-violet-300
                        ">
                            Bug Context
                        </span>

                        <span className="
                            ml-auto
                            rounded-full
                            bg-white/70
                            px-3 py-1
                            text-xs
                            font-semibold
                            text-gray-600
                            dark:bg-slate-900/50
                            dark:text-slate-300
                        ">
                            #{testCaseBug.bug_id}
                        </span>
                    </div>

                    <div className="px-5 py-4">

                        <h3 className="
                            text-base
                            font-bold
                            text-gray-900
                            dark:text-white
                        ">
                            {testCaseBug.title}
                        </h3>

                        <p className="
                            mt-2
                            text-sm
                            leading-6
                            text-gray-600
                            dark:text-slate-300
                        ">
                            {testCaseBug.description}
                        </p>

                    </div>

                </div>

                {/* Loading State */}
                {testCaseLoading ? (

                    <div className="
                        flex
                        min-h-[330px]
                        flex-col
                        items-center
                        justify-center
                        rounded-2xl
                        border
                        border-violet-100
                        bg-gradient-to-b
                        from-violet-50/80
                        to-white
                        dark:border-violet-500/20
                        dark:from-violet-500/10
                        dark:to-slate-900
                    ">

                        <div className="
                            relative
                            mb-6
                            flex h-20 w-20
                            items-center justify-center
                        ">

                            <div className="
                                absolute inset-0
                                animate-ping
                                rounded-full
                                bg-violet-400/20
                            " />

                            <div className="
                                relative
                                flex h-16 w-16
                                items-center justify-center
                                rounded-2xl
                                bg-gradient-to-br
                                from-violet-600
                                to-fuchsia-500
                                text-3xl
                                shadow-xl
                                shadow-violet-500/30
                            ">
                                🧪
                            </div>

                        </div>

                        <h3 className="
                            text-lg
                            font-bold
                            text-gray-900
                            dark:text-white
                        ">
                            Generating intelligent test cases
                        </h3>

                        <p className="
                            mt-2
                            max-w-md
                            text-center
                            text-sm
                            leading-6
                            text-gray-500
                            dark:text-slate-400
                        ">
                            Gemini is analyzing the bug description and
                            preparing relevant test scenarios.
                        </p>

                        <div className="
                            mt-6
                            flex items-center gap-1.5
                        ">
                            <span className="
                                h-2 w-2
                                animate-bounce
                                rounded-full
                                bg-violet-500
                            " />

                            <span className="
                                h-2 w-2
                                animate-bounce
                                rounded-full
                                bg-fuchsia-500
                                [animation-delay:150ms]
                            " />

                            <span className="
                                h-2 w-2
                                animate-bounce
                                rounded-full
                                bg-pink-500
                                [animation-delay:300ms]
                            " />
                        </div>

                    </div>

                ) : (

                    <div>

                        {/* Result Header */}
                        <div className="
                            mb-4
                            flex
                            flex-wrap
                            items-center
                            justify-between
                            gap-3
                        ">

                            <div>
                                <div className="
                                    flex items-center gap-2
                                ">
                                    <span className="
                                        flex h-8 w-8
                                        items-center justify-center
                                        rounded-lg
                                        bg-emerald-100
                                        text-sm
                                        dark:bg-emerald-500/15
                                    ">
                                        ✓
                                    </span>

                                    <h3 className="
                                        font-bold
                                        text-gray-900
                                        dark:text-white
                                    ">
                                        Generated Test Scenarios
                                    </h3>
                                </div>

                                <p className="
                                    mt-1
                                    ml-10
                                    text-xs
                                    text-gray-500
                                    dark:text-slate-400
                                ">
                                    Review these scenarios before testing
                                </p>
                            </div>

                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(testCases);
                                }}
                                className="
                                    inline-flex
                                    items-center gap-2
                                    rounded-xl
                                    border
                                    border-violet-200
                                    bg-violet-50
                                    px-4 py-2
                                    text-xs
                                    font-semibold
                                    text-violet-700
                                    transition
                                    hover:bg-violet-100
                                    dark:border-violet-500/20
                                    dark:bg-violet-500/10
                                    dark:text-violet-300
                                    dark:hover:bg-violet-500/20
                                "
                            >
                                📋 Copy Results
                            </button>

                        </div>

                        {/* Generated Content */}
                        <div className="
                            rounded-2xl
                            border
                            border-gray-200
                            bg-white
                            p-5
                            shadow-sm
                            dark:border-slate-800
                            dark:bg-slate-900
                        ">

                            <div className="
                                mb-4
                                flex items-center gap-2
                            ">
                                <span className="
                                    h-2 w-2
                                    rounded-full
                                    bg-emerald-500
                                " />

                                <span className="
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wider
                                    text-gray-500
                                    dark:text-slate-400
                                ">
                                    AI Output
                                </span>
                            </div>

                            <div className="
                                whitespace-pre-wrap
                                text-sm
                                leading-7
                                text-gray-700
                                dark:text-slate-200
                            ">
                                {testCases}
                            </div>

                        </div>

                        {/* Footer */}
                        <div className="
                            mt-5
                            flex
                            items-center
                            justify-between
                            rounded-xl
                            bg-gray-50
                            px-4 py-3
                            dark:bg-slate-900/70
                        ">

                            <p className="
                                text-xs
                                text-gray-500
                                dark:text-slate-400
                            ">
                                ✨ Generated with AI assistance
                            </p>

                            <button
                                onClick={() => {
                                    setTestCaseBug(null);
                                    setTestCases("");
                                }}
                                className="
                                    rounded-xl
                                    bg-gray-900
                                    px-4 py-2
                                    text-xs
                                    font-semibold
                                    text-white
                                    transition
                                    hover:bg-gray-700
                                    dark:bg-white
                                    dark:text-slate-900
                                    dark:hover:bg-gray-200
                                "
                            >
                                Done
                            </button>

                        </div>

                    </div>

                )}

            </div>

        </div>
    </div>
)}

        

                           

                </div>

            </div>

        </div>

    );

}


export default ViewBugs;