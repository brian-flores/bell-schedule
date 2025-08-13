const schedule = [
    { period: "0 Period", start: "7:30 AM", end: "8:15 AM" },
    { period: "1 Period", start: "8:30 AM", end: "9:15 AM" },
    { period: "2 Period", start: "9:20 AM", end: "10:05 AM" },
    { period: "3 Period", start: "10:10 AM", end: "10:55 AM" },
    { period: "4 Period", start: "11:00 AM", end: "11:45 AM" },
    { period: "6 Period (A Lunch)", start: "11:50 AM", end: "12:50 PM" },
    { period: "7 Period", start: "12:55 PM", end: "1:40 PM" },
    { period: "8 Period", start: "1:45 PM", end: "2:30 PM" },
    { period: "9 Period", start: "2:35 PM", end: "3:20 PM" },
    { period: "10 Period", start: "3:25 PM", end: "4:10 PM" },
    { period: "11 Period", start: "4:15 PM", end: "5:00 PM" }
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
  
  updateCurrentTime();
  updateCountdown();
  displaySchedule();
  setInterval(updateCurrentTime, 1000);
  setInterval(updateCountdown, 1000);
  