let allIssues=[]
const container=document.getElementById("issuesContainer")

async function loadIssues(){

showSpinner()

const res=await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
const data=await res.json()

allIssues=data.data

updateCounts(allIssues)

displayIssues(allIssues)

}

function displayIssues(issues){

container.innerHTML=""

issues.forEach(issue=>{

const border =
issue.status==="open"
? "border-green-500"
: "border-purple-500"

const priorityColor =
issue.priority==="high"
? "bg-green-100 text-green-600"
: issue.priority==="medium"
? "bg-green-100 text-green-600"
: "bg-gray-200 text-gray-500"

const statusColor =
issue.status === "open"
? "bg-green-500"
: "bg-purple-500"

const labels = issue.labels || []

const labelHTML = labels.map(label=>{

let color="bg-gray-100 text-gray-600"

if(label==="bug"){
color="bg-red-100 text-red-500"
}

if(label==="help wanted"){
color="bg-orange-100 text-orange-500"
}

if(label==="enhancement"){
color="bg-green-100 text-green-600"
}

return `<span class="text-[10px] px-2 py-1 rounded-full ${color}">
${label.toUpperCase()}
</span>`

}).join("")

const card = `
<div onclick="loadSingleIssue(${issue.id})"
class="bg-white border rounded-xl p-4 border-t-4 ${border} shadow-sm hover:shadow-md transition cursor-pointer flex flex-col gap-3">

<div class="flex justify-between items-center">

<div class="flex items-center gap-2">

<div class="w-2.5 h-2.5 rounded-full ${statusColor}"></div>

<span class="text-xs px-2 py-1 rounded-full font-semibold ${priorityColor}">
${issue.priority.toUpperCase()}
</span>

</div>

</div>

<h3 class="font-semibold text-gray-800 text-sm">
${issue.title}
</h3>

<p class="text-xs text-gray-500">
${issue.description}
</p>

<div class="flex gap-2 flex-wrap">
${labelHTML}
</div>

<div class="text-[11px] text-gray-400">
#${issue.id} by ${issue.author}
</div>

<div class="text-[11px] text-gray-400">
${issue.createdAt}
</div>

</div>
`

container.innerHTML+=card

})

}
function updateCounts(issues){

const total = issues.length

const open =
issues.filter(i => i.status === "open").length

const closed =
issues.filter(i => i.status === "closed").length

document.getElementById("issueCount").innerText = total


}

function filterIssues(type){

if(type === "all"){

displayIssues(allIssues)
updateCounts(allIssues)

}

if(type === "open"){

const openIssues =
allIssues.filter(i => i.status === "open")

displayIssues(openIssues)
updateCounts(openIssues)

}

if(type === "closed"){

const closedIssues =
allIssues.filter(i => i.status === "closed")

displayIssues(closedIssues)
updateCounts(closedIssues)

}

}

function setActive(btn){

document.querySelectorAll(".tab")
.forEach(tab=>{

tab.classList.remove("bg-purple-600","text-white")
tab.classList.add("bg-gray-200")

})

btn.classList.remove("bg-gray-200")
btn.classList.add("bg-purple-600","text-white")

}



function closeModal(){

document.getElementById("modal")
.classList.add("hidden")

}

function showSpinner(){

container.innerHTML=`

<div class="col-span-4 flex justify-center py-10">

<div class="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>

</div>

`

}

document.getElementById("searchInput")
.addEventListener("keyup",function(e){

const text=e.target.value

if(text===""){
loadIssues()
}else{
searchIssues(text)
}

})

async function searchIssues(text){

showSpinner()

const res=await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`)
const data=await res.json()

displayIssues(data.data)

}

loadIssues()
