const schedule = [
  { period: "Zero Period (0)", start: "7:35 AM", end: "8:15 AM" },
  { period: "Warning Bell", start: "8:25 AM", end: "8:25 AM" },
  { period: "Period 1", start: "8:30 AM", end: "9:15 AM" },
  { period: "Period 2", start: "9:20 AM", end: "10:05 AM" },
  { period: "Period 3", start: "10:10 AM", end: "10:55 AM" },
  { period: "Period 4", start: "11:00 AM", end: "11:45 AM" },
  { period: "Lunch (First Lunch)", start: "11:45 AM", end: "12:26 PM" }, // First Lunch Schedule
  { period: "Advisory (First Lunch)", start: "12:26 PM", end: "12:56 PM" },
  { period: "Period 5", start: "1:00 PM", end: "1:45 PM" },
  { period: "Period 6", start: "1:50 PM", end: "2:35 PM" },
  { period: "Period 7", start: "2:40 PM", end: "3:25 PM" },
  { period: "Period 8", start: "3:30 PM", end: "4:15 PM" },
  { period: "Period 9", start: "4:20 PM", end: "5:05 PM" }, // Extended to match Eleventh Period
  { period: "Advisory (Second Lunch)", start: "11:49 AM", end: "12:19 PM" }, // Second Lunch Schedule
  { period: "Lunch (Second Lunch)", start: "12:19 PM", end: "1:00 PM" }
];

function formatTime(date) {
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

function updateCurrentTime() {
  const now = new Date();
  const options = { timeZone: "America/Denver", hour12: true };
  const timeStr = now.toLocaleTimeString("en-US", options);
  const dateStr = now.toLocaleDateString("en-US", { timeZone: "America/Denver", weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  document.getElementById("currentTime").innerText = timeStr;
  document.getElementById("currentDate").innerText = dateStr;
}

function getNextPeriod(now) {
  for (let i = 0; i < schedule.length; i++) {
      const period = schedule[i];
      const [startHour, startMinute, startPeriod] = parseTime(period.start);
      const startDate = new Date(now);
      startDate.setHours(convertTo24Hour(startHour, startPeriod), startMinute, 0);

      const [endHour, endMinute, endPeriod] = parseTime(period.end);
      const endDate = new Date(now);
      endDate.setHours(convertTo24Hour(endHour, endPeriod), endMinute, 0);

      if (now >= startDate && now < endDate) {
          return {
              current: period.period,
              ends: endDate,
              next: i < schedule.length - 1 ? schedule[i + 1].period : "End of Day"
          };
      }
  }
  return null;
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

function updateCountdown() {
  const now = new Date();
  const current = getNextPeriod(now);
  const countdownEl = document.getElementById("countdown");
  const statusEl = document.getElementById("periodStatus");

  if (current) {
      const diff = current.ends - now;
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      countdownEl.innerText = `${mins}m ${secs}s`;
      statusEl.innerText = `Current: ${current.current} → Next: ${current.next}`;
  } else {
      countdownEl.innerText = "";
      statusEl.innerText = "School is out!";
  }
}

function displaySchedule() {
  const display = document.getElementById("scheduleDisplay");
  display.innerHTML = "<h2>Today's Schedule</h2>";
  schedule.forEach(period => {
      display.innerHTML += `<div class="schedule-entry">${period.period}: ${period.start} - ${period.end}</div>`;
  });
}

update