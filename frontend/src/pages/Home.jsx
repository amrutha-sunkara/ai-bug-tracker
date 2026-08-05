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









{/* WORKFLOW */}



<section className="
py-20
bg-slate-900
">


<h2 className="
text-5xl
font-bold
text-center
mb-14
">

How It Works

</h2>





<div className="
flex
flex-col
md:flex-row
justify-center
gap-8
">


{


[

"Create Project",

"Report Bug",

"AI Improves Report",

"Track Resolution"

].map((item,index)=>(



<div

key={item}

className="
bg-slate-800
border
border-slate-700
rounded-2xl
p-8
w-64
text-center
hover:scale-105
transition
"

>


<div className="
text-cyan-400
text-4xl
font-bold
">

0{index+1}

</div>


<h3 className="
mt-4
font-bold
">

{item}

</h3>


</div>



))


}



</div>



</section>









{/* CTA */}



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