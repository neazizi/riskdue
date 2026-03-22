if (Notification.permission !== "granted") {
    Notification.requestPermission();
}
let assignments = JSON.parse(localStorage.getItem("assignments")) || [];
function calculateRisk(hours, deadline) {
    const today = new Date();
    const due = new Date(deadline);

    const diffTime = due - today;
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const hoursPerDay = hours / daysLeft;

    let risk, cssClass;

    if (hoursPerDay < 1.5) {
        risk = "Low";
        cssClass = "low";
    } else if (hoursPerDay < 3) {
        risk = "Medium";
        cssClass = "medium";
    } else {
        risk = "High";
        cssClass = "high";
    }

    return { daysLeft, hoursPerDay, risk, cssClass };
}
function addAssignment(){
    const name = document.getElementById("name").value;
    const deadline = document.getElementById("deadline").value;
    const hours = parseFloat(document.getElementById("hours").value);

    if (!name || !deadline || !hours) {
        alert("Please fill all fields");
        return;
    }

    assignments.push({ name, deadline, hours });
    localStorage.setItem("assignments", JSON.stringify(assignments));

    location.reload();
}
   window.onload=function(){
    assignments.forEach((item, index)=>{
        displayAssignment(item, index);
    });
    checkReminders();
    updateDashboard();
};

function displayAssignment(item, index){
    const container=document.getElementById("results");

    const result=calculateRisk(item.hours, item.deadline);
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
        <h3>${item.name}</h3>
        <p>Days Left: ${result.daysLeft}</p>
        <p>Hours/Day: ${result.hoursPerDay.toFixed(2)}</p>
        <p class="${result.cssClass}">Risk: ${result.risk}</p>

        <button onclick="deleteAssignment(${index})">Delete</button>
        <button onclick="editAssignment(${index})">Edit</button>
         `;

    container.appendChild(card);

}

function deleteAssignment(index) {
    assignments.splice(index, 1);
    localStorage.setItem("assignments", JSON.stringify(assignments));
    location.reload();
}

function editAssignment(index) {
    const item = assignments[index];

    document.getElementById("name").value = item.name;
    document.getElementById("deadline").value = item.deadline;
    document.getElementById("hours").value = item.hours;

  
    assignments.splice(index, 1);
    localStorage.setItem("assignments", JSON.stringify(assignments));

    location.reload();
}

function checkReminders() {
    const today = new Date();

    assignments.forEach(item => {
        const due = new Date(item.deadline);

        const diffTime = due - today;
        const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (daysLeft === 1) {
            new Notification("Reminder!", {
                body: `${item.name} is due tomorrow!`
            });
        }
    });
} 
  function updateDashboard() {
    let total = assignments.length;
    let highRisk = 0;
    let totalHours = 0;

    assignments.forEach(item => {
        totalHours += item.hours;

        const result = calculateRisk(item.hours, item.deadline);
        if (result.risk === "High") {
            highRisk++;
        }
    });

    document.getElementById("totalTasks").innerText = total;
    document.getElementById("highRisk").innerText = highRisk;
    document.getElementById("totalHours").innerText = totalHours;
}