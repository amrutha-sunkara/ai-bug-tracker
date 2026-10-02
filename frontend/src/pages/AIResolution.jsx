import { useEffect, useState } from "react";

import api from "../services/api";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import {
    Bot,
    Search,
    FlaskConical,
    Wrench,
    Lightbulb,
    ShieldCheck,
    AlertCircle
} from "lucide-react";


function AIResolution() {

    const [bugs, setBugs] = useState([]);
    const [selectedBug, setSelectedBug] = useState(null);

    const [loading, setLoading] = useState(true);
    const [analyzing, setAnalyzing] = useState(false);

    const [resolution, setResolution] = useState("");
    const [error, setError] = useState("");
    const [historicalResolutions, setHistoricalResolutions] = useState([]);

    const fetchBugs = async () => {

        try {
            const response = await api.get("/api/bugs");

            setBugs(response.data.bugs || []);

        } catch (error) {

            console.log(
                "AI Resolution Bug Fetch Error:",
                error.response?.data || error.message
            );

            setError("Failed to load bugs.");

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchBugs();

    }, []);


    const handleBugChange = (e) => {

        const bugId = Number(e.target.value);

        const bug = bugs.find(
            (item) => item.bug_id === bugId
        );

        setSelectedBug(bug || null);
        setResolution("");
        setHistoricalResolutions([]);
        setError("");

    };


    const handleAnalyze = async () => {

        if (!selectedBug) {
            return;
        }

        setAnalyzing(true);
        setResolution("");
        setError("");

        try {

            const response = await api.get(
                `/api/bugs/${selectedBug.bug_id}/ai-resolution`
            );


            setResolution(
                response.data.resolution_assistance ||
                "No AI resolution was generated."
            );

            setHistoricalResolutions(
                response.data.historical_resolutions || []
            );

        } catch (error) {

            console.log(
                "AI Resolution Error:",
                error.response?.data || error.message
            );


            setError(
                error.response?.data?.error ||
                "Failed to generate AI resolution. Please try again."
            );


        } finally {

            setAnalyzing(false);

        }

    };


    /*
     * Convert Gemini response into
     * clean structured sections.
     */
    const formatResolution = (text) => {

        if (!text) {
            return [];
        }


        const sectionNames = [
            "Possible Root Cause",
            "Investigation Areas",
            "Recommended Debugging Steps",
            "Possible Resolution",
            "Prevention Suggestion"
        ];


        const icons = [
            <Search size={21} />,
            <FlaskConical size={21} />,
            <Wrench size={21} />,
            <Lightbulb size={21} />,
            <ShieldCheck size={21} />
        ];


        const result = [];


        sectionNames.forEach((name, index) => {

            const escapedName = name.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );


            const pattern = new RegExp(
                `(?:#{1,4}\\s*)?(?:\\d+[.)]?\\s*)?${escapedName}\\s*:?[\\s]*`,
                "i"
            );


            const match = pattern.exec(text);


            if (!match) {
                return;
            }


            const start = match.index + match[0].length;

            let end = text.length;


            /*
             * Find where the next section begins.
             */
            for (let i = index + 1; i < sectionNames.length; i++) {

                const nextName = sectionNames[i].replace(
                    /[.*+?^${}()|[\]\\]/g,
                    "\\$&"
                );


                const nextPattern = new RegExp(
                    `(?:#{1,4}\\s*)?(?:\\d+[.)]?\\s*)?${nextName}\\s*:?[\\s]*`,
                    "i"
                );


                const nextMatch = nextPattern.exec(
                    text.substring(start)
                );


                if (nextMatch) {

                    end = start + nextMatch.index;

                    break;

                }

            }


            let content = text
                .substring(start, end)
                .replace(/#{1,4}/g, "")
                .replace(/\*\*(.*?)\*\*/g, "$1")
                .replace(/`([^`]+)`/g, "$1")
                .trim();


            if (!content) {
                return;
            }


            /*
             * Clean each line.
             */
            const lines = content
                .split("\n")
                .map((line) => line.trim())
                .filter((line) => line.length > 0);


            const cleanedLines = lines.map((line) => {

                return line
                    .replace(/^[-•*]\s*/, "")
                    .replace(/^\d+[.)]\s*/, "")
                    .replace(/^>\s*/, "")
                    .replace(/\*\*(.*?)\*\*/g, "$1")
                    .trim();

            });


            /*
             * Remove duplicate/empty lines.
             */
            const uniqueLines = cleanedLines.filter(
                (line, i, arr) =>
                    line &&
                    arr.indexOf(line) === i
            );


            /*
             * Keep cards concise.
             */
            const limitedLines = uniqueLines;


            result.push({

                title: name,

                content: limitedLines,

                icon: icons[index]

            });

        });


        return result;

    };


   if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-950">
            <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
                    <Bot size={32} />
                </div>

                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Loading AI Resolution...
                </h1>

                <p className="mt-2 text-gray-500 dark:text-gray-400">
                    Preparing your defect analysis workspace
                </p>
            </div>
        </div>
    );
}

const formattedResolution = formatResolution(resolution);

return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-slate-950">

        <Sidebar />

        <div className="flex-1 min-w-0">

            <Navbar />

            <main className="p-6 md:p-8 max-w-7xl mx-auto">

                {/* PAGE HEADER */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

                    <div className="flex items-center gap-4">

                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg shrink-0">
                            <Bot size={30} />
                        </div>

                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
                                    AI Resolution Assistance
                                </h1>

                                <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-bold">
                                    AI POWERED
                                </span>
                            </div>

                            <p className="mt-1 text-gray-600 dark:text-gray-400">
                                Analyze defects and get intelligent debugging guidance.
                            </p>
                        </div>

                    </div>

                </div>


                {/* BUG SELECTION CARD */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm p-6">

                    <div className="flex items-center gap-3 mb-4">

                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                            <Search size={21} />
                        </div>

                        <div>
                            <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                                Select Defect
                            </h2>

                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Choose a bug to analyze with AI
                            </p>
                        </div>

                    </div>

                    <select
                        onChange={handleBugChange}
                        defaultValue=""
                        className="
                            w-full
                            border border-gray-300 dark:border-slate-700
                            rounded-xl
                            p-3.5
                            bg-white dark:bg-slate-800
                            text-gray-800 dark:text-white
                            focus:outline-none
                            focus:ring-2 focus:ring-blue-500
                        "
                    >
                        <option value="" disabled>
                            Select a bug
                        </option>

                        {bugs.map((bug) => (
                            <option
                                key={bug.bug_id}
                                value={bug.bug_id}
                            >
                                #{bug.bug_id} - {bug.title}
                            </option>
                        ))}
                    </select>

                </div>


                {/* BUG DETAILS */}
                {selectedBug && (
                    <div className="mt-6 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm p-6">

                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

                            <div className="min-w-0">

                                <div className="flex flex-wrap items-center gap-3">

                                    <span className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                        Bug #{selectedBug.bug_id}
                                    </span>

                                    <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold">
                                        AI Ready
                                    </span>

                                </div>

                                <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mt-2">
                                    {selectedBug.title}
                                </h2>

                            </div>

                        </div>


                        {/* BUG META */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">

                            <div className="rounded-xl bg-gray-50 dark:bg-slate-800/70 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                    Priority
                                </p>

                                <p className="mt-1 font-semibold text-gray-800 dark:text-white">
                                    {selectedBug.priority || "Not specified"}
                                </p>
                            </div>

                            <div className="rounded-xl bg-gray-50 dark:bg-slate-800/70 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                    Severity
                                </p>

                                <p className="mt-1 font-semibold text-gray-800 dark:text-white">
                                    {selectedBug.severity || "Not specified"}
                                </p>
                            </div>

                            <div className="rounded-xl bg-gray-50 dark:bg-slate-800/70 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                    Status
                                </p>

                                <p className="mt-1 font-semibold text-gray-800 dark:text-white">
                                    {selectedBug.status || "Not specified"}
                                </p>
                            </div>

                        </div>


                        {/* DESCRIPTION */}
                        <div className="mt-6">

                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Description
                            </p>

                            <div className="rounded-xl bg-gray-50 dark:bg-slate-800/70 p-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                                {selectedBug.description || "No description available."}
                            </div>

                        </div>


                        {/* ANALYZE BUTTON */}
                        <button
                            onClick={handleAnalyze}
                            disabled={analyzing}
                            className="
                                mt-6
                                flex items-center justify-center gap-2
                                px-6 py-3
                                rounded-xl
                                bg-gradient-to-r from-blue-600 to-purple-600
                                hover:from-blue-700 hover:to-purple-700
                                disabled:opacity-60
                                disabled:cursor-not-allowed
                                text-white
                                font-semibold
                                shadow-md
                                transition
                            "
                        >

                            {analyzing ? (
                                <>
                                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <Bot size={20} />
                                    Analyze Bug
                                </>
                            )}

                        </button>

                    </div>
                )}


                {/* ERROR */}
                {error && (
                    <div className="mt-6 flex gap-3 items-start bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">

                        <AlertCircle
                            className="text-red-500 mt-0.5 shrink-0"
                            size={22}
                        />

                        <div>
                            <p className="font-semibold text-red-700 dark:text-red-400">
                                Analysis Error
                            </p>

                            <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                                {error}
                            </p>
                        </div>

                    </div>
                )}


                {/* AI RESULT */}
                {resolution && (
                    <div className="mt-8">

                        {/* RESULT HEADER */}
                        <div className="flex items-center gap-3 mb-5">

                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-md">
                                <Bot size={22} />
                            </div>

                            <div>
                                <div className="flex items-center gap-3">

                                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                        AI Analysis
                                    </h2>

                                    <span className="px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold">
                                        GENERATED
                                    </span>

                                </div>

                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Resolution guidance for Bug #{selectedBug?.bug_id}
                                </p>
                            </div>

                        </div>


                        {/* AI CARDS */}
                        {formattedResolution.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                {formattedResolution.map((section, index) => (

                                    <div
                                        key={index}
                                        className={`
                                            bg-white dark:bg-slate-900
                                            rounded-2xl
                                            border border-gray-200 dark:border-slate-800
                                            shadow-sm
                                            p-6
                                            transition
                                            hover:shadow-md
                                            ${
                                                index === 3 || index === 4
                                                    ? "md:col-span-2"
                                                    : ""
                                            }
                                        `}
                                    >

                                        {/* CARD HEADER */}
                                        <div className="flex items-center gap-3 mb-5">

                                            <div
                                                className={`
                                                    w-11 h-11
                                                    rounded-xl
                                                    flex items-center justify-center
                                                    shrink-0
                                                    ${
                                                        index === 0
                                                            ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                                                            : index === 1
                                                            ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
                                                            : index === 2
                                                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                                            : index === 3
                                                            ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                                                            : "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                                                    }
                                                `}
                                            >
                                                {section.icon}
                                            </div>

                                            <div>
                                                <h3 className="font-bold text-gray-800 dark:text-white">
                                                    {section.title}
                                                </h3>

                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                    AI-generated guidance
                                                </p>
                                            </div>

                                        </div>


                                        {/* CARD CONTENT */}
                                        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">

                                            {section.content.map(
                                                (line, lineIndex) => (

                                                    <div
                                                        key={lineIndex}
                                                        className="flex items-start gap-3"
                                                    >

                                                        <span
                                                            className={`
                                                                mt-1.5
                                                                w-2 h-2
                                                                rounded-full
                                                                shrink-0
                                                                ${
                                                                    index === 0
                                                                        ? "bg-red-500"
                                                                        : index === 1
                                                                        ? "bg-amber-500"
                                                                        : index === 2
                                                                        ? "bg-blue-500"
                                                                        : index === 3
                                                                        ? "bg-green-500"
                                                                        : "bg-purple-500"
                                                                }
                                                            `}
                                                        />

                                                        <span>
                                                            {line}
                                                        </span>

                                                    </div>

                                                )
                                            )}

                                        </div>

                                    </div>

                                ))}

                            </div>
                        ) : (

                            /* FALLBACK */
                            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-6 border border-gray-200 dark:border-slate-800">

                                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                                    {resolution}
                                </p>

                            </div>

                        )}


                    </div>
                )}


                {/* HISTORICAL RESOLUTION */}
                {historicalResolutions.length > 0 && (
                    <div className="mt-10">

                        <div className="flex items-center gap-3 mb-5">

                            <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                                <Search size={22} />
                            </div>

                            <div>

                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                    Historical Resolution
                                </h2>

                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Previously resolved similar defects
                                </p>

                            </div>

                        </div>


                        <div className="grid grid-cols-1 gap-5">

                            {historicalResolutions.map((history) => (

                                <div
                                    key={history.bug_id}
                                    className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm p-6"
                                >

                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">

                                        <div>

                                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                                Related Defect
                                            </p>

                                            <h3 className="text-lg font-bold text-gray-800 dark:text-white mt-1">
                                                #{history.bug_id} - {history.title}
                                            </h3>

                                        </div>

                                        <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-semibold whitespace-nowrap">
                                            Resolved
                                        </span>

                                    </div>


                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                                        <div className="rounded-xl bg-gray-50 dark:bg-slate-800/70 p-4">

                                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                Previous Root Cause
                                            </p>

                                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                                {history.description ||
                                                    "No previous root cause was recorded."}
                                            </p>

                                        </div>


                                        <div className="rounded-xl bg-gray-50 dark:bg-slate-800/70 p-4">

                                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                Previous Resolution
                                            </p>

                                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                                {history.comment ||
                                                    "No previous resolution was recorded."}
                                            </p>

                                        </div>


                                        <div className="rounded-xl bg-gray-50 dark:bg-slate-800/70 p-4">

                                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                Relevant Developer Comments
                                            </p>

                                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                                {history.comment ||
                                                    "No developer comments available."}
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    </div>
                )}

            </main>

        </div>

    </div>
);
}

export default AIResolution;