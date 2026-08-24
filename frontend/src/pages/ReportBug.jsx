import { useEffect, useState } from "react";

import api from "../services/api";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import toast from "react-hot-toast";


function ReportBug() {

    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [priority, setPriority] = useState("");
    const [severity, setSeverity] = useState("");
    const [aiCategory, setAiCategory] = useState("");

    const [projectId, setProjectId] = useState("");
    const [assignedTo, setAssignedTo] = useState("");

    const [aiReport, setAiReport] = useState("");

    const [aiLoading, setAiLoading] = useState(false);
    const [triageLoading, setTriageLoading] = useState(false);
    const [duplicateBug, setDuplicateBug] = useState(null);

    useEffect(() => {

        fetchProjects();
        fetchUsers();

    }, []);


    const fetchProjects = async () => {

        try {

            const response = await api.get("/api/projects");

            setProjects(response.data.projects || []);

        }
        catch (error) {

            console.log(error);

        }

    };


    const fetchUsers = async () => {

        try {

            const response = await api.get("/api/users");

            setUsers(response.data.users || []);

        }
        catch (error) {

            console.log(error);

        }

    };


    // ------------------------------------
    // AI GENERATED BUG REPORT
    // ------------------------------------

    const generateAIReport = async () => {

        if (!description.trim()) {

            toast.error("Please enter bug description");

            return;

        }


        try {

            setAiLoading(true);

            setAiReport(
                "🤖 Gemini AI is analyzing your bug..."
            );


            const response = await api.post(
                "/api/improve_bug",
                {
                    description
                }
            );


            setAiReport(
                response.data.bug_report
            );


            toast.success(
                "✨ AI report generated!"
            );

        }
        catch (error) {

            console.log(error.response?.data);

            setAiReport("");

            toast.error(
                error.response?.data?.message ||
                "AI generation failed"
            );

        }
        finally {

            setAiLoading(false);

        }

    };


    // ------------------------------------
    // AI AUTO TRIAGE
    // ------------------------------------

    const autoTriage = async () => {

        if (!description.trim()) {

            toast.error(
                "Please enter bug description"
            );

            return;

        }


        try {

            setTriageLoading(true);


            const response = await api.post(
                "/api/auto_triage",
                {
                    description
                }
            );

            setAiCategory(
            
                response.data.category || ""
            );


            setSeverity(
                response.data.severity || ""
            );


            setPriority(
                response.data.priority || ""
            );


            toast.success(
                "🤖 Bug automatically triaged!"
            );

        }
        catch (error) {

            console.log(error.response?.data);

            toast.error(
                error.response?.data?.message ||
                "Auto-triage failed"
            );

        }
        finally {

            setTriageLoading(false);

        }

    };


    // ------------------------------------
    // SUBMIT BUG
    // ------------------------------------

    const submitBug = async (e) => {

        e.preventDefault();


        if (!projectId) {

            toast.error(
                "Please select a project"
            );

            return;

        }


        if (!assignedTo) {

            toast.error(
                "Please assign a developer"
            );

            return;

        }


        if (!severity || !priority) {

            toast.error(
                "Please run AI Auto-Triage before submitting"
            );

            return;

        }


        try {

            await api.post(
                "/api/bugs",
                {

                    title,

                    // Professional AI report if generated,
                    // otherwise original description
                    description:
                        aiReport || description,

                    priority,

                    severity,

                    project_id:
                        projectId,

                    assigned_to:
                        assignedTo

                }
            );


            toast.success(
                "🐞 Bug reported successfully!"
            );


            // Reset form

            setTitle("");

            setDescription("");

            setAiReport("");

            setAiCategory("");

            setSeverity("");

            setPriority("");

            setProjectId("");

            setAssignedTo("");

        }
        catch (error) {

    console.log(error.response?.data);

    if (
        error.response?.status === 409 &&
        error.response?.data?.duplicate
    ) {

        setDuplicateBug(
            error.response.data.similar_bug
        );

        toast.error(
            "⚠️ A similar bug already exists!"
        );

        return;
    }

    toast.error(
        error.response?.data?.message ||
        "Bug submission failed"
    );
}
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
                        Create bug reports and use AI to
                        automatically triage them.
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

                        {/* -------------------------------- */}
                        {/* BASIC BUG INFORMATION */}
                        {/* -------------------------------- */}

                        <div className="
                            grid
                            md:grid-cols-2
                            gap-6
                        ">

                            {/* Bug Title */}

                            <div>

                                <label className="
                                    font-semibold
                                    dark:text-gray-300
                                ">
                                    Bug Title
                                </label>


                                <input
                                    value={title}
                                    onChange={(e) =>
                                        setTitle(e.target.value)
                                    }
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


                            {/* Project */}

                            <div>

                                <label className="
                                    font-semibold
                                    dark:text-gray-300
                                ">
                                    Project
                                </label>


                                <select
                                    value={projectId}
                                    onChange={(e) =>
                                        setProjectId(e.target.value)
                                    }
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
                                >

                                    <option value="">
                                        Select Project
                                    </option>


                                    {projects.map(
                                        (project) => (

                                            <option
                                                key={
                                                    project.project_id
                                                }
                                                value={
                                                    project.project_id
                                                }
                                            >
                                                {
                                                    project.project_name
                                                }
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>

                        </div>


                        {/* Developer */}

                        <div>

                            <label className="
                                font-semibold
                                dark:text-gray-300
                            ">
                                Assign Developer
                            </label>


                            <select
                                value={assignedTo}
                                onChange={(e) =>
                                    setAssignedTo(e.target.value)
                                }
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
                            >

                                <option value="">
                                    Assign Developer
                                </option>


                                {users.map(
                                    (user) => (

                                        <option
                                            key={
                                                user.user_id
                                            }
                                            value={
                                                user.user_id
                                            }
                                        >
                                            {
                                                user.username
                                            }
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* Bug Description */}

                        <div>

                            <label className="
                                font-semibold
                                dark:text-gray-300
                            ">
                                Bug Description
                            </label>


                            <textarea
                                rows="6"
                                placeholder="
                                    Describe the bug clearly...
                                "
                                value={description}
                                onChange={(e) =>
                                    setDescription(
                                        e.target.value
                                    )
                                }
                                className="
                                    w-full
                                    mt-2
                                    p-4
                                    rounded-xl
                                    border
                                    dark:bg-slate-800
                                    dark:border-slate-700
                                    dark:text-white
                                "
                                required
                            />

                        </div>
                            {/* -------------------------------- */}
                        {/* AI GENERATED BUG REPORT */}
                        {/* -------------------------------- */}

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


                            <p className="
                                mb-4
                                opacity-90
                            ">
                                Convert your bug description
                                into a professional QA report.
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
                                    disabled:opacity-60
                                "
                            >

                                {aiLoading
                                    ? "🤖 Gemini is thinking..."
                                    : "✨ Generate AI Report"
                                }

                            </button>

                        </div>


                        {/* AI GENERATED REPORT BOX */}

                        <div>

                            <label className="
                                font-semibold
                                dark:text-gray-300
                            ">
                                📝 AI Generated Bug Report
                            </label>


                            <textarea
                                rows="10"
                                value={aiReport}
                                readOnly
                                placeholder="
                                    AI generated bug report
                                    appears here...
                                "
                                className="
                                    w-full
                                    mt-2
                                    p-4
                                    rounded-xl
                                    border
                                    bg-gray-50
                                    dark:bg-slate-800
                                    dark:border-slate-700
                                    dark:text-white
                                "
                            />

                        </div>


                        {/* -------------------------------- */}
                        {/* AI AUTO TRIAGE */}
                        {/* -------------------------------- */}

                        <div className="
                            bg-gradient-to-r
                            from-indigo-600
                            to-purple-600
                            rounded-xl
                            p-6
                            text-white
                        ">

                            <h2 className="
                                text-2xl
                                font-bold
                                mb-3
                            ">
                                🤖 AI Auto-Triage
                            </h2>


                            <p className="
                                mb-4
                                opacity-90
                            ">
                                Automatically analyze the bug
                                and suggest its category,
                                severity and priority.
                            </p>


                            <button
                                type="button"
                                onClick={autoTriage}
                                disabled={triageLoading}
                                className="
                                    bg-white
                                    text-indigo-700
                                    px-6
                                    py-3
                                    rounded-xl
                                    font-semibold
                                    hover:scale-105
                                    transition
                                    disabled:opacity-60
                                "
                            >

                                {triageLoading
                                    ? "🤖 AI is analyzing..."
                                    : "🤖 Auto-Triage Bug"
                                }

                            </button>

                        </div>


                        
{/* AI Triage Result */}

{
    aiCategory && (

        <div className="
        bg-gray-50
        dark:bg-slate-800
        rounded-xl
        border
        dark:border-slate-700
        p-6
        space-y-4
        ">

            <h3 className="
            text-xl
            font-bold
            text-gray-800
            dark:text-white
            ">
                🧠 AI Triage Result
            </h3>

            <div className="
            grid
            md:grid-cols-3
            gap-4
            ">

                <div className="
                bg-white
                dark:bg-slate-900
                rounded-xl
                p-4
                border
                dark:border-slate-700
                ">

                    <p className="
                    text-sm
                    text-gray-500
                    dark:text-gray-400
                    ">
                        Category
                    </p>

                    <p className="
                    text-lg
                    font-bold
                    text-indigo-600
                    dark:text-indigo-400
                    mt-1
                    ">
                        {aiCategory}
                    </p>

                </div>


                <div className="
                bg-white
                dark:bg-slate-900
                rounded-xl
                p-4
                border
                dark:border-slate-700
                ">

                    <p className="
                    text-sm
                    text-gray-500
                    dark:text-gray-400
                    ">
                        Suggested Severity
                    </p>

                    <p className="
                    text-lg
                    font-bold
                    text-red-600
                    dark:text-red-400
                    mt-1
                    ">
                        {severity}
                    </p>

                </div>


                <div className="
                bg-white
                dark:bg-slate-900
                rounded-xl
                p-4
                border
                dark:border-slate-700
                ">

                    <p className="
                    text-sm
                    text-gray-500
                    dark:text-gray-400
                    ">
                        Suggested Priority
                    </p>

                    <p className="
                    text-lg
                    font-bold
                    text-yellow-600
                    dark:text-yellow-400
                    mt-1
                    ">
                        {priority}
                    </p>

                </div>

            </div>

        </div>

    )
}
{/* -------------------------------- */}
{/* DUPLICATE BUG WARNING */}
{/* -------------------------------- */}

{duplicateBug && (
    <div className="
        bg-red-50
        dark:bg-red-950
        border
        border-red-300
        dark:border-red-800
        rounded-xl
        p-6
    ">

        <h3 className="
            text-xl
            font-bold
            text-red-700
            dark:text-red-300
            mb-2
        ">
            ⚠️ Similar Bug Already Exists
        </h3>

        <p className="
            text-gray-700
            dark:text-gray-300
            mb-2
        ">
            A similar bug has already been reported:
        </p>

        <p className="
            font-bold
            text-gray-900
            dark:text-white
        ">
            {duplicateBug.title}
        </p>

        <p className="
            text-gray-600
            dark:text-gray-400
            mt-2
        ">
            {duplicateBug.description}
        </p>

        <button
            type="button"
            onClick={() => setDuplicateBug(null)}
            className="
                mt-4
                bg-gray-600
                hover:bg-gray-700
                text-white
                px-4
                py-2
                rounded-lg
            "
        >
            Report Anyway
        </button>

    </div>
)}


                        {/* -------------------------------- */}
                        {/* SUBMIT */}
                        {/* -------------------------------- */}

                        <button
                            type="submit"
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