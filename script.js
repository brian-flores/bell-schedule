const scheduleFirst = [
  { period: "Zero Period (0)", start: "7:30 AM", end: "8:15 AM" },
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
  { period: "Period 10", start: "3:30 PM", end: "4:15 PM" },
  { period: "Eleventh Period (11)", start: "4:20 PM", end: "5:05 PM" }
];

const scheduleSecond = [
  { period: "Zero Period (0)", start: "7:30 AM", end: "8:15 AM" },
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
  { period: "Period 10", start: "3:30 PM", end: "4:15 PM" },
  { period: "Eleventh Period (11)", start: "4:20 PM", end: "5:05 PM" }
];

const TRANSITION_MINUTES = 5; // 5-minute transition period

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

function getCurrentOrNextPeriod(now, schedule) {
  for (let i = 0; i < schedule.length; i++) {
      const period = schedule[i];
      const [startHour, startMinute, startPeriod] = parseTime(period.start);
      const startDate = new Date(now);
      startDate.setHours(convertTo24Hour(startHour, startPeriod), startMinute, 0, 0);

      const [endHour, endMinute, endPeriod] = parseTime(period.end);
      const endDate = new Date(now);
      endDate.setHours(convertTo24Hour(endHour, endPeriod), endMinute, 0, 0);

      if (now >= startDate && now < endDate) {
          return { current: period.period, index: i, endTime: endDate, isCurrent: true };
      }
      // Check for transition period (up to TRANSITION_MINUTES after end)
      if (i < schedule.length - 1) {
          const nextPeriod = schedule[i + 1];
          const [nextStartHour, nextStartMinute, nextStartPeriod] = parseTime(nextPeriod.start);
          const nextStartDate = new Date(now);
          nextStartDate.setHours(convertTo24Hour(nextStartHour, nextStartPeriod), nextStartMinute, 0, 0);
          const transitionEnd = new Date(endDate.getTime() + TRANSITION_MINUTES * 60000);
          if (now >= endDate && now < transitionEnd) {
              return { current: `Transition to ${nextPeriod.period}`, index: i, nextStartTime: nextStartDate, isTransition: true };
          }
      }
  }
  return null;
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
  if (!display) {
      console.error(`Element with ID ${elementId} not found`);
      return;
  }
  display.innerHTML = `<h2>${elementId === 'firstLunchSchedule' ? 'First Lunch Schedule' : 'Second Lunch Schedule'}</h2>`;
  const now = new Date();
  let currentPeriodIndex = -1;

  const current = getCurrentOrNextPeriod(now, schedule);
  if (current && (current.isCurrent || current.isTransition)) {
      currentPeriodIndex = current.index;
  }

  schedule.forEach((period, index) => {
      let classes = "schedule-entry";
      if (index === currentPeriodIndex) classes += " highlight";
      if (period.period === "Period 2") classes += " golden-period";
      const entry = `<div class="${classes}">${period.period}: ${period.start} - ${period.end}</div>`;
      display.innerHTML += entry;
  });
}

function updateCurrentPeriod() {
  const now = new Date();
  const currentPeriodFirst = getCurrentOrNextPeriod(now, scheduleFirst);
  const currentPeriodSecond = getCurrentOrNextPeriod(now, scheduleSecond);

  const currentPeriod = currentPeriodFirst || currentPeriodSecond;
  if (currentPeriod) {
      if (currentPeriod.isCurrent) {
          document.getElementById("currentPeriod").innerText = `Current period: ${currentPeriod.current}`;
      } else if (currentPeriod.isTransition) {
          document.getElementById("currentPeriod").innerText = `${currentPeriod.current}`;
      }
  } else {
      // Check if outside school hours (5:05 PM - 7:25 AM)
      const [endHour, endMinute] = parseTime("5:05 PM");
      const endSchool = new Date(now);
      endSchool.setHours(convertTo24Hour(endHour, "PM"), endMinute, 0, 0);
      const [startHour, startMinute] = parseTime("7:25 AM");
      const startSchool = new Date(now);
      startSchool.setHours(convertTo24Hour(startHour, "AM"), startMinute, 0, 0);
      if (now > endSchool || now < startSchool) {
          document.getElementById("currentPeriod").innerText = "Current period: School is out for the day";
      } else {
          document.getElementById("currentPeriod").innerText = "Current period: Transition";
      }
  }
}

function updateCountdown() {
  const now = new Date();
  const currentPeriodFirst = getCurrentOrNextPeriod(now, scheduleFirst);
  const currentPeriodSecond = getCurrentOrNextPeriod(now, scheduleSecond);
  const currentPeriod = currentPeriodFirst || currentPeriodSecond;

  if (currentPeriod) {
      if (currentPeriod.isCurrent) {
          const timeLeft = currentPeriod.endTime - now;
          if (timeLeft > 0) {
              const minutes = Math.floor(timeLeft / 60000);
              const seconds = Math.floor((timeLeft % 60000) / 1000);
              document.getElementById("countdown").innerText = `Time remaining: ${minutes}m ${seconds}s`;
          } else {
              document.getElementById("countdown").innerText = "Time remaining: 0m 0s";
          }
      } else if (currentPeriod.isTransition) {
          const timeLeft = currentPeriod.nextStartTime - now;
          if (timeLeft > 0) {
              const minutes = Math.floor(timeLeft / 60000);
              const seconds = Math.floor((timeLeft % 60000) / 1000);
              document.getElementById("countdown").innerText = `Time until next period: ${minutes}m ${seconds}s`;
          } else {
              document.getElementById("countdown").innerText = "Time until next period: 0m 0s";
          }
      }
  } else {
      document.getElementById("countdown").innerText = "Time remaining: N/A";
  }
}

function toggleDarkMode() {
  const body = document.body;
  body.classList.toggle('dark-mode');
  document.querySelector('.title').classList.toggle('dark-mode');
  document.querySelectorAll('.mode-switch, #currentTime, #currentDate, #currentPeriod, #countdown, .schedule-box, .schedule-entry, .highlight, .notes').forEach(element => {
      element.classList.toggle('dark-mode');
  });
}

updateCurrentTime();
displaySchedule(scheduleFirst, "firstLunchSchedule");
displaySchedule(scheduleSecond, "secondLunchSchedule");
updateCurrentPeriod();
updateCountdown();
setInterval(() => {
  updateCurrentTime();
  displaySchedule(scheduleFirst, "firstLunchSchedule");
  displaySchedule(scheduleSecond, "secondLunchSchedule");
  updateCurrentPeriod();
  updateCountdown();
}, 1000);