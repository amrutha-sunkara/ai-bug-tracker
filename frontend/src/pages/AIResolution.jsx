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
                    text-gray-800
                    dark:text-white
                ">

                    Loading AI Resolution...

                </h1>

            </div>

        );

    }


    const formattedResolution =
        formatResolution(resolution);


    return (

        <div className="
            flex
            min-h-screen
            bg-gray-100
            dark:bg-slate-950
        ">


            {/* SIDEBAR */}

            <Sidebar />


            {/* MAIN AREA */}

            <div className="flex-1 min-w-0">


                {/* NAVBAR */}

                <Navbar />


                {/* PAGE CONTENT */}

                <div className="
                    p-6
                    md:p-8
                    max-w-7xl
                    mx-auto
                ">


                    {/* HEADER */}

                    <div className="
                        flex
                        items-center
                        gap-4
                        mb-8
                    ">


                        <div className="
                            w-14
                            h-14
                            rounded-2xl
                            bg-gradient-to-br
                            from-blue-600
                            to-purple-600
                            flex
                            items-center
                            justify-center
                            text-white
                            shadow-lg
                            shrink-0
                        ">

                            <Bot size={30} />

                        </div>


                        <div>

                            <h1 className="
                                text-3xl
                                md:text-4xl
                                font-bold
                                text-gray-800
                                dark:text-white
                            ">

                                AI Resolution Assistance

                            </h1>


                            <p className="
                                mt-1
                                text-gray-600
                                dark:text-gray-400
                            ">

                                Analyze bugs and get AI-powered debugging guidance.

                            </p>

                        </div>

                    </div>



                    {/* BUG SELECTION */}

                    <div className="
                        bg-white
                        dark:bg-slate-900
                        rounded-2xl
                        shadow-sm
                        border
                        border-gray-200
                        dark:border-slate-800
                        p-6
                    ">


                        <label className="
                            block
                            text-sm
                            font-semibold
                            text-gray-700
                            dark:text-gray-300
                            mb-3
                        ">

                            Select Bug

                        </label>


                        <select
                            onChange={handleBugChange}
                            defaultValue=""
                            className="
                                w-full
                                border
                                border-gray-300
                                dark:border-slate-700
                                rounded-xl
                                p-3.5
                                bg-white
                                dark:bg-slate-800
                                text-gray-800
                                dark:text-white
                                focus:outline-none
                                focus:ring-2
                                focus:ring-blue-500
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

                        <div className="
                            mt-6
                            bg-white
                            dark:bg-slate-900
                            rounded-2xl
                            shadow-sm
                            border
                            border-gray-200
                            dark:border-slate-800
                            p-6
                        ">


                            <div className="
                                flex
                                items-start
                                justify-between
                                gap-4
                            ">


                                <div>

                                    <p className="
                                        text-xs
                                        font-semibold
                                        text-gray-500
                                        dark:text-gray-400
                                        uppercase
                                        tracking-wide
                                    ">

                                        Bug #{selectedBug.bug_id}

                                    </p>


                                    <h2 className="
                                        text-xl
                                        font-bold
                                        text-gray-800
                                        dark:text-white
                                        mt-1
                                    ">

                                        {selectedBug.title}

                                    </h2>

                                </div>


                                <div className="
                                    px-3
                                    py-1
                                    rounded-full
                                    bg-blue-100
                                    dark:bg-blue-900/30
                                    text-blue-700
                                    dark:text-blue-400
                                    text-sm
                                    font-semibold
                                    whitespace-nowrap
                                ">

                                    AI Ready

                                </div>

                            </div>


                            <p className="
                                mt-4
                                text-gray-600
                                dark:text-gray-400
                                leading-relaxed
                            ">

                                {selectedBug.description}

                            </p>


                            {/* ANALYZE BUTTON */}

                            <button
                                onClick={handleAnalyze}
                                disabled={analyzing}
                                className="
                                    mt-6
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                    px-6
                                    py-3
                                    rounded-xl
                                    bg-gradient-to-r
                                    from-blue-600
                                    to-purple-600
                                    hover:from-blue-700
                                    hover:to-purple-700
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

                                        <span className="
                                            w-5
                                            h-5
                                            border-2
                                            border-white
                                            border-t-transparent
                                            rounded-full
                                            animate-spin
                                        " />

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

                        <div className="
                            mt-6
                            flex
                            gap-3
                            items-start
                            bg-red-50
                            dark:bg-red-900/20
                            border
                            border-red-200
                            dark:border-red-800
                            rounded-xl
                            p-4
                        ">


                            <AlertCircle
                                className="
                                    text-red-500
                                    mt-0.5
                                    shrink-0
                                "
                                size={22}
                            />


                            <div>

                                <p className="
                                    font-semibold
                                    text-red-700
                                    dark:text-red-400
                                ">

                                    Analysis Error

                                </p>


                                <p className="
                                    text-sm
                                    text-red-600
                                    dark:text-red-300
                                    mt-1
                                ">

                                    {error}

                                </p>

                            </div>

                        </div>

                    )}



                    {/* AI RESULT */}

                    {resolution && (

                        <div className="mt-8">


                            {/* AI RESULT HEADER */}

                            <div className="
                                flex
                                items-center
                                gap-3
                                mb-5
                            ">


                                <div className="
                                    w-10
                                    h-10
                                    rounded-xl
                                    bg-gradient-to-br
                                    from-blue-600
                                    to-purple-600
                                    flex
                                    items-center
                                    justify-center
                                    text-white
                                    shrink-0
                                ">

                                    <Bot size={22} />

                                </div>


                                <div>

                                    <h2 className="
                                        text-2xl
                                        font-bold
                                        text-gray-800
                                        dark:text-white
                                    ">

                                        AI Analysis

                                    </h2>


                                    <p className="
                                        text-sm
                                        text-gray-500
                                        dark:text-gray-400
                                    ">

                                        Resolution guidance for Bug #
                                        {selectedBug?.bug_id}

                                    </p>

                                </div>

                            </div>



                            {/* AI CARDS */}

                            {formattedResolution.length > 0 ? (

                                <div className="
                                    grid
                                    grid-cols-1
                                    md:grid-cols-2
                                    gap-5
                                ">


                                    {formattedResolution.map(
                                        (section, index) => (

                                            <div
                                                key={index}
                                                className={`
                                                    bg-white
                                                    dark:bg-slate-900
                                                    rounded-2xl
                                                    border
                                                    border-gray-200
                                                    dark:border-slate-800
                                                    shadow-sm
                                                    p-5
                                                    transition
                                                    hover:shadow-md
                                                    ${
                                                        index === 3 ||
                                                        index === 4
                                                            ? "md:col-span-2"
                                                            : ""
                                                    }
                                                `}
                                            >


                                                {/* CARD HEADER */}

                                                <div className="
                                                    flex
                                                    items-center
                                                    gap-3
                                                    mb-4
                                                ">


                                                    <div className="
                                                        w-10
                                                        h-10
                                                        rounded-xl
                                                        bg-blue-50
                                                        dark:bg-blue-900/20
                                                        text-blue-600
                                                        dark:text-blue-400
                                                        flex
                                                        items-center
                                                        justify-center
                                                        shrink-0
                                                    ">

                                                        {section.icon}

                                                    </div>


                                                    <h3 className="
                                                        font-bold
                                                        text-gray-800
                                                        dark:text-white
                                                    ">

                                                        {section.title}

                                                    </h3>

                                                </div>



                                                {/* CARD CONTENT */}

                                                <div className="
                                                    space-y-2.5
                                                    text-sm
                                                    text-gray-600
                                                    dark:text-gray-400
                                                    leading-relaxed
                                                ">


                                                    {section.content.map(
                                                        (line, lineIndex) => (

                                                            <div
                                                                key={lineIndex}
                                                                className="
                                                                    flex
                                                                    items-start
                                                                    gap-2
                                                                "
                                                            >

                                                                <span className="
                                                                    text-blue-500
                                                                    mt-1
                                                                    shrink-0
                                                                ">
                                                                    •
                                                                </span>


                                                                <span>
                                                                    {line}
                                                                </span>

                                                            </div>

                                                        )
                                                    )}

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            ) : (

                                /* FALLBACK */

                                <div className="
                                    bg-white
                                    dark:bg-slate-900
                                    rounded-2xl
                                    shadow-sm
                                    p-6
                                    border
                                    border-gray-200
                                    dark:border-slate-800
                                ">

                                    <p className="
                                        text-gray-700
                                        dark:text-gray-300
                                        whitespace-pre-line
                                        leading-relaxed
                                    ">

                                        {resolution}

                                    </p>

                                </div>

                            )}

                        </div>

                    )}


                    {historicalResolutions.length > 0 && (

                        <div className="mt-8">

                            <div className="
                                flex
                                items-center
                                gap-3
                                mb-5
                            ">

                                <div className="
                                    w-10
                                    h-10
                                    rounded-xl
                                    bg-blue-50
                                    dark:bg-blue-900/20
                                    text-blue-600
                                    dark:text-blue-400
                                    flex
                                    items-center
                                    justify-center
                                    shrink-0
                                ">
                                    <Search size={22} />
                                </div>

                                <div>

                                    <h2 className="
                                        text-2xl
                                        font-bold
                                        text-gray-800
                                        dark:text-white
                                    ">
                                        Historical Resolution
                                    </h2>

                                    <p className="
                                        text-sm
                                        text-gray-500
                                        dark:text-gray-400
                                    ">
                                        Previously resolved similar defects
                                    </p>

                                </div>

                            </div>


                            <div className="
                                grid
                                grid-cols-1
                                gap-5
                            ">

                                {historicalResolutions.map((history) => (

                                    <div
                                        key={history.bug_id}
                                        className="
                                            bg-white
                                            dark:bg-slate-900
                                            rounded-2xl
                                            border
                                            border-gray-200
                                            dark:border-slate-800
                                            shadow-sm
                                            p-6
                                        "
                                    >

                                        <div className="
                                            flex
                                            items-start
                                            justify-between
                                            gap-4
                                            mb-5
                                        ">

                                            <div>

                                                <p className="
                                                    text-xs
                                                    font-semibold
                                                    text-gray-500
                                                    dark:text-gray-400
                                                    uppercase
                                                    tracking-wide
                                                ">
                                                    Related Defect
                                                </p>

                                                <h3 className="
                                                    text-lg
                                                    font-bold
                                                    text-gray-800
                                                    dark:text-white
                                                    mt-1
                                                ">
                                                    #{history.bug_id} - {history.title}
                                                </h3>

                                            </div>

                                            <span className="
                                                px-3
                                                py-1
                                                rounded-full
                                                bg-green-100
                                                dark:bg-green-900/30
                                                text-green-700
                                                dark:text-green-400
                                                text-sm
                                                font-semibold
                                                whitespace-nowrap
                                            ">
                                                Resolved
                                            </span>

                                        </div>


                                        <div className="space-y-5">

                                            <div>

                                                <p className="
                                                    text-sm
                                                    font-semibold
                                                    text-gray-700
                                                    dark:text-gray-300
                                                    mb-1
                                                ">
                                                    Previous Root Cause
                                                </p>

                                                <p className="
                                                    text-sm
                                                    text-gray-600
                                                    dark:text-gray-400
                                                    leading-relaxed
                                                ">
                                                    {history.description ||
                                                        "No previous root cause was recorded."}
                                                </p>

                                            </div>


                                            <div>

                                                <p className="
                                                    text-sm
                                                    font-semibold
                                                    text-gray-700
                                                    dark:text-gray-300
                                                    mb-1
                                                ">
                                                    Previous Resolution
                                                </p>

                                                <p className="
                                                    text-sm
                                                    text-gray-600
                                                    dark:text-gray-400
                                                    leading-relaxed
                                                ">
                                                    {history.comment ||
                                                        "No previous resolution was recorded."}
                                                </p>

                                            </div>


                                            <div>

                                                <p className="
                                                    text-sm
                                                    font-semibold
                                                    text-gray-700
                                                    dark:text-gray-300
                                                    mb-1
                                                ">
                                                    Relevant Developer Comments
                                                </p>

                                                <p className="
                                                    text-sm
                                                    text-gray-600
                                                    dark:text-gray-400
                                                    leading-relaxed
                                                ">
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

                </div>

            </div>

        </div>

    );

}


export default AIResolution;