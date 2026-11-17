(function (window) {
  "use strict";
  function getUsers() { return SnapStorage.read("customers", []); }
  function register(form) {
    const users = getUsers();
    const email = form.email.trim().toLowerCase();
    if (users.some(u => u.email === email)) return { ok:false, message:"An account with this email already exists. Please log in." };
    const user = { id:"CUS-" + Date.now(), name:form.name.trim(), email, phone:form.phone.trim(), password:form.password, createdAt:new Date().toISOString() };
    users.push(user);
    if (!SnapStorage.write("customers", users)) return { ok:false, message:"Could not save account. Check browser storage." };
    SnapStorage.write("currentUser", { id:user.id, name:user.name, email:user.email, phone:user.phone });
    return { ok:true, user };
  }
  function login(form) {
    const email = form.email.trim().toLowerCase();
    const user = getUsers().find(u => u.email === email && u.password === form.password);
    if (!user) return { ok:false, message:"Email or password is incorrect." };
    const safeUser = { id:user.id, name:user.name, email:user.email, phone:user.phone };
    SnapStorage.write("currentUser", safeUser);
    return { ok:true, user:safeUser };
  }
  function logout() { SnapStorage.remove("currentUser"); }
  function currentUser() { return SnapStorage.read("currentUser", null); }
  window.SnapAuth = { register, login, logout, currentUser };
})(window);
