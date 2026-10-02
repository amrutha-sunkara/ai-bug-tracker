import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


export default function Home(){


return(

<>


<Navbar landing={true}/>



<div className="
min-h-screen
bg-slate-950
text-white
overflow-hidden
">





{/* HERO */}


<section className="relative">


<div className="
absolute
inset-0
bg-gradient-to-r
from-blue-600/20
via-purple-600/20
to-cyan-500/20
blur-3xl
">
</div>




<div className="
relative
max-w-7xl
mx-auto
px-8
pt-40
pb-28
grid
md:grid-cols-2
gap-12
items-center
">





{/* LEFT CONTENT */}



<div>


<p className="
text-cyan-400
text-lg
mb-5
font-semibold
">

🤖 AI Powered Software Intelligence

</p>





<h1 className="
text-6xl
md:text-7xl
font-extrabold
leading-tight
bg-gradient-to-r
from-white
via-cyan-200
to-purple-400
bg-clip-text
text-transparent
">


Track Bugs.

<br/>

Fix Faster.

<br/>

Build Better.


</h1>





<p className="
mt-8
text-xl
text-gray-400
max-w-xl
">

An intelligent bug management platform that helps teams
track issues, generate AI-powered reports and improve
software quality.

</p>
<div className="
flex
flex-wrap
gap-3
mt-6
">

<span className="
px-4
py-2
rounded-full
bg-cyan-400/10
border
border-cyan-400/20
text-cyan-300
text-sm
font-semibold
">

🤖 AI-Powered Analysis

</span>

<span className="
px-4
py-2
rounded-full
bg-purple-400/10
border
border-purple-400/20
text-purple-300
text-sm
font-semibold
">

📊 Sprint Analytics

</span>

<span className="
px-4
py-2
rounded-full
bg-blue-400/10
border
border-blue-400/20
text-blue-300
text-sm
font-semibold
">

🔐 Role-Based Access

</span>

</div>






<div className="
flex
gap-6
mt-10
">


<Link

to="/register"

className="
px-8
py-4
rounded-xl
bg-gradient-to-r
from-cyan-400
to-blue-500
font-bold
shadow-xl
hover:scale-105
transition
"

>

Get Started 🚀

</Link>
<button
onClick={() =>
    document
        .getElementById("workflow")
        ?.scrollIntoView({ behavior: "smooth" })
}
className="
px-8
py-4
rounded-xl
border
border-purple-400/40
text-purple-200
bg-purple-500/5
hover:bg-purple-500/15
hover:border-purple-400/70
transition
hover:scale-105
font-semibold
"
>
See How It Works
</button>




<Link

to="/login"

className="
px-8
py-4
rounded-xl
border
border-gray-600
hover:bg-white
hover:text-black
transition
"

>

Login

</Link>



</div>



</div>







{/* AI DASHBOARD MOCKUP */}



<div className="
relative
">


<div className="
bg-slate-900
border
border-slate-700
rounded-3xl
p-6
shadow-2xl
hover:scale-105
transition
">


<div className="
flex
justify-between
mb-6
">


<h3 className="
text-xl
font-bold
">

AI Dashboard

</h3>


<span className="
text-green-400
">

● Online

</span>


</div>




<div className="
space-y-4
">


<div className="
bg-slate-800
p-4
rounded-xl
">

🐞 Bugs Detected

<h2 className="
text-3xl
font-bold
">

24

</h2>

</div>




<div className="
bg-slate-800
p-4
rounded-xl
">

🤖 AI Reports Generated

<h2 className="
text-3xl
font-bold
">

18

</h2>

</div>




<div className="
bg-slate-800
p-4
rounded-xl
">

📊 Resolution Rate

<h2 className="
text-3xl
font-bold
text-cyan-400
">

92%

</h2>

</div>



</div>



</div>


</div>



</div>


</section>










{/* FEATURES */}



<section className="
max-w-7xl
mx-auto
px-8
py-20
">



<h2 className="
text-5xl
font-bold
text-center
mb-14
">

Powerful Features

</h2>





<div className="
grid
md:grid-cols-4
gap-8
">





{


[

{
icon:"🐞",
title:"Bug Tracking",
desc:"Create, assign and manage software bugs easily."
},


{
icon:"🤖",
title:"AI Reports",
desc:"Convert descriptions into professional QA reports."
},


{
icon:"📊",
title:"Analytics",
desc:"Visualize bugs and project performance."
},


{
icon:"📁",
title:"Projects",
desc:"Manage multiple software projects."
}


].map((feature)=>(


<div

key={feature.title}

className="
bg-slate-900
border
border-slate-700
p-7
rounded-2xl
hover:-translate-y-2
transition
shadow-lg
"


>


<div className="
text-4xl
mb-4
">

{feature.icon}

</div>



<h3 className="
text-xl
font-bold
mb-3
">

{feature.title}

</h3>



<p className="
text-gray-400
">

{feature.desc}

</p>



</div>



))


}





</div>



</section>









{/* HOW IT WORKS */}

<section
    id="workflow"
    className="
        py-24
        px-8
        bg-gradient-to-b
        from-slate-950
        via-slate-900
        to-slate-950
    "
>

    <div className="max-w-7xl mx-auto">

        {/* Section Heading */}

        <div className="text-center mb-16">

            <p className="
                text-cyan-400
                font-semibold
                text-sm
                uppercase
                tracking-[0.25em]
                mb-4
            ">
                Simple Workflow
            </p>

            <h2 className="
                text-4xl
                md:text-5xl
                font-bold
                text-white
            ">
                How It Works
            </h2>

            <p className="
                mt-5
                text-gray-400
                text-lg
                max-w-2xl
                mx-auto
            ">
                From reporting a defect to closing it successfully,
                Bug Tracker AI helps your team manage the complete
                defect lifecycle.
            </p>

        </div>


        {/* Workflow Steps */}

        <div className="
            grid
            grid-cols-1
            md:grid-cols-4
            gap-6
            relative
        ">

            {/* STEP 1 */}

            <div className="
                group
                relative
                bg-slate-900
                border
                border-slate-700
                rounded-2xl
                p-7
                text-center
                transition-all
                duration-300
                hover:-translate-y-2
                hover:border-cyan-400/50
                hover:shadow-[0_15px_40px_rgba(34,211,238,0.10)]
            ">

                <div className="
                    absolute
                    top-5
                    right-5
                    text-xs
                    font-bold
                    text-cyan-400
                ">
                    01
                </div>

                <div className="
                    w-16
                    h-16
                    mx-auto
                    rounded-2xl
                    bg-cyan-400/10
                    border
                    border-cyan-400/20
                    flex
                    items-center
                    justify-center
                    text-3xl
                    mb-6
                    group-hover:scale-110
                    transition
                ">
                    🐞
                </div>

                <h3 className="
                    text-xl
                    font-bold
                    text-white
                    mb-3
                ">
                    Report Bug
                </h3>

                <p className="
                    text-gray-400
                    text-sm
                    leading-6
                ">
                    Create a defect report with its description,
                    priority and severity.
                </p>

            </div>


            {/* ARROW */}

            <div className="
                hidden
                md:flex
                absolute
                top-1/2
                left-[23%]
                text-cyan-400/60
                text-2xl
                -translate-y-1/2
            ">
                →
            </div>


            {/* STEP 2 */}

            <div className="
                group
                relative
                bg-slate-900
                border
                border-slate-700
                rounded-2xl
                p-7
                text-center
                transition-all
                duration-300
                hover:-translate-y-2
                hover:border-purple-400/50
                hover:shadow-[0_15px_40px_rgba(168,85,247,0.10)]
            ">

                <div className="
                    absolute
                    top-5
                    right-5
                    text-xs
                    font-bold
                    text-purple-400
                ">
                    02
                </div>

                <div className="
                    w-16
                    h-16
                    mx-auto
                    rounded-2xl
                    bg-purple-400/10
                    border
                    border-purple-400/20
                    flex
                    items-center
                    justify-center
                    text-3xl
                    mb-6
                    group-hover:scale-110
                    transition
                ">
                    🤖
                </div>

                <h3 className="
                    text-xl
                    font-bold
                    text-white
                    mb-3
                ">
                    AI Analysis
                </h3>

                <p className="
                    text-gray-400
                    text-sm
                    leading-6
                ">
                    AI analyzes the defect and provides
                    intelligent assistance for investigation
                    and resolution.
                </p>

            </div>


            {/* ARROW */}

            <div className="
                hidden
                md:flex
                absolute
                top-1/2
                left-[48%]
                text-purple-400/60
                text-2xl
                -translate-y-1/2
            ">
                →
            </div>


            {/* STEP 3 */}

            <div className="
                group
                relative
                bg-slate-900
                border
                border-slate-700
                rounded-2xl
                p-7
                text-center
                transition-all
                duration-300
                hover:-translate-y-2
                hover:border-blue-400/50
                hover:shadow-[0_15px_40px_rgba(59,130,246,0.10)]
            ">

                <div className="
                    absolute
                    top-5
                    right-5
                    text-xs
                    font-bold
                    text-blue-400
                ">
                    03
                </div>

                <div className="
                    w-16
                    h-16
                    mx-auto
                    rounded-2xl
                    bg-blue-400/10
                    border
                    border-blue-400/20
                    flex
                    items-center
                    justify-center
                    text-3xl
                    mb-6
                    group-hover:scale-110
                    transition
                ">
                    👥
                </div>

                <h3 className="
                    text-xl
                    font-bold
                    text-white
                    mb-3
                ">
                    Track & Manage
                </h3>

                <p className="
                    text-gray-400
                    text-sm
                    leading-6
                ">
                    Assign defects, update their status and
                    organize work through sprint management.
                </p>

            </div>


            {/* ARROW */}

            <div className="
                hidden
                md:flex
                absolute
                top-1/2
                right-[23%]
                text-blue-400/60
                text-2xl
                -translate-y-1/2
            ">
                →
            </div>


            {/* STEP 4 */}

            <div className="
                group
                relative
                bg-slate-900
                border
                border-slate-700
                rounded-2xl
                p-7
                text-center
                transition-all
                duration-300
                hover:-translate-y-2
                hover:border-emerald-400/50
                hover:shadow-[0_15px_40px_rgba(52,211,153,0.10)]
            ">

                <div className="
                    absolute
                    top-5
                    right-5
                    text-xs
                    font-bold
                    text-emerald-400
                ">
                    04
                </div>

                <div className="
                    w-16
                    h-16
                    mx-auto
                    rounded-2xl
                    bg-emerald-400/10
                    border
                    border-emerald-400/20
                    flex
                    items-center
                    justify-center
                    text-3xl
                    mb-6
                    group-hover:scale-110
                    transition
                ">
                    ✅
                </div>

                <h3 className="
                    text-xl
                    font-bold
                    text-white
                    mb-3
                ">
                    Resolve & Verify
                </h3>

                <p className="
                    text-gray-400
                    text-sm
                    leading-6
                ">
                    Resolve the defect, verify the fix and
                    close the issue with complete history.
                </p>

            </div>

        </div>


        {/* Workflow Status Line */}

        <div className="
            mt-14
            flex
            flex-wrap
            justify-center
            items-center
            gap-3
            text-sm
            text-gray-400
        ">

            <span className="text-cyan-400">
                Reported
            </span>

            <span>→</span>

            <span className="text-blue-400">
                Assigned
            </span>

            <span>→</span>

            <span className="text-purple-400">
                In Progress
            </span>

            <span>→</span>

            <span className="text-orange-400">
                Resolved
            </span>

            <span>→</span>

            <span className="text-yellow-400">
                Verified
            </span>

            <span>→</span>

            <span className="text-emerald-400">
                Closed
            </span>

        </div>

    </div>

</section>
{/* TEAM ROLES */}

<section
    className="
        relative
        py-24
        px-8
        bg-gradient-to-b
        from-slate-950
        via-slate-900
        to-slate-950
    "
>

    <div className="max-w-7xl mx-auto">

        {/* Section Heading */}

        <div className="text-center mb-16">

            <p className="
                text-purple-400
                font-semibold
                text-sm
                uppercase
                tracking-[0.25em]
                mb-4
            ">
                Built For Every Team
            </p>

            <h2 className="
                text-4xl
                md:text-5xl
                font-bold
                text-white
            ">
                One Platform. Three Powerful Roles.
            </h2>

            <p className="
                mt-5
                text-gray-400
                text-lg
                max-w-2xl
                mx-auto
            ">
                Bug Tracker AI gives every team member the tools
                they need to manage defects efficiently and
                deliver better software.
            </p>

        </div>


        {/* ROLE CARDS */}

        <div className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-8
        ">


            {/* MANAGER */}

            <div className="
                group
                relative
                bg-slate-900
                border
                border-slate-700
                rounded-3xl
                p-8
                transition-all
                duration-300
                hover:-translate-y-2
                hover:border-blue-400/50
                hover:shadow-[0_20px_50px_rgba(59,130,246,0.12)]
                overflow-hidden
            ">

                {/* Glow */}

                <div className="
                    absolute
                    -top-20
                    -right-20
                    w-40
                    h-40
                    bg-blue-500/10
                    rounded-full
                    blur-3xl
                    group-hover:bg-blue-500/20
                    transition
                ">
                </div>


                {/* Icon */}

                <div className="
                    relative
                    w-16
                    h-16
                    rounded-2xl
                    bg-blue-400/10
                    border
                    border-blue-400/20
                    flex
                    items-center
                    justify-center
                    text-3xl
                    mb-6
                    group-hover:scale-110
                    transition
                ">
                    👨‍💼
                </div>


                {/* Title */}

                <h3 className="
                    text-2xl
                    font-bold
                    text-white
                    mb-3
                ">
                    Manager
                </h3>


                <p className="
                    text-gray-400
                    text-sm
                    leading-6
                    mb-7
                ">
                    Manage projects, organize sprints and
                    monitor the overall progress of the
                    development team.
                </p>


                {/* Responsibilities */}

                <div className="space-y-4">

                    <div className="flex items-center gap-3">

                        <span className="
                            w-7
                            h-7
                            rounded-lg
                            bg-blue-400/10
                            text-blue-400
                            flex
                            items-center
                            justify-center
                            text-sm
                        ">
                            ✓
                        </span>

                        <span className="text-gray-300 text-sm">
                            Manage projects
                        </span>

                    </div>


                    <div className="flex items-center gap-3">

                        <span className="
                            w-7
                            h-7
                            rounded-lg
                            bg-blue-400/10
                            text-blue-400
                            flex
                            items-center
                            justify-center
                            text-sm
                        ">
                            ✓
                        </span>

                        <span className="text-gray-300 text-sm">
                            Create and manage sprints
                        </span>

                    </div>


                    <div className="flex items-center gap-3">

                        <span className="
                            w-7
                            h-7
                            rounded-lg
                            bg-blue-400/10
                            text-blue-400
                            flex
                            items-center
                            justify-center
                            text-sm
                        ">
                            ✓
                        </span>

                        <span className="text-gray-300 text-sm">
                            Monitor dashboard analytics
                        </span>

                    </div>


                    <div className="flex items-center gap-3">

                        <span className="
                            w-7
                            h-7
                            rounded-lg
                            bg-blue-400/10
                            text-blue-400
                            flex
                            items-center
                            justify-center
                            text-sm
                        ">
                            ✓
                        </span>

                        <span className="text-gray-300 text-sm">
                            Manage team workflow
                        </span>

                    </div>

                </div>


                {/* Role Label */}

                <div className="
                    mt-8
                    pt-5
                    border-t
                    border-slate-700
                    text-blue-400
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                ">
                    Project & Team Management
                </div>

            </div>



            {/* TESTER */}

            <div className="
                group
                relative
                bg-slate-900
                border
                border-slate-700
                rounded-3xl
                p-8
                transition-all
                duration-300
                hover:-translate-y-2
                hover:border-cyan-400/50
                hover:shadow-[0_20px_50px_rgba(34,211,238,0.12)]
                overflow-hidden
            ">

                {/* Glow */}

                <div className="
                    absolute
                    -top-20
                    -right-20
                    w-40
                    h-40
                    bg-cyan-500/10
                    rounded-full
                    blur-3xl
                    group-hover:bg-cyan-500/20
                    transition
                ">
                </div>


                {/* Icon */}

                <div className="
                    relative
                    w-16
                    h-16
                    rounded-2xl
                    bg-cyan-400/10
                    border
                    border-cyan-400/20
                    flex
                    items-center
                    justify-center
                    text-3xl
                    mb-6
                    group-hover:scale-110
                    transition
                ">
                    🧪
                </div>


                {/* Title */}

                <h3 className="
                    text-2xl
                    font-bold
                    text-white
                    mb-3
                ">
                    Tester
                </h3>


                <p className="
                    text-gray-400
                    text-sm
                    leading-6
                    mb-7
                ">
                    Identify defects, provide detailed reports
                    and verify that resolved issues are working
                    correctly.
                </p>


                {/* Responsibilities */}

                <div className="space-y-4">

                    <div className="flex items-center gap-3">

                        <span className="
                            w-7
                            h-7
                            rounded-lg
                            bg-cyan-400/10
                            text-cyan-400
                            flex
                            items-center
                            justify-center
                            text-sm
                        ">
                            ✓
                        </span>

                        <span className="text-gray-300 text-sm">
                            Report software defects
                        </span>

                    </div>


                    <div className="flex items-center gap-3">

                        <span className="
                            w-7
                            h-7
                            rounded-lg
                            bg-cyan-400/10
                            text-cyan-400
                            flex
                            items-center
                            justify-center
                            text-sm
                        ">
                            ✓
                        </span>

                        <span className="text-gray-300 text-sm">
                            Set priority and severity
                        </span>

                    </div>


                    <div className="flex items-center gap-3">

                        <span className="
                            w-7
                            h-7
                            rounded-lg
                            bg-cyan-400/10
                            text-cyan-400
                            flex
                            items-center
                            justify-center
                            text-sm
                        ">
                            ✓
                        </span>

                        <span className="text-gray-300 text-sm">
                            Generate AI-assisted reports
                        </span>

                    </div>


                    <div className="flex items-center gap-3">

                        <span className="
                            w-7
                            h-7
                            rounded-lg
                            bg-cyan-400/10
                            text-cyan-400
                            flex
                            items-center
                            justify-center
                            text-sm
                        ">
                            ✓
                        </span>

                        <span className="text-gray-300 text-sm">
                            Verify resolved defects
                        </span>

                    </div>

                </div>


                {/* Role Label */}

                <div className="
                    mt-8
                    pt-5
                    border-t
                    border-slate-700
                    text-cyan-400
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                ">
                    Quality Assurance
                </div>

            </div>



            {/* DEVELOPER */}

            <div className="
                group
                relative
                bg-slate-900
                border
                border-slate-700
                rounded-3xl
                p-8
                transition-all
                duration-300
                hover:-translate-y-2
                hover:border-purple-400/50
                hover:shadow-[0_20px_50px_rgba(168,85,247,0.12)]
                overflow-hidden
            ">

                {/* Glow */}

                <div className="
                    absolute
                    -top-20
                    -right-20
                    w-40
                    h-40
                    bg-purple-500/10
                    rounded-full
                    blur-3xl
                    group-hover:bg-purple-500/20
                    transition
                ">
                </div>


                {/* Icon */}

                <div className="
                    relative
                    w-16
                    h-16
                    rounded-2xl
                    bg-purple-400/10
                    border
                    border-purple-400/20
                    flex
                    items-center
                    justify-center
                    text-3xl
                    mb-6
                    group-hover:scale-110
                    transition
                ">
                    💻
                </div>


                {/* Title */}

                <h3 className="
                    text-2xl
                    font-bold
                    text-white
                    mb-3
                ">
                    Developer
                </h3>


                <p className="
                    text-gray-400
                    text-sm
                    leading-6
                    mb-7
                ">
                    Investigate assigned defects, use AI-powered
                    assistance and resolve issues efficiently.
                </p>


                {/* Responsibilities */}

                <div className="space-y-4">

                    <div className="flex items-center gap-3">

                        <span className="
                            w-7
                            h-7
                            rounded-lg
                            bg-purple-400/10
                            text-purple-400
                            flex
                            items-center
                            justify-center
                            text-sm
                        ">
                            ✓
                        </span>

                        <span className="text-gray-300 text-sm">
                            View assigned defects
                        </span>

                    </div>


                    <div className="flex items-center gap-3">

                        <span className="
                            w-7
                            h-7
                            rounded-lg
                            bg-purple-400/10
                            text-purple-400
                            flex
                            items-center
                            justify-center
                            text-sm
                        ">
                            ✓
                        </span>

                        <span className="text-gray-300 text-sm">
                            Update defect status
                        </span>

                    </div>


                    <div className="flex items-center gap-3">

                        <span className="
                            w-7
                            h-7
                            rounded-lg
                            bg-purple-400/10
                            text-purple-400
                            flex
                            items-center
                            justify-center
                            text-sm
                        ">
                            ✓
                        </span>

                        <span className="text-gray-300 text-sm">
                            Get AI resolution assistance
                        </span>

                    </div>


                    <div className="flex items-center gap-3">

                        <span className="
                            w-7
                            h-7
                            rounded-lg
                            bg-purple-400/10
                            text-purple-400
                            flex
                            items-center
                            justify-center
                            text-sm
                        ">
                            ✓
                        </span>

                        <span className="text-gray-300 text-sm">
                            Resolve assigned bugs
                        </span>

                    </div>

                </div>


                {/* Role Label */}

                <div className="
                    mt-8
                    pt-5
                    border-t
                    border-slate-700
                    text-purple-400
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                ">
                    Development & Resolution
                </div>

            </div>

        </div>



        {/* Role Flow */}

        <div className="
            mt-14
            flex
            flex-wrap
            justify-center
            items-center
            gap-3
            text-sm
            text-gray-400
        ">

            <span className="text-cyan-400 font-semibold">
                Tester
            </span>

            <span>→</span>

            <span className="text-purple-400 font-semibold">
                Developer
            </span>

            <span>→</span>

            <span className="text-blue-400 font-semibold">
                Manager
            </span>

            <span className="mx-2 text-gray-600">
                •
            </span>

            <span className="text-gray-400">
                Collaborative defect management
            </span>

        </div>

    </div>

</section>
{/* AI INTELLIGENCE */}

<section
    className="
        relative
        py-24
        px-8
        overflow-hidden
        bg-gradient-to-b
        from-slate-950
        via-[#0B1020]
        to-slate-950
    "
>

    {/* Background Glow */}

    <div className="
        absolute
        top-20
        left-1/2
        -translate-x-1/2
        w-[500px]
        h-[300px]
        bg-purple-600/10
        rounded-full
        blur-3xl
        pointer-events-none
    ">
    </div>


    <div className="
        relative
        max-w-7xl
        mx-auto
    ">

        {/* Section Heading */}

        <div className="
            text-center
            mb-16
        ">

            <p className="
                text-purple-400
                font-semibold
                text-sm
                uppercase
                tracking-[0.25em]
                mb-4
            ">
                AI-Powered Intelligence
            </p>


            <h2 className="
                text-4xl
                md:text-5xl
                font-bold
                text-white
            ">
                Smarter Defect Management with AI
            </h2>


            <p className="
                mt-5
                text-gray-400
                text-lg
                max-w-2xl
                mx-auto
            ">
                Turn raw defect information into actionable
                insights and intelligent assistance throughout
                the software development lifecycle.
            </p>

        </div>


        {/* AI FEATURE GRID */}

        <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-3
            gap-7
        ">


            {/* AI BUG REPORT */}

            <div className="
                group
                relative
                bg-slate-900/90
                border
                border-cyan-400/10
                rounded-2xl
                p-7
                overflow-hidden
                transition-all
                duration-300
                hover:-translate-y-2
                hover:border-cyan-400/40
                hover:shadow-[0_20px_45px_rgba(34,211,238,0.10)]
            ">

                <div className="
                    absolute
                    -top-16
                    -right-16
                    w-32
                    h-32
                    rounded-full
                    bg-cyan-400/10
                    blur-3xl
                    group-hover:bg-cyan-400/20
                    transition
                ">
                </div>


                <div className="
                    relative
                    w-14
                    h-14
                    rounded-2xl
                    bg-cyan-400/10
                    border
                    border-cyan-400/20
                    flex
                    items-center
                    justify-center
                    text-2xl
                    mb-6
                    group-hover:scale-110
                    transition
                ">
                    🤖
                </div>


                <h3 className="
                    text-xl
                    font-bold
                    text-white
                    mb-3
                ">
                    AI Bug Reports
                </h3>


                <p className="
                    text-gray-400
                    text-sm
                    leading-6
                ">
                    Transform raw defect descriptions into
                    clearer and more professional bug reports
                    using AI assistance.
                </p>


                <div className="
                    mt-6
                    text-xs
                    font-semibold
                    text-cyan-400
                    uppercase
                    tracking-wider
                ">
                    Intelligent Reporting
                </div>

            </div>



            {/* AI RESOLUTION */}

            <div className="
                group
                relative
                bg-slate-900/90
                border
                border-purple-400/10
                rounded-2xl
                p-7
                overflow-hidden
                transition-all
                duration-300
                hover:-translate-y-2
                hover:border-purple-400/40
                hover:shadow-[0_20px_45px_rgba(168,85,247,0.10)]
            ">

                <div className="
                    absolute
                    -top-16
                    -right-16
                    w-32
                    h-32
                    rounded-full
                    bg-purple-400/10
                    blur-3xl
                    group-hover:bg-purple-400/20
                    transition
                ">
                </div>


                <div className="
                    relative
                    w-14
                    h-14
                    rounded-2xl
                    bg-purple-400/10
                    border
                    border-purple-400/20
                    flex
                    items-center
                    justify-center
                    text-2xl
                    mb-6
                    group-hover:scale-110
                    transition
                ">
                    🧠
                </div>


                <h3 className="
                    text-xl
                    font-bold
                    text-white
                    mb-3
                ">
                    AI Resolution Assistance
                </h3>


                <p className="
                    text-gray-400
                    text-sm
                    leading-6
                ">
                    Analyze reported defects and provide
                    investigation areas, debugging steps,
                    possible resolutions and prevention ideas.
                </p>


                <div className="
                    mt-6
                    text-xs
                    font-semibold
                    text-purple-400
                    uppercase
                    tracking-wider
                ">
                    Intelligent Resolution
                </div>

            </div>



            {/* SEMANTIC SEARCH */}

            <div className="
                group
                relative
                bg-slate-900/90
                border
                border-blue-400/10
                rounded-2xl
                p-7
                overflow-hidden
                transition-all
                duration-300
                hover:-translate-y-2
                hover:border-blue-400/40
                hover:shadow-[0_20px_45px_rgba(59,130,246,0.10)]
            ">

                <div className="
                    absolute
                    -top-16
                    -right-16
                    w-32
                    h-32
                    rounded-full
                    bg-blue-400/10
                    blur-3xl
                    group-hover:bg-blue-400/20
                    transition
                ">
                </div>


                <div className="
                    relative
                    w-14
                    h-14
                    rounded-2xl
                    bg-blue-400/10
                    border
                    border-blue-400/20
                    flex
                    items-center
                    justify-center
                    text-2xl
                    mb-6
                    group-hover:scale-110
                    transition
                ">
                    🔍
                </div>


                <h3 className="
                    text-xl
                    font-bold
                    text-white
                    mb-3
                ">
                    Semantic Bug Search
                </h3>


                <p className="
                    text-gray-400
                    text-sm
                    leading-6
                ">
                    Find related defects using semantic
                    similarity instead of relying only on
                    exact keyword matching.
                </p>


                <div className="
                    mt-6
                    text-xs
                    font-semibold
                    text-blue-400
                    uppercase
                    tracking-wider
                ">
                    Intelligent Search
                </div>

            </div>



            {/* ROOT CAUSE */}

            <div className="
                group
                relative
                bg-slate-900/90
                border
                border-orange-400/10
                rounded-2xl
                p-7
                overflow-hidden
                transition-all
                duration-300
                hover:-translate-y-2
                hover:border-orange-400/40
                hover:shadow-[0_20px_45px_rgba(251,146,60,0.10)]
            ">

                <div className="
                    absolute
                    -top-16
                    -right-16
                    w-32
                    h-32
                    rounded-full
                    bg-orange-400/10
                    blur-3xl
                    group-hover:bg-orange-400/20
                    transition
                ">
                </div>


                <div className="
                    relative
                    w-14
                    h-14
                    rounded-2xl
                    bg-orange-400/10
                    border
                    border-orange-400/20
                    flex
                    items-center
                    justify-center
                    text-2xl
                    mb-6
                    group-hover:scale-110
                    transition
                ">
                    🎯
                </div>


                <h3 className="
                    text-xl
                    font-bold
                    text-white
                    mb-3
                ">
                    Root Cause Analysis
                </h3>


                <p className="
                    text-gray-400
                    text-sm
                    leading-6
                ">
                    Use AI assistance to investigate possible
                    causes and understand the areas that may
                    be contributing to a defect.
                </p>


                <div className="
                    mt-6
                    text-xs
                    font-semibold
                    text-orange-400
                    uppercase
                    tracking-wider
                ">
                    Intelligent Investigation
                </div>

            </div>



            {/* TEST CASES */}

            <div className="
                group
                relative
                bg-slate-900/90
                border
                border-emerald-400/10
                rounded-2xl
                p-7
                overflow-hidden
                transition-all
                duration-300
                hover:-translate-y-2
                hover:border-emerald-400/40
                hover:shadow-[0_20px_45px_rgba(52,211,153,0.10)]
            ">

                <div className="
                    absolute
                    -top-16
                    -right-16
                    w-32
                    h-32
                    rounded-full
                    bg-emerald-400/10
                    blur-3xl
                    group-hover:bg-emerald-400/20
                    transition
                ">
                </div>


                <div className="
                    relative
                    w-14
                    h-14
                    rounded-2xl
                    bg-emerald-400/10
                    border
                    border-emerald-400/20
                    flex
                    items-center
                    justify-center
                    text-2xl
                    mb-6
                    group-hover:scale-110
                    transition
                ">
                    🧪
                </div>


                <h3 className="
                    text-xl
                    font-bold
                    text-white
                    mb-3
                ">
                    Test Case Suggestions
                </h3>


                <p className="
                    text-gray-400
                    text-sm
                    leading-6
                ">
                    Generate useful test case ideas based on
                    reported defects to support validation
                    and regression testing.
                </p>


                <div className="
                    mt-6
                    text-xs
                    font-semibold
                    text-emerald-400
                    uppercase
                    tracking-wider
                ">
                    Intelligent Testing
                </div>

            </div>



            {/* AI SPRINT PLANNING */}

            <div className="
                group
                relative
                bg-slate-900/90
                border
                border-pink-400/10
                rounded-2xl
                p-7
                overflow-hidden
                transition-all
                duration-300
                hover:-translate-y-2
                hover:border-pink-400/40
                hover:shadow-[0_20px_45px_rgba(236,72,153,0.10)]
            ">

                <div className="
                    absolute
                    -top-16
                    -right-16
                    w-32
                    h-32
                    rounded-full
                    bg-pink-400/10
                    blur-3xl
                    group-hover:bg-pink-400/20
                    transition
                ">
                </div>


                <div className="
                    relative
                    w-14
                    h-14
                    rounded-2xl
                    bg-pink-400/10
                    border
                    border-pink-400/20
                    flex
                    items-center
                    justify-center
                    text-2xl
                    mb-6
                    group-hover:scale-110
                    transition
                ">
                    📊
                </div>


                <h3 className="
                    text-xl
                    font-bold
                    text-white
                    mb-3
                ">
                    AI Sprint Planning
                </h3>


                <p className="
                    text-gray-400
                    text-sm
                    leading-6
                ">
                    Use AI-powered sprint planning assistance
                    to organize defects and support more
                    efficient sprint management.
                </p>


                <div className="
                    mt-6
                    text-xs
                    font-semibold
                    text-pink-400
                    uppercase
                    tracking-wider
                ">
                    Intelligent Planning
                </div>

            </div>

        </div>



        {/* AI INTELLIGENCE FOOTER */}

        <div className="
            mt-16
            flex
            flex-col
            md:flex-row
            items-center
            justify-center
            gap-4
            text-center
        ">

            <div className="
                flex
                items-center
                gap-3
                px-5
                py-3
                rounded-full
                bg-purple-500/10
                border
                border-purple-400/20
            ">

                <span className="
                    w-2
                    h-2
                    rounded-full
                    bg-purple-400
                    shadow-[0_0_12px_rgba(168,85,247,0.8)]
                ">
                </span>

                <span className="
                    text-purple-300
                    text-sm
                    font-semibold
                ">
                    AI Intelligence Layer
                </span>

            </div>


            <span className="
                hidden
                md:block
                text-gray-600
            ">
                •
            </span>


            <p className="
                text-gray-500
                text-sm
            ">
                Supporting faster investigation, resolution
                and software quality.
            </p>

        </div>

    </div>

</section>
{/* DEFECT LIFECYCLE */}

<section
    className="
        relative
        py-24
        px-8
        bg-[#070B18]
        overflow-hidden
    "
>

    <div className="max-w-7xl mx-auto">

        {/* SECTION HEADING */}

        <div className="text-center mb-16">

            <p className="
                text-blue-400
                font-semibold
                text-sm
                uppercase
                tracking-[0.25em]
                mb-4
            ">
                Defect Lifecycle
            </p>

            <h2 className="
                text-4xl
                md:text-5xl
                font-bold
                text-white
            ">
                From Report to Resolution
            </h2>

            <p className="
                mt-5
                text-gray-400
                text-lg
                max-w-2xl
                mx-auto
            ">
                Track every defect through a structured workflow
                until it is resolved, verified and closed.
            </p>

        </div>


        {/* LIFECYCLE CARDS */}

        <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-3
            gap-6
        ">


            {/* STEP 01 — REPORTED */}

            <div className="
                group
                relative
                bg-slate-900/90
                border
                border-slate-800
                rounded-2xl
                p-7
                transition-all
                duration-300
                hover:-translate-y-2
                hover:border-blue-400/40
                hover:shadow-[0_20px_40px_rgba(59,130,246,0.10)]
            ">

                <div className="
                    w-12
                    h-12
                    rounded-xl
                    bg-blue-500/10
                    border
                    border-blue-400/20
                    flex
                    items-center
                    justify-center
                    text-xl
                    mb-5
                ">
                    📝
                </div>

                <p className="
                    text-xs
                    font-bold
                    text-blue-400
                    uppercase
                    tracking-wider
                    mb-2
                ">
                    Step 01
                </p>

                <h3 className="
                    text-xl
                    font-bold
                    text-white
                    mb-3
                ">
                    Reported
                </h3>

                <p className="
                    text-sm
                    leading-6
                    text-gray-400
                ">
                    A tester reports a new software defect with
                    relevant details, priority and severity.
                </p>

            </div>


            {/* STEP 02 — ASSIGNED */}

            <div className="
                group
                relative
                bg-slate-900/90
                border
                border-slate-800
                rounded-2xl
                p-7
                transition-all
                duration-300
                hover:-translate-y-2
                hover:border-purple-400/40
                hover:shadow-[0_20px_40px_rgba(168,85,247,0.10)]
            ">

                <div className="
                    w-12
                    h-12
                    rounded-xl
                    bg-purple-500/10
                    border
                    border-purple-400/20
                    flex
                    items-center
                    justify-center
                    text-xl
                    mb-5
                ">
                    👤
                </div>

                <p className="
                    text-xs
                    font-bold
                    text-purple-400
                    uppercase
                    tracking-wider
                    mb-2
                ">
                    Step 02
                </p>

                <h3 className="
                    text-xl
                    font-bold
                    text-white
                    mb-3
                ">
                    Assigned
                </h3>

                <p className="
                    text-sm
                    leading-6
                    text-gray-400
                ">
                    The defect is assigned to the appropriate
                    developer for investigation and resolution.
                </p>

            </div>


            {/* STEP 03 — IN PROGRESS */}

            <div className="
                group
                relative
                bg-slate-900/90
                border
                border-slate-800
                rounded-2xl
                p-7
                transition-all
                duration-300
                hover:-translate-y-2
                hover:border-orange-400/40
                hover:shadow-[0_20px_40px_rgba(251,146,60,0.10)]
            ">

                <div className="
                    w-12
                    h-12
                    rounded-xl
                    bg-orange-500/10
                    border
                    border-orange-400/20
                    flex
                    items-center
                    justify-center
                    text-xl
                    mb-5
                ">
                    ⚙️
                </div>

                <p className="
                    text-xs
                    font-bold
                    text-orange-400
                    uppercase
                    tracking-wider
                    mb-2
                ">
                    Step 03
                </p>

                <h3 className="
                    text-xl
                    font-bold
                    text-white
                    mb-3
                ">
                    In Progress
                </h3>

                <p className="
                    text-sm
                    leading-6
                    text-gray-400
                ">
                    Developers investigate the issue, use AI
                    assistance and work towards a solution.
                </p>

            </div>


            {/* STEP 04 — RESOLVED */}

            <div className="
                group
                relative
                bg-slate-900/90
                border
                border-slate-800
                rounded-2xl
                p-7
                transition-all
                duration-300
                hover:-translate-y-2
                hover:border-emerald-400/40
                hover:shadow-[0_20px_40px_rgba(52,211,153,0.10)]
            ">

                <div className="
                    w-12
                    h-12
                    rounded-xl
                    bg-emerald-500/10
                    border
                    border-emerald-400/20
                    flex
                    items-center
                    justify-center
                    text-xl
                    mb-5
                ">
                    🛠️
                </div>

                <p className="
                    text-xs
                    font-bold
                    text-emerald-400
                    uppercase
                    tracking-wider
                    mb-2
                ">
                    Step 04
                </p>

                <h3 className="
                    text-xl
                    font-bold
                    text-white
                    mb-3
                ">
                    Resolved
                </h3>

                <p className="
                    text-sm
                    leading-6
                    text-gray-400
                ">
                    The developer applies a solution and marks
                    the defect as resolved for validation.
                </p>

            </div>


            {/* STEP 05 — VERIFIED */}

            <div className="
                group
                relative
                bg-slate-900/90
                border
                border-slate-800
                rounded-2xl
                p-7
                transition-all
                duration-300
                hover:-translate-y-2
                hover:border-cyan-400/40
                hover:shadow-[0_20px_40px_rgba(34,211,238,0.10)]
            ">

                <div className="
                    w-12
                    h-12
                    rounded-xl
                    bg-cyan-500/10
                    border
                    border-cyan-400/20
                    flex
                    items-center
                    justify-center
                    text-xl
                    mb-5
                ">
                    🔍
                </div>

                <p className="
                    text-xs
                    font-bold
                    text-cyan-400
                    uppercase
                    tracking-wider
                    mb-2
                ">
                    Step 05
                </p>

                <h3 className="
                    text-xl
                    font-bold
                    text-white
                    mb-3
                ">
                    Verified
                </h3>

                <p className="
                    text-sm
                    leading-6
                    text-gray-400
                ">
                    The tester validates the fix and confirms
                    that the reported issue has been addressed.
                </p>

            </div>


            {/* STEP 06 — CLOSED */}

            <div className="
                group
                relative
                bg-slate-900/90
                border
                border-slate-800
                rounded-2xl
                p-7
                transition-all
                duration-300
                hover:-translate-y-2
                hover:border-pink-400/40
                hover:shadow-[0_20px_40px_rgba(236,72,153,0.10)]
            ">

                <div className="
                    w-12
                    h-12
                    rounded-xl
                    bg-pink-500/10
                    border
                    border-pink-400/20
                    flex
                    items-center
                    justify-center
                    text-xl
                    mb-5
                ">
                    ✅
                </div>

                <p className="
                    text-xs
                    font-bold
                    text-pink-400
                    uppercase
                    tracking-wider
                    mb-2
                ">
                    Step 06
                </p>

                <h3 className="
                    text-xl
                    font-bold
                    text-white
                    mb-3
                ">
                    Closed
                </h3>

                <p className="
                    text-sm
                    leading-6
                    text-gray-400
                ">
                    Once verification is successful, the defect
                    is closed and the lifecycle is completed.
                </p>

            </div>

        </div>


        {/* WORKFLOW LINE */}

        <div className="
            mt-14
            flex
            flex-wrap
            items-center
            justify-center
            gap-3
            text-sm
            font-semibold
        ">

            <span className="text-blue-400">
                Reported
            </span>

            <span className="text-slate-600">
                →
            </span>

            <span className="text-purple-400">
                Assigned
            </span>

            <span className="text-slate-600">
                →
            </span>

            <span className="text-orange-400">
                In Progress
            </span>

            <span className="text-slate-600">
                →
            </span>

            <span className="text-emerald-400">
                Resolved
            </span>

            <span className="text-slate-600">
                →
            </span>

            <span className="text-cyan-400">
                Verified
            </span>

            <span className="text-slate-600">
                →
            </span>

            <span className="text-pink-400">
                Closed
            </span>

        </div>

    </div>

</section>
{/* DASHBOARD & ANALYTICS PREVIEW */}

<section
    className="
        relative
        py-24
        px-8
        bg-[#070B18]
        overflow-hidden
    "
>

    <div className="max-w-7xl mx-auto">

        {/* SECTION HEADING */}

        <div className="text-center mb-16">

            <p className="
                text-purple-400
                font-semibold
                text-sm
                uppercase
                tracking-[0.25em]
                mb-4
            ">
                Dashboard & Analytics
            </p>

            <h2 className="
                text-4xl
                md:text-5xl
                font-bold
                text-white
            ">
                Understand Your Defects at a Glance
            </h2>

            <p className="
                mt-5
                text-gray-400
                text-lg
                max-w-2xl
                mx-auto
            ">
                Monitor defect activity, priorities and resolution
                progress through a centralized project dashboard.
            </p>

        </div>


        {/* DASHBOARD PREVIEW */}

        <div className="
            relative
            bg-slate-900
            border
            border-slate-800
            rounded-3xl
            shadow-2xl
            p-6
            md:p-8
        ">

            {/* DASHBOARD HEADER */}

            <div className="
                flex
                flex-col
                md:flex-row
                md:items-center
                md:justify-between
                gap-4
                mb-8
            ">

                <div>

                    <p className="
                        text-sm
                        text-gray-400
                        mb-1
                    ">
                        Project Overview
                    </p>

                    <h3 className="
                        text-2xl
                        font-bold
                        text-white
                    ">
                        Defect Analytics
                    </h3>

                </div>


                <div className="
                    inline-flex
                    items-center
                    gap-2
                    px-4
                    py-2
                    rounded-full
                    bg-emerald-500/10
                    border
                    border-emerald-400/20
                    text-emerald-400
                    text-sm
                    font-semibold
                ">

                    <span className="
                        w-2
                        h-2
                        rounded-full
                        bg-emerald-400
                    ">
                    </span>

                    System Active

                </div>

            </div>


            {/* STAT CARDS */}

            <div className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-4
                gap-5
                mb-8
            ">


                {/* TOTAL BUGS */}

                <div className="
                    rounded-2xl
                    bg-blue-500/10
                    border
                    border-blue-400/20
                    p-5
                ">

                    <p className="
                        text-sm
                        text-gray-400
                    ">
                        Total Bugs
                    </p>

                    <p className="
                        text-3xl
                        font-bold
                        text-blue-400
                        mt-2
                    ">
                        24
                    </p>

                    <p className="
                        text-xs
                        text-gray-500
                        mt-2
                    ">
                        Across all projects
                    </p>

                </div>


                {/* OPEN BUGS */}

                <div className="
                    rounded-2xl
                    bg-orange-500/10
                    border
                    border-orange-400/20
                    p-5
                ">

                    <p className="
                        text-sm
                        text-gray-400
                    ">
                        Open Bugs
                    </p>

                    <p className="
                        text-3xl
                        font-bold
                        text-orange-400
                        mt-2
                    ">
                        8
                    </p>

                    <p className="
                        text-xs
                        text-gray-500
                        mt-2
                    ">
                        Need attention
                    </p>

                </div>


                {/* RESOLVED */}

                <div className="
                    rounded-2xl
                    bg-emerald-500/10
                    border
                    border-emerald-400/20
                    p-5
                ">

                    <p className="
                        text-sm
                        text-gray-400
                    ">
                        Resolved
                    </p>

                    <p className="
                        text-3xl
                        font-bold
                        text-emerald-400
                        mt-2
                    ">
                        16
                    </p>

                    <p className="
                        text-xs
                        text-gray-500
                        mt-2
                    ">
                        Successfully resolved
                    </p>

                </div>


                {/* HIGH PRIORITY */}

                <div className="
                    rounded-2xl
                    bg-red-500/10
                    border
                    border-red-400/20
                    p-5
                ">

                    <p className="
                        text-sm
                        text-gray-400
                    ">
                        High Priority
                    </p>

                    <p className="
                        text-3xl
                        font-bold
                        text-red-400
                        mt-2
                    ">
                        3
                    </p>

                    <p className="
                        text-xs
                        text-gray-500
                        mt-2
                    ">
                        Require attention
                    </p>

                </div>

            </div>


            {/* ANALYTICS AREA */}

            <div className="
                grid
                grid-cols-1
                lg:grid-cols-2
                gap-6
            ">


                {/* DEFECT STATUS */}

                <div className="
                    rounded-2xl
                    border
                    border-slate-800
                    bg-slate-950/40
                    p-6
                ">

                    <div className="mb-6">

                        <h4 className="
                            text-lg
                            font-bold
                            text-white
                        ">
                            Defect Status
                        </h4>

                        <p className="
                            text-sm
                            text-gray-500
                            mt-1
                        ">
                            Current distribution of reported defects
                        </p>

                    </div>


                    <div className="space-y-5">


                        {/* REPORTED */}

                        <div>

                            <div className="
                                flex
                                justify-between
                                text-sm
                                mb-2
                            ">

                                <span className="text-gray-400">
                                    Reported
                                </span>

                                <span className="
                                    font-semibold
                                    text-white
                                ">
                                    4
                                </span>

                            </div>

                            <div className="
                                h-2
                                bg-slate-800
                                rounded-full
                                overflow-hidden
                            ">

                                <div className="
                                    h-full
                                    w-[25%]
                                    bg-blue-500
                                    rounded-full
                                ">
                                </div>

                            </div>

                        </div>


                        {/* IN PROGRESS */}

                        <div>

                            <div className="
                                flex
                                justify-between
                                text-sm
                                mb-2
                            ">

                                <span className="text-gray-400">
                                    In Progress
                                </span>

                                <span className="
                                    font-semibold
                                    text-white
                                ">
                                    5
                                </span>

                            </div>

                            <div className="
                                h-2
                                bg-slate-800
                                rounded-full
                                overflow-hidden
                            ">

                                <div className="
                                    h-full
                                    w-[31%]
                                    bg-orange-500
                                    rounded-full
                                ">
                                </div>

                            </div>

                        </div>


                        {/* RESOLVED */}

                        <div>

                            <div className="
                                flex
                                justify-between
                                text-sm
                                mb-2
                            ">

                                <span className="text-gray-400">
                                    Resolved
                                </span>

                                <span className="
                                    font-semibold
                                    text-white
                                ">
                                    7
                                </span>

                            </div>

                            <div className="
                                h-2
                                bg-slate-800
                                rounded-full
                                overflow-hidden
                            ">

                                <div className="
                                    h-full
                                    w-[44%]
                                    bg-emerald-500
                                    rounded-full
                                ">
                                </div>

                            </div>

                        </div>


                        {/* VERIFIED */}

                        <div>

                            <div className="
                                flex
                                justify-between
                                text-sm
                                mb-2
                            ">

                                <span className="text-gray-400">
                                    Verified
                                </span>

                                <span className="
                                    font-semibold
                                    text-white
                                ">
                                    8
                                </span>

                            </div>

                            <div className="
                                h-2
                                bg-slate-800
                                rounded-full
                                overflow-hidden
                            ">

                                <div className="
                                    h-full
                                    w-[50%]
                                    bg-cyan-500
                                    rounded-full
                                ">
                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* PRIORITY OVERVIEW */}

                <div className="
                    rounded-2xl
                    border
                    border-slate-800
                    bg-slate-950/40
                    p-6
                ">

                    <div className="mb-6">

                        <h4 className="
                            text-lg
                            font-bold
                            text-white
                        ">
                            Priority Overview
                        </h4>

                        <p className="
                            text-sm
                            text-gray-500
                            mt-1
                        ">
                            Identify defects requiring immediate focus
                        </p>

                    </div>


                    <div className="
                        grid
                        grid-cols-2
                        gap-4
                    ">


                        {/* CRITICAL */}

                        <div className="
                            rounded-xl
                            bg-red-500/10
                            border
                            border-red-400/10
                            p-5
                            text-center
                        ">

                            <p className="
                                text-2xl
                                font-bold
                                text-red-400
                            ">
                                3
                            </p>

                            <p className="
                                text-sm
                                text-gray-400
                                mt-1
                            ">
                                Critical
                            </p>

                        </div>


                        {/* HIGH */}

                        <div className="
                            rounded-xl
                            bg-orange-500/10
                            border
                            border-orange-400/10
                            p-5
                            text-center
                        ">

                            <p className="
                                text-2xl
                                font-bold
                                text-orange-400
                            ">
                                6
                            </p>

                            <p className="
                                text-sm
                                text-gray-400
                                mt-1
                            ">
                                High
                            </p>

                        </div>


                        {/* MEDIUM */}

                        <div className="
                            rounded-xl
                            bg-yellow-500/10
                            border
                            border-yellow-400/10
                            p-5
                            text-center
                        ">

                            <p className="
                                text-2xl
                                font-bold
                                text-yellow-400
                            ">
                                9
                            </p>

                            <p className="
                                text-sm
                                text-gray-400
                                mt-1
                            ">
                                Medium
                            </p>

                        </div>


                        {/* LOW */}

                        <div className="
                            rounded-xl
                            bg-green-500/10
                            border
                            border-green-400/10
                            p-5
                            text-center
                        ">

                            <p className="
                                text-2xl
                                font-bold
                                text-green-400
                            ">
                                6
                            </p>

                            <p className="
                                text-sm
                                text-gray-400
                                mt-1
                            ">
                                Low
                            </p>

                        </div>

                    </div>

                </div>

            </div>


            {/* DASHBOARD NOTE */}

            <div className="
                mt-8
                flex
                flex-col
                md:flex-row
                items-center
                justify-between
                gap-4
                px-6
                py-5
                rounded-2xl
                bg-gradient-to-r
                from-blue-600
                to-purple-600
                text-white
            ">

                <div>

                    <p className="font-semibold">
                        Centralized defect visibility
                    </p>

                    <p className="
                        text-sm
                        text-blue-100
                        mt-1
                    ">
                        Track progress, monitor risk and understand
                        project health from one dashboard.
                    </p>

                </div>


                <div className="
                    px-4
                    py-2
                    rounded-lg
                    bg-white/10
                    border
                    border-white/20
                    text-sm
                    font-semibold
                    whitespace-nowrap
                ">
                    Real-Time Insights
                </div>

            </div>

        </div>

    </div>

</section>
<section className="
text-center
py-24
">


<h2 className="
text-5xl
font-bold
">

Ready to build better software?

</h2>



<p className="
text-gray-400
text-xl
mt-5
">

Start managing bugs intelligently with AI.

</p>




<Link

to="/register"

className="
inline-block
mt-8
px-10
py-4
rounded-xl
bg-purple-600
font-bold
hover:bg-purple-500
transition
"

>

Create Account

</Link>



</section>







</div>



<Footer/>


</>


);


}