(function () {
  "use strict";
  angular.module("snapBookApp", [])
    .filter("snapDate", function () {
      return function (value, format) {
        if (!value) return "";
        const d = new Date(value + "T00:00:00");
        if (isNaN(d.getTime())) return value;
        if (format === "dd MMM yyyy") return d.toLocaleDateString("en-IN", {day:"2-digit", month:"short", year:"numeric"});
        return d.toLocaleDateString("en-IN");
      };
    })
    .controller("MainController", ["$scope", "$timeout", function ($scope, $timeout) {
      const vm = this;
      vm.year = new Date().getFullYear();
      vm.user = SnapAuth.currentUser();
      vm.authOpen = false; vm.authMode = "login"; vm.authForm = {};
      vm.menuOpen = false; vm.step = 1; vm.saving = false;
      vm.galleryFilter = "All"; vm.toast = {show:false,message:""};
      vm.categories = ["Wedding","Portrait","Celebration","Lifestyle"];
      vm.styles = [
        {id:"wedding",name:"Wedding Stories",category:"Wedding",description:"The beautiful in-between moments.",image:"https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80"},
        {id:"prewedding",name:"Pre-wedding",category:"Wedding",description:"A little adventure before forever.",image:"https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80"},
        {id:"birthday",name:"Birthday Moments",category:"Celebration",description:"Big smiles, candles and confetti.",image:"https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80"},
        {id:"maternity",name:"Maternity",category:"Lifestyle",description:"A beautiful season of waiting.",image:"https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80"},
        {id:"portrait",name:"Portraits",category:"Portrait",description:"Your personality, in every frame.",image:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"},
        {id:"baby",name:"Baby & Family",category:"Lifestyle",description:"Little giggles and growing love.",image:"https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80"},
        {id:"events",name:"Event Coverage",category:"Celebration",description:"Every detail, every happy moment.",image:"https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80"},
        {id:"product",name:"Product Photography",category:"Portrait",description:"Make your brand stand out.",image:"https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80"},
        {id:"fashion",name:"Fashion Editorial",category:"Portrait",description:"Creative frames with character.",image:"https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80"}
      ];
      vm.packages = [
        {id:"basic",name:"Essential",price:3000,icon:"✧",description:"A lovely little session for life's sweet moments.",duration:"1 hour",features:["1-hour photoshoot","15 edited digital photos","Online gallery","1 location"]},
        {id:"standard",name:"Signature",price:6000,icon:"♡",featured:true,description:"A little more time to tell your whole story.",duration:"2 hours",features:["2-hour photoshoot","35 edited digital photos","Online gallery","2 outfit changes","Print-ready downloads"]},
        {id:"premium",name:"Keepsake",price:12000,icon:"✿",description:"The full experience, thoughtfully captured.",duration:"4 hours",features:["Up to 4-hour coverage","75 edited digital photos","Priority editing","Premium online gallery","Photo album consultation"]}
      ];
      vm.venues = [
        {id:"studio",name:"Studio",icon:"📸",description:"Our photography space"},
        {id:"home",name:"At home",icon:"🏡",description:"Your own comfortable space"},
        {id:"outdoor",name:"Outdoor",icon:"🌿",description:"A location you love"},
        {id:"event",name:"Event venue",icon:"🏛️",description:"Hall, resort or venue"},
        {id:"other",name:"Other",icon:"📍",description:"Somewhere special"}
      ];
      vm.paymentMethods = [{id:"upi",name:"UPI",icon:"📱"},{id:"card",name:"Card",icon:"💳"},{id:"cash",name:"Pay later",icon:"🤍"}];
      vm.steps = [{id:1,name:"Style"},{id:2,name:"Package"},{id:3,name:"Date"},{id:4,name:"Venue"},{id:5,name:"Ideas"},{id:6,name:"Review"},{id:7,name:"Pay"},{id:8,name:"Done"}];
      vm.weekdays = ["Su","Mo","Tu","We","Th","Fr","Sa"];
      vm.timeSlots = SnapCalendar.slots;
      vm.calendarView = new Date(); vm.calendarDays = [];
      vm.booking = {};
      vm.myBookings = vm.user ? SnapBooking.forUser(vm.user.id) : [];
      vm.lastBooking = null;
      vm.contact = {}; vm.review = {rating:5,message:""};
      vm.galleryMatch = function (item) { return vm.galleryFilter === "All" || item.category === vm.galleryFilter; };

      vm.resetBooking = function () {
        vm.booking = {styleId:"",packageId:"standard",date:"",time:"",venueType:"",venueName:"",venueAddress:"",mapLink:"",attachments:[],notes:"",paymentMethod:"upi",customPackage:""};
        vm.step = 1; vm.refreshCalendar();
      };
      vm.refreshCalendar = function () {
        vm.calendarDays = SnapCalendar.buildMonth(vm.calendarView.getFullYear(), vm.calendarView.getMonth(), SnapBooking.all());
      };
      vm.monthLabel = function () { return vm.calendarView.toLocaleDateString("en-IN",{month:"long",year:"numeric"}); };
      vm.isCurrentMonth = function () { const n=new Date(); return vm.calendarView.getFullYear()===n.getFullYear() && vm.calendarView.getMonth()===n.getMonth(); };
      vm.changeMonth = function (delta) { vm.calendarView = new Date(vm.calendarView.getFullYear(),vm.calendarView.getMonth()+delta,1); vm.refreshCalendar(); };
      vm.selectDate = function (date) { vm.booking.date=date; vm.booking.time=""; };
      vm.isSlotBooked = function (date,slot) { return !date || SnapBooking.isSlotBooked(date,slot); };
      vm.selectedStyle = function () { return vm.styles.find(s=>s.id===vm.booking.styleId) || {name:"Not selected"}; };
      vm.selectedPackage = function () { return vm.packages.find(p=>p.id===vm.booking.packageId) || {name:"Custom session",price:0}; };
      vm.selectedStyleSafe = function () { return vm.booking.styleId ? vm.selectedStyle().name : "Not selected"; };
      vm.selectedPackageSafe = function () { return vm.booking.packageId==="custom" ? "Custom session" : vm.selectedPackage().name; };
      vm.totalPrice = function () { return vm.booking.packageId==="custom" ? 0 : (vm.selectedPackage().price || 0); };
      vm.advanceAmount = function () { return SnapPayment.calculate(vm.totalPrice()).advance; };
      vm.balanceAmount = function () { return SnapPayment.calculate(vm.totalPrice()).balance; };
      vm.toastMessage = function (message) {
        vm.toast.message=message; vm.toast.show=true;
        $timeout(function(){vm.toast.show=false;},3000);
      };
      vm.openAuth = function (mode) { vm.authMode=mode; vm.authForm={}; vm.authOpen=true; };
      vm.closeAuth = function () { vm.authOpen=false; };
      vm.switchAuth = function () { vm.authMode=vm.authMode==="login"?"register":"login"; vm.authForm={}; };
      vm.submitAuth = function () {
        const result = vm.authMode==="login" ? SnapAuth.login(vm.authForm) : SnapAuth.register(vm.authForm);
        if (!result.ok) { vm.toastMessage(result.message); return; }
        vm.user=result.user; vm.myBookings=SnapBooking.forUser(vm.user.id); vm.authOpen=false; vm.authForm={};
        vm.toastMessage(vm.authMode==="login"?"Welcome back!":"Your account has been created. Welcome to SnapBook!");
      };
      vm.logout = function () { SnapAuth.logout(); vm.user=null; vm.myBookings=[]; vm.toastMessage("You have been logged out."); };
      vm.closeMenu = function () { vm.menuOpen=false; };
      vm.chooseStyle = function (style) { vm.booking.styleId=style.id; vm.step=1; document.querySelector("#booking").scrollIntoView({behavior:"smooth"}); };
      vm.choosePackage = function (pkg) { vm.booking.packageId=pkg.id; vm.step=2; document.querySelector("#booking").scrollIntoView({behavior:"smooth"}); };
      vm.requireLogin = function () { if (!vm.user) { vm.openAuth("login"); vm.toastMessage("Please log in or create an account to book."); return false; } return true; };
      vm.nextStep = function () {
        if (vm.step===1 && !vm.booking.styleId) return vm.toastMessage("Please choose a photography style.");
        if (vm.step===2 && vm.booking.packageId==="custom" && !vm.booking.customPackage.trim()) return vm.toastMessage("Please describe your custom session.");
        if (vm.step===3 && (!vm.booking.date || !vm.booking.time)) return vm.toastMessage("Please choose an available date and time slot.");
        if (vm.step===4 && (!vm.booking.venueType || !vm.booking.venueName.trim() || !vm.booking.venueAddress.trim())) return vm.toastMessage("Please select a venue type and enter its name and address.");
        if (vm.step===5) { if (!vm.requireLogin()) return; }
        if (vm.step<6) vm.step++;
        if (vm.step===3) vm.refreshCalendar();
      };
      vm.prevStep = function () { if(vm.step>1) vm.step--; };
      vm.goToPayment = function () {
        if (!vm.requireLogin()) return;
        if (vm.booking.packageId==="custom") { vm.toastMessage("Custom packages need a quote. Please choose a listed package for this demo checkout."); return; }
        vm.step=7;
      };
      vm.handleFiles = function (fileList) {
        const files=Array.from(fileList || []);
        if (vm.booking.attachments.length+files.length>3) return vm.toastMessage("You can attach up to 3 reference images.");
        files.forEach(file=>{
          if (!file.type.startsWith("image/")) return vm.toastMessage("Please choose image files only.");
          if (file.size>500*1024) return vm.toastMessage(file.name+" is larger than 500KB. Please resize it before uploading.");
          const reader=new FileReader();
          reader.onload=e=>$scope.$apply(()=>{vm.booking.attachments.push({name:file.name,data:e.target.result});});
          reader.readAsDataURL(file);
        });
      };
      vm.removeFile = function (index) { vm.booking.attachments.splice(index,1); };
      vm.confirmBooking = function () {
        if (!vm.requireLogin() || vm.saving) return;
        if (SnapBooking.isSlotBooked(vm.booking.date,vm.booking.time)) { vm.toastMessage("This slot is no longer available. Please choose another."); vm.step=3; vm.refreshCalendar(); return; }
        vm.saving=true;
        const style=vm.selectedStyle(), pkg=vm.selectedPackage(), amounts=SnapPayment.calculate(vm.totalPrice());
        const payment=SnapPayment.makePayment(amounts.advance,vm.booking.paymentMethod);
        const id="SB-"+new Date().getFullYear()+"-"+Math.random().toString(36).slice(2,8).toUpperCase();
        const booking={
          id,userId:vm.user.id,customerName:vm.user.name,customerEmail:vm.user.email,customerPhone:vm.user.phone,
          styleId:style.id,styleName:style.name,packageId:pkg.id,packageName:pkg.name,
          date:vm.booking.date,time:vm.booking.time,venueType:vm.booking.venueType,venueName:vm.booking.venueName,
          venueAddress:vm.booking.venueAddress,mapLink:vm.booking.mapLink,notes:vm.booking.notes,
          attachments:vm.booking.attachments,total:amounts.total,advance:amounts.advance,balance:amounts.balance,
          payment,paymentMethod:vm.booking.paymentMethod,status:"Confirmed",createdAt:new Date().toISOString()
        };
        const result=SnapBooking.save(booking);
        vm.saving=false;
        if (!result.ok) { vm.toastMessage(result.message); vm.step=3; vm.refreshCalendar(); return; }
        vm.lastBooking=booking; vm.myBookings=SnapBooking.forUser(vm.user.id); vm.step=8; vm.refreshCalendar();
        vm.toastMessage("Your photography session is confirmed!");
        $timeout(()=>document.querySelector("#booking").scrollIntoView({behavior:"smooth"}),100);
      };
      vm.canCancel = function (booking) { return new Date(booking.date+"T23:59:59").getTime()>Date.now(); };
      vm.cancelBooking = function (booking) {
        if (!window.confirm("Cancel booking "+booking.id+"? Its time slot will become available again.")) return;
        const result=SnapBooking.cancel(booking.id,vm.user.id);
        if(result.ok){vm.myBookings=SnapBooking.forUser(vm.user.id);vm.refreshCalendar();vm.toastMessage("Booking cancelled. The slot is now available.");}
        else vm.toastMessage(result.message);
      };
      vm.downloadReceipt = function (b) {
        const text=[
          "SNAPBOOK PHOTOGRAPHY — BOOKING RECEIPT","----------------------------------------",
          "Booking reference: "+b.id,"Customer: "+b.customerName,"Email: "+b.customerEmail,
          "Photography style: "+b.styleName,"Package: "+b.packageName,"Date: "+b.date,
          "Time: "+b.time,"Venue: "+b.venueName,"Address: "+b.venueAddress,
          "Package total: INR "+b.total,"Advance (demo): INR "+b.advance,"Balance: INR "+b.balance,
          "Payment method: "+b.paymentMethod,"Payment status: "+(b.payment?b.payment.status:"Not available"),
          "Booking status: "+b.status,"",
          "Note: This is a frontend demonstration receipt. No real payment was processed."
        ].join("\n");
        const blob=new Blob([text],{type:"text/plain"});
        const url=URL.createObjectURL(blob); const a=document.createElement("a");
        a.href=url;a.download="SnapBook-Receipt-"+b.id+".txt";document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
      };
      vm.sendMessage = function () {
        const messages=SnapStorage.read("messages",[]); messages.push({...vm.contact,createdAt:new Date().toISOString()});
        SnapStorage.write("messages",messages);vm.contact={};vm.toastMessage("Thanks! Your message has been saved in this browser.");
      };
      vm.submitReview = function () {
        const reviews=SnapStorage.read("reviews",[]);reviews.push({user:vm.user?vm.user.name:"Guest",rating:vm.review.rating,message:vm.review.message,createdAt:new Date().toISOString()});
        SnapStorage.write("reviews",reviews);vm.review={rating:5,message:""};vm.toastMessage("Thank you for sharing your feedback!");
      };
      vm.scrollTop = function () { window.scrollTo({top:0,behavior:"smooth"}); };
      vm.resetBooking();

      // jQuery is used for a small progressive enhancement: close the mobile menu after navigation.
      $(document).on("click", ".main-nav a", function () { $(".main-nav").removeClass("nav-open"); });
    }]);
})();
