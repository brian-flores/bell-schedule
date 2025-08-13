const scheduleFirst = [
  { period: "Zero Period (0)", start: "7:35 AM", end: "8:15 AM" },
  { period: "Warning Bell", start: "8:25 AM", end: "8:25 AM" },
  { period: "Period 1", start: "8:30 AM", end: "9:15 AM" },
  { period: "Period 2", start: "9:20 AM", end: "10:05 AM" },
  { period: "Period 3", start: "10:10 AM", end: "10:55 AM" },
  { period: "Period 4", start: "11:00 AM", end: "11:45 AM" },
  { period: "Period 5 (Lunch)", start: "11:45 AM", end: "12:26 PM" },
  { period: "Period 6 (Advisory)", start: "12:26 PM", end: "12:56 PM" },
  { period: "Period 7", start: "1:00 PM", end: "1:45 PM" },
  { period: "Period 8", start: "1:50 PM", end: "2:35 PM" },
  { period: "Period 9", start: "2:40 PM", end: "3:25 PM" },
  { period: "Period 10", start: "3:30 PM", end: "4:15 PM" }
];

const scheduleSecond = [
  { period: "Zero Period (0)", start: "7:35 AM", end: "8:15 AM" },
  { period: "Warning Bell", start: "8:25 AM", end: "8:25 AM" },
  { period: "Period 1", start: "8:30 AM", end: "9:15 AM" },
  { period: "Period 2", start: "9:20 AM", end: "10:05 AM" },
  { period: "Period 3", start: "10:10 AM", end: "10:55 AM" },
  { period: "Period 4", start: "11:00 AM", end: "11:45 AM" },
  { period: "Period 5 (Advisory)", start: "11:49 AM", end: "12:19 PM" },
  { period: "Period 6 (Lunch)", start: "12:19 PM", end: "1:00 PM" },
  { period: "Period 7", start: "1:00 PM", end: "1:45 PM" },
  { period: "Period 8", start: "1:50 PM", end: "2:35 PM" },
  { period: "Period 9", start: "2:40 PM", end: "3:25 PM" },
  { period: "Period 10", start: "3:30 PM", end: "4:15 PM" }
];

function formatTime(date) {
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

function convertTo24Hour(hour, period) {
  if (period === "PM" && hour !== 12) return hour + 12;
  if (period === "AM" && hour === 12) return 0;
  return hour;
}

function parseTime(str) {
  const parts = str.match(/(\d+):(\d+)\s?(AM|PM)/);
  return [parseInt(parts[1]), parseInt(parts[2]), parts[3]];
}

function getCurrentPeriod(now, schedule) {
  for (let i = 0; i < schedule.length; i++) {
      const period = schedule[i];
      const [startHour, startMinute, startPeriod] = parseTime(period.start);
      const startDate = new Date(now);
      startDate.setHours(convertTo24Hour(startHour, startPeriod), startMinute, 0);

      const [endHour, endMinute, endPeriod] = parseTime(period.end);
      const endDate = new Date(now);
      endDate.setHours(convertTo24Hour(endHour, endPeriod), endMinute, 0);

      if (now >= startDate && now < endDate) {
          return { current: period.period, index: i };
      }
  }
  return null; // School is out if no period matches
}

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
  const now = new Date();
  let currentPeriodIndex = -1;

  // Check for current period in this schedule
  const current = getCurrentPeriod(now, schedule);
  if (current) {
      currentPeriodIndex = current.index;
  }

  schedule.forEach((period, index) => {
      const entry = `<div class="schedule-entry${index === currentPeriodIndex ? ' highlight' : ''}">${period.period}: ${period.start} - ${period.end}</div>`;
      display.innerHTML += entry;
  });
}

function updateCurrentPeriod() {
  const now = new Date();
  const currentPeriodFirst = getCurrentPeriod(now, scheduleFirst);
  const currentPeriodSecond = getCurrentPeriod(now, scheduleSecond);

  if (currentPeriodFirst || currentPeriodSecond) {
      document.getElementById("currentPeriod").innerText = `Current period: ${currentPeriodFirst ? currentPeriodFirst.current : currentPeriodSecond.current}`;
  } else {
      document.getElementById("currentPeriod").innerText = "Current period: School is out for the day";
  }
}

updateCurrentTime();
displaySchedule(scheduleFirst, "firstLunchSchedule");
displaySchedule(scheduleSecond, "secondLunchSchedule");
updateCurrentPeriod();
setInterval(() => {
  updateCurrentTime();
  displaySchedule(scheduleFirst, "firstLunchSchedule");
  displaySchedule(scheduleSecond, "secondLunchSchedule");
  updateCurrentPeriod();
}, 1000);