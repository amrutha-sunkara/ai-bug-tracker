import { useEffect, useState } from "react";
import api from "../services/api";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import {
    Plus,
    CalendarDays,
    Bug,
    Users,
    Layers
} from "lucide-react";

function SprintManagement() {

    const [sprints, setSprints] = useState([]);
    const [bugs, setBugs] = useState([]);

    const [selectedSprint, setSelectedSprint] = useState(null);

    const [showCreateForm, setShowCreateForm] = useState(false);

    const [formData, setFormData] = useState({
        sprint_name: "",
        description: "",
        start_date: "",
        end_date: ""
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSprints();
        fetchBugs();
    }, []);

    const fetchSprints = async () => {

        try {

            const response = await api.get("/api/sprints");

            setSprints(response.data.sprints);

        } catch (error) {

            console.log(
                "Sprint Error:",
                error.response?.data || error.message
            );

        } finally {

            setLoading(false);

        }
    };


    const fetchBugs = async () => {

        try {

            const response = await api.get("/api/bugs");

            setBugs(response.data.bugs);

        } catch (error) {

            console.log(
                "Bug Error:",
                error.response?.data || error.message
            );

        }
    };


    const createSprint = async (e) => {

        e.preventDefault();

        try {

            await api.post("/api/sprints", formData);

            alert("Sprint created successfully");

            setFormData({
                sprint_name: "",
                description: "",
                start_date: "",
                end_date: ""
            });

            setShowCreateForm(false);

            fetchSprints();

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to create sprint"
            );

        }
    };


    const assignBugToSprint = async (bugId, sprintId) => {

        try {

            await api.put(
                `/api/bugs/${bugId}/sprint`,
                {
                    sprint_id: sprintId
                }
            );

            alert("Bug assigned to sprint successfully");

            fetchBugs();

            if (selectedSprint) {
                fetchSprintBugs(selectedSprint);
            }

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to assign bug"
            );

        }
    };


    const fetchSprintBugs = async (sprintId) => {

        try {

            const response = await api.get(
                `/api/sprints/${sprintId}/bugs`
            );

            setBugs(response.data.bugs);

        } catch (error) {

            console.log(
                "Sprint Bugs Error:",
                error.response?.data || error.message
            );

        }
    };


    const selectSprint = (sprintId) => {

        setSelectedSprint(sprintId);

        fetchSprintBugs(sprintId);

    };


    if (loading) {

        return (
            <div className="
                min-h-screen
                flex
                items-center
                justify-center
                bg-gray-100
                dark:bg-slate-950
            ">

                <h1 className="
                    text-2xl
                    font-bold
                    dark:text-white
                ">
                    Loading Sprint Management...
                </h1>

            </div>
        );

    }


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

                    {/* Header */}

                    <div className="
                        flex
                        justify-between
                        items-center
                        mb-8
                    ">

                        <div>

                            <h1 className="
                                text-4xl
                                font-bold
                                text-gray-800
                                dark:text-white
                            ">
                                Sprint Management
                            </h1>

                            <p className="
                                mt-2
                                text-gray-600
                                dark:text-gray-300
                            ">
                                Plan sprints and organize bugs for Agile development.
                            </p>

                        </div>


                        <button
                            onClick={() => setShowCreateForm(!showCreateForm)}
                            className="
                                flex
                                items-center
                                gap-2
                                px-5
                                py-3
                                rounded-lg
                                bg-blue-600
                                hover:bg-blue-700
                                text-white
                                font-semibold
                            "
                        >

                            <Plus size={20} />

                            Create Sprint

                        </button>

                    </div>


                    {/* Create Sprint Form */}

                    {showCreateForm && (

                        <div className="
                            bg-white
                            dark:bg-slate-900
                            rounded-xl
                            shadow-lg
                            p-6
                            mb-8
                        ">

                            <h2 className="
                                text-2xl
                                font-bold
                                mb-5
                                dark:text-white
                            ">
                                Create New Sprint
                            </h2>


                            <form
                                onSubmit={createSprint}
                                className="
                                    grid
                                    grid-cols-1
                                    md:grid-cols-2
                                    gap-5
                                "
                            >

                                <input
                                    type="text"
                                    placeholder="Sprint Name"
                                    value={formData.sprint_name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            sprint_name: e.target.value
                                        })
                                    }
                                    className="
                                        p-3
                                        rounded-lg
                                        border
                                        dark:bg-slate-800
                                        dark:border-slate-700
                                        dark:text-white
                                    "
                                    required
                                />


                                <input
                                    type="date"
                                    value={formData.start_date}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            start_date: e.target.value
                                        })
                                    }
                                    className="
                                        p-3
                                        rounded-lg
                                        border
                                        dark:bg-slate-800
                                        dark:border-slate-700
                                        dark:text-white
                                    "
                                />


                                <input
                                    type="date"
                                    value={formData.end_date}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            end_date: e.target.value
                                        })
                                    }
                                    className="
                                        p-3
                                        rounded-lg
                                        border
                                        dark:bg-slate-800
                                        dark:border-slate-700
                                        dark:text-white
                                    "
                                />


                                <textarea
                                    placeholder="Sprint Description"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value
                                        })
                                    }
                                    className="
                                        p-3
                                        rounded-lg
                                        border
                                        md:col-span-2
                                        dark:bg-slate-800
                                        dark:border-slate-700
                                        dark:text-white
                                    "
                                    rows="3"
                                />


                                <button
                                    type="submit"
                                    className="
                                        md:col-span-2
                                        bg-green-600
                                        hover:bg-green-700
                                        text-white
                                        py-3
                                        rounded-lg
                                        font-semibold
                                    "
                                >
                                    Create Sprint
                                </button>

                            </form>

                        </div>

                    )}


                    {/* Sprint Cards */}

                    <div className="
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        lg:grid-cols-3
                        gap-6
                        mb-10
                    ">

                        {sprints.map((sprint) => (

                            <div
                                key={sprint.sprint_id}
                                onClick={() =>
                                    selectSprint(sprint.sprint_id)
                                }
                                className={`
                                    cursor-pointer
                                    bg-white
                                    dark:bg-slate-900
                                    rounded-xl
                                    shadow-lg
                                    p-6
                                    border-2
                                    transition
                                    hover:-translate-y-1
                                    ${
                                        selectedSprint === sprint.sprint_id
                                            ? "border-blue-500"
                                            : "border-transparent"
                                    }
                                `}
                            >

                                <div className="
                                    flex
                                    justify-between
                                    items-center
                                    mb-4
                                ">

                                    <Layers
                                        className="text-blue-500"
                                        size={30}
                                    />

                                    <span className="
                                        px-3
                                        py-1
                                        bg-blue-100
                                        text-blue-700
                                        rounded-full
                                        text-sm
                                    ">
                                        Sprint
                                    </span>

                                </div>


                                <h2 className="
                                    text-xl
                                    font-bold
                                    dark:text-white
                                ">
                                    {sprint.sprint_name}
                                </h2>


                                <p className="
                                    mt-2
                                    text-gray-500
                                    dark:text-gray-400
                                ">
                                    {sprint.description}
                                </p>


                                <div className="
                                    mt-5
                                    space-y-2
                                    text-sm
                                    text-gray-600
                                    dark:text-gray-300
                                ">

                                    <p className="flex gap-2">
                                        <CalendarDays size={18} />
                                        {sprint.start_date} → {sprint.end_date}
                                    </p>

                                </div>

                            </div>

                        ))}

                    </div>


                    {/* Selected Sprint */}

                    {selectedSprint && (

                        <div className="
                            bg-white
                            dark:bg-slate-900
                            rounded-xl
                            shadow-lg
                            p-6
                        ">

                            <h2 className="
                                text-2xl
                                font-bold
                                mb-6
                                dark:text-white
                            ">
                                Sprint Issues
                            </h2>


                            {bugs.length === 0 ? (

                                <p className="
                                    text-gray-500
                                    dark:text-gray-400
                                ">
                                    No bugs assigned to this sprint.
                                </p>

                            ) : (

                                <div className="space-y-4">

                                    {bugs.map((bug) => (

                                        <div
                                            key={bug.bug_id}
                                            className="
                                                border
                                                dark:border-slate-700
                                                rounded-lg
                                                p-4
                                            "
                                        >

                                            <div className="
                                                flex
                                                justify-between
                                                items-center
                                            ">

                                                <div>

                                                    <h3 className="
                                                        font-bold
                                                        dark:text-white
                                                    ">
                                                        #{bug.bug_id} - {bug.title}
                                                    </h3>

                                                    <p className="
                                                        text-sm
                                                        text-gray-500
                                                        dark:text-gray-400
                                                    ">
                                                        {bug.description}
                                                    </p>

                                                </div>


                                                <div className="
                                                    text-right
                                                    text-sm
                                                ">

                                                    <p className="
                                                        text-blue-600
                                                        font-semibold
                                                    ">
                                                        {bug.status}
                                                    </p>

                                                    <p className="
                                                        text-gray-500
                                                    ">
                                                        {bug.assigned_to || "Unassigned"}
                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                    ))}

                                </div>

                            )}

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

}

export default SprintManagement;