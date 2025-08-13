const scheduleFirst = [
  { period: "Zero Period (0)", start: "7:35 AM", end: "8:15 AM" },
  { period: "Warning Bell", start: "8:25 AM", end: "8:25 AM" },
  { period: "Period 1", start: "8:30 AM", end: "9:15 AM" },
  { period: "Period 2", start: "9:20 AM", end: "10:05 AM" },
  { period: "Period 3", start: "10:10 AM", end: "10:55 AM" },
  { period: "Period 4", start: "11:00 AM", end: "11:45 AM" },
  { period: "Period 5 (Lunch & Advisory)", start: "11:45 AM", end: "12:56 PM" },
  { period: "Period 6", start: "1:00 PM", end: "1:45 PM" },
  { period: "Period 7", start: "1:50 PM", end: "2:35 PM" },
  { period: "Period 8", start: "2:40 PM", end: "3:25 PM" },
  { period: "Period 9", start: "3:30 PM", end: "4:15 PM" },
  { period: "Period 10", start: "4:20 PM", end: "5:05 PM" }
];

const scheduleSecond = [
  { period: "Zero Period (0)", start: "7:35 AM", end: "8:15 AM" },
  { period: "Warning Bell", start: "8:25 AM", end: "8:25 AM" },
  { period: "Period 1", start: "8:30 AM", end: "9:15 AM" },
  { period: "Period 2", start: "9:20 AM", end: "10:05 AM" },
  { period: "Period 3", start: "10:10 AM", end: "10:55 AM" },
  { period: "Period 4", start: "11:00 AM", end: "11:45 AM" },
  { period: "Period 5", start: "11:49 AM", end: "12:19 PM" },
  { period: "Period 6 (Advisory & Lunch)", start: "12:19 PM", end: "1:00 PM" },
  { period: "Period 7", start: "1:00 PM", end: "1:45 PM" },
  { period: "Period 8", start: "1:50 PM", end: "2:35 PM" },
  { period: "Period 9", start: "2:40 PM", end: "3:25 PM" },
  { period: "Period 10", start: "3:30 PM", end: "4:15 PM" }
];

function updateCurrentTime() {
  const now = new Date();
  const options = { timeZone: "America/Denver", hour12: true };
  const timeStr = now.toLocaleTimeString("en-US", options);
  const dateStr = now.toLocaleDateString("en-US", { timeZone: "America/Denver", weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  document.getElementById("currentTime").innerText = timeStr;
  document.getElementById("currentDate").innerText = dateStr;
}

function displaySchedule(schedule, elementId) {
  const display = document.getElementById(elementId);
  display.innerHTML = `<h2>${elementId === 'firstLunchSchedule' ? 'First Lunch Schedule' : 'Second Lunch Schedule'}</h2>`;
  schedule.forEach(period => {
      display.innerHTML += `<div class="schedule-entry">${period.period}: ${period.start} - ${period.end}</div>`;
  });
}

updateCurrentTime();
displaySchedule(scheduleFirst, "firstLunchSchedule");
displaySchedule(scheduleSecond, "secondLunchSchedule");
setInterval(updateCurrentTime, 1000);