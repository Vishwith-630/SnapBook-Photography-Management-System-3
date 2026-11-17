(function (window) {
  "use strict";
  function calculate(total) {
    const advance = Math.round(total * 0.30);
    return { total, advance, balance:total-advance };
  }
  function makePayment(amount, method) {
    return {
      id:"PAY-" + Date.now(),
      amount,
      method,
      status:"Demo paid",
      paidAt:new Date().toISOString(),
      note:"Simulated payment. No money was transferred."
    };
  }
  window.SnapPayment = { calculate, makePayment };
})(window);
