import { useEffect, useState } from "react";

import api from "../services/api";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Chatbot from "../components/Chatbot";

import {
    Users,
    FolderKanban,
    Bug,
    AlertCircle,
    CheckCircle
} from "lucide-react";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid
} from "recharts";


function Dashboard() {

    const [data, setData] = useState({

        total_users: 0,
        total_projects: 0,
        total_bugs: 0,
        open_bugs: 0,
        closed_bugs: 0

    });


    const [charts, setCharts] = useState({

        status: [],
        priority: [],
        severity: [],
        category: [],
        trend: [],
        developer_workload: [],
        average_resolution_time: 0
    });


    const [loading, setLoading] = useState(true);


    const fetchDashboard = async () => {

    try {

        const response = await api.get("/api/dashboard");

        setData(response.data);

    }

    catch (error) {

        console.log(
            "Dashboard Error:",
            error.response?.data || error.message
        );

    }

    finally {

        setLoading(false);

    }

};


const fetchCharts = async () => {

    try {

        const response = await api.get("/api/dashboard/charts");
        console.log("CHART DATA:", response.data);

        setCharts({

            status: response.data.status || [],
            priority: response.data.priority || [],
            severity: response.data.severity || [],
            category: response.data.category || [],
            trend: response.data.trend || [],
            developer_workload: response.data.developer_workload || [],
            average_resolution_time:
                response.data.average_resolution_time || 0

        });

    }

    catch (error) {

        console.log(
            "Charts Error:",
            error.response?.data || error.message
        );

    }

};


useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDashboard();

    fetchCharts();

}, []);
    if (loading) {

        return (

            <div
                className="
                min-h-screen
                flex
                items-center
                justify-center
                bg-gray-100
                dark:bg-slate-950
                "
            >

                <h1
                    className="
                    text-2xl
                    font-bold
                    dark:text-white
                    "
                >

                    Loading Dashboard...

                </h1>

            </div>

        );

    }


    const cards = [

        {
            title: "Users",
            value: data.total_users,
            icon: <Users size={40} />,
            color: "text-blue-500"
        },

        {
            title: "Projects",
            value: data.total_projects,
            icon: <FolderKanban size={40} />,
            color: "text-yellow-500"
        },

        {
            title: "Total Bugs",
            value: data.total_bugs,
            icon: <Bug size={40} />,
            color: "text-red-500"
        },

        {
            title: "Open Bugs",
            value: data.open_bugs,
            icon: <AlertCircle size={40} />,
            color: "text-orange-500"
        },

        {
            title: "In Progress",
            value: data.in_progress_bugs,
            icon: <Bug size={40} />,
            color: "text-yellow-500"
        },

        {
            title: "In Review",
            value: data.in_review_bugs,
            icon: <Bug size={40} />,
            color: "text-blue-500"
        },

        {
            title: "Resolved",
            value: data.resolved_bugs,
            icon: <CheckCircle size={40} />,
            color: "text-green-500"
        },

        {
            title: "Closed Bugs",
            value: data.closed_bugs,
            icon: <CheckCircle size={40} />,
            color: "text-green-600"
        },
        {
    title: "Avg Resolution Time",
    value: `${charts.average_resolution_time} hrs`,
    icon: <CheckCircle size={40} />,
    color: "text-purple-500"
}

    ];


    return (

        <div
            className="
            flex
            min-h-screen
            bg-gray-100
            dark:bg-slate-950
            "
        >

            <Sidebar />


            <div className="flex-1">

                <Navbar />


                <div className="p-8">


                    <h1
                        className="
                        text-4xl
                        font-bold
                        text-gray-800
                        dark:text-white
                        "
                    >

                        Dashboard

                    </h1>


                    <p
                        className="
                        mt-2
                        mb-8
                        text-gray-600
                        dark:text-gray-300
                        "
                    >

                        Welcome back, {localStorage.getItem("username")}

                    </p>


                    {/* Dashboard Cards */}

                    <div
                        className="
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        lg:grid-cols-4
                        gap-6
                        mb-10
                        "
                    >

                        {

                            cards.map((card, index) => (

                                <div

                                    key={index}

                                    className="
                                    bg-white
                                    dark:bg-slate-900
                                    rounded-xl
                                    shadow-lg
                                    p-6
                                    transition
                                    hover:-translate-y-2
                                    "

                                >

                                    <div
                                        className="
                                        flex
                                        justify-between
                                        items-center
                                        "
                                    >


                                        <div>

                                            <h2
                                                className="
                                                text-gray-500
                                                dark:text-gray-400
                                                font-medium
                                                "
                                            >

                                                {card.title}

                                            </h2>


                                            <p
                                                className="
                                                text-4xl
                                                font-bold
                                                mt-3
                                                text-gray-800
                                                dark:text-white
                                                "
                                            >

                                                {card.value}

                                            </p>

                                        </div>


                                        <div className={card.color}>

                                            {card.icon}

                                        </div>


                                    </div>

                                </div>

                            ))

                        }

                    </div>


                    {/* Charts Section */}

                    <div
                        className="
                        grid
                        grid-cols-1
                        lg:grid-cols-2
                        gap-8
                        "
                    >


                        {/* Bug Status */}

                        <div
                            className="
                            bg-white
                            dark:bg-slate-900
                            rounded-xl
                            shadow-lg
                            p-6
                            "
                        >

                            <h2
                                className="
                                text-2xl
                                font-bold
                                mb-5
                                text-gray-800
                                dark:text-white
                                "
                            >

                                Bug Status

                            </h2>


                            {

                                charts.status.length > 0 ?

                                    <PieChart
                                        width={400}
                                        height={300}
                                    >

                                        <Pie

                                            data={charts.status}

                                            dataKey="value"

                                            nameKey="name"

                                            cx="50%"

                                            cy="50%"

                                            outerRadius={100}

                                            label

                                        >

                                            {

                                                charts.status.map(
                                                    (entry, index) => (

                                                        <Cell
                                                            key={index}
                                                        />

                                                    )
                                                )

                                            }

                                        </Pie>


                                        <Tooltip />

                                        <Legend />

                                    </PieChart>

                                    :

                                    <p
                                        className="
                                        text-gray-500
                                        dark:text-gray-400
                                        "
                                    >

                                        No bug data available

                                    </p>

                            }

                        </div>


                        {/* Bug Priority */}

                        <div
                            className="
                            bg-white
                            dark:bg-slate-900
                            rounded-xl
                            shadow-lg
                            p-6
                            "
                        >

                            <h2
                                className="
                                text-2xl
                                font-bold
                                mb-5
                                text-gray-800
                                dark:text-white
                                "
                            >

                                Bug Priority

                            </h2>


                            {

                                charts.priority.length > 0 ?

                                    <BarChart

                                        width={450}

                                        height={300}

                                        data={charts.priority}

                                    >

                                        <CartesianGrid />

                                        <XAxis dataKey="name" />

                                        <YAxis />

                                        <Tooltip />

                                        <Bar

                                            dataKey="value"

                                            fill="#2563eb"

                                        />

                                    </BarChart>

                                    :

                                    <p
                                        className="
                                        text-gray-500
                                        dark:text-gray-400
                                        "
                                    >

                                        No priority data available

                                    </p>

                            }

                        </div>


                        {/* Bug Severity */}

                        <div
                            className="
                            bg-white
                            dark:bg-slate-900
                            rounded-xl
                            shadow-lg
                            p-6
                            "
                        >

                            <h2
                                className="
                                text-2xl
                                font-bold
                                mb-5
                                text-gray-800
                                dark:text-white
                                "
                            >

                                Bug Severity

                            </h2>


                            {

                                charts.severity.length > 0 ?

                                    <BarChart

                                        width={450}

                                        height={300}

                                        data={charts.severity}

                                    >

                                        <CartesianGrid />

                                        <XAxis dataKey="name" />

                                        <YAxis />

                                        <Tooltip />

                                        <Bar

                                            dataKey="value"

                                        />

                                    </BarChart>

                                    :

                                    <p
                                        className="
                                        text-gray-500
                                        dark:text-gray-400
                                        "
                                    >

                                        No severity data available

                                    </p>

                            }

                        </div>


                        {/* Bug Category */}

                        <div
                            className="
                            bg-white
                            dark:bg-slate-900
                            rounded-xl
                            shadow-lg
                            p-6
                            "
                        >

                            <h2
                                className="
                                text-2xl
                                font-bold
                                mb-5
                                text-gray-800
                                dark:text-white
                                "
                            >

                                Bug Category

                            </h2>


                            {

                                charts.category.length > 0 ?

                                    <BarChart

                                        width={450}

                                        height={300}

                                        data={charts.category}

                                    >

                                        <CartesianGrid />

                                        <XAxis dataKey="name" />

                                        <YAxis />

                                        <Tooltip />

                                        <Bar

                                            dataKey="value"

                                            fill="#7c3aed"

                                        />

                                    </BarChart>

                                    :

                                    <p
                                        className="
                                        text-gray-500
                                        dark:text-gray-400
                                        "
                                    >

                                        No category data available

                                    </p>

                            }

                        </div>


                        {/* Defect Trend */}

                        <div
                            className="
                            bg-white
                            dark:bg-slate-900
                            rounded-xl
                            shadow-lg
                            p-6
                            "
                        >

                            <h2
                                className="
                                text-2xl
                                font-bold
                                mb-5
                                text-gray-800
                                dark:text-white
                                "
                            >

                                Defect Trend

                            </h2>


                            {

                                charts.trend && charts.trend.length > 0 ?

                                    <LineChart

                                        width={450}

                                        height={300}

                                        data={charts.trend}

                                    >

                                        <CartesianGrid />

                                        <XAxis dataKey="date" />

                                        <YAxis />

                                        <Tooltip />

                                        <Line

                                            type="monotone"

                                            dataKey="value"

                                            stroke="#2563eb"

                                            strokeWidth={3}

                                        />

                                    </LineChart>

                                    :

                                    <p
                                        className="
                                        text-gray-500
                                        dark:text-gray-400
                                        "
                                    >

                                        No trend data available

                                    </p>

                            }

                        </div>
{/* Developer Workload */}

<div
    className="
    bg-white
    dark:bg-slate-900
    rounded-xl
    shadow-lg
    p-6
    "
>

    <h2
        className="
        text-2xl
        font-bold
        mb-5
        text-gray-800
        dark:text-white
        "
    >
        Developer Workload
    </h2>

    {charts.developer_workload &&
    charts.developer_workload.length > 0 ? (

        <BarChart
            width={450}
            height={300}
            data={charts.developer_workload}
        >

            <CartesianGrid />

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Bar
                dataKey="value"
                fill="#16a34a"
            />

        </BarChart>

    ) : (

        <p
            className="
            text-gray-500
            dark:text-gray-400
            "
        >
            No developer workload data available
        </p>

    )}

</div>

                    </div>


                </div>


            </div>

<Chatbot />
        </div>

    );

}


export default Dashboard;