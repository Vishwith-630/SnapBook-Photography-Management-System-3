(function (window) {
  "use strict";
  const slots = ["09:00 AM – 11:00 AM", "11:30 AM – 01:30 PM", "02:00 PM – 04:00 PM", "04:30 PM – 06:30 PM"];
  function dateKey(year, month, day) {
    return [year, String(month + 1).padStart(2,"0"), String(day).padStart(2,"0")].join("-");
  }
  function bookedFor(date, time, bookings) {
    return bookings.some(b => b.date === date && b.time === time && b.status === "Confirmed");
  }
  function buildMonth(year, month, bookings) {
    const first = new Date(year, month, 1);
    const total = new Date(year, month + 1, 0).getDate();
    const offset = first.getDay();
    const today = new Date(); today.setHours(0,0,0,0);
    const days = [];
    for (let i=0; i<offset; i++) days.push({ current:false, number:"", date:"" });
    for (let d=1; d<=total; d++) {
      const date = dateKey(year, month, d);
      const parsed = new Date(year, month, d); parsed.setHours(0,0,0,0);
      const allBooked = slots.every(slot => bookedFor(date, slot, bookings));
      days.push({ current:true, number:d, date, disabled:parsed < today, booked:allBooked, today:parsed.getTime()===today.getTime() });
    }
    while (days.length % 7 !== 0) days.push({ current:false, number:"", date:"" });
    return days;
  }
  window.SnapCalendar = { slots, buildMonth, bookedFor };
})(window);
