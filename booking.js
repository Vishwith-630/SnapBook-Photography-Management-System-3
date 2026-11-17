(function (window) {
  "use strict";
  function all() { return SnapStorage.read("bookings", []); }
  function forUser(userId) { return all().filter(b => b.userId === userId); }
  function isSlotBooked(date, time) { return all().some(b => b.date === date && b.time === time && b.status === "Confirmed"); }
  function save(booking) {
    if (isSlotBooked(booking.date, booking.time)) return { ok:false, message:"Sorry, that slot was just booked. Please choose another slot." };
    const bookings = all();
    bookings.push(booking);
    if (!SnapStorage.write("bookings", bookings)) return { ok:false, message:"Could not save booking. Your browser storage may be full." };
    return { ok:true };
  }
  function cancel(id, userId) {
    const bookings = all();
    const item = bookings.find(b => b.id === id && b.userId === userId);
    if (!item) return { ok:false, message:"Booking not found." };
    if (item.status !== "Confirmed") return { ok:false, message:"This booking is already cancelled." };
    item.status = "Cancelled";
    item.cancelledAt = new Date().toISOString();
    SnapStorage.write("bookings", bookings);
    return { ok:true };
  }
  window.SnapBooking = { all, forUser, isSlotBooked, save, cancel };
})(window);
