const logoutUrl = "/admin/login"

function resetTimer() {
  let obj_date = new Date();
  let miliseconds = obj_date.getTime(); // Returns the number of miliseconds since 1970/01/01
  localStorage.setItem("idle_time",miliseconds); 
}

function check_if_session_expired() {
  let max_idle_minutes=5;
  let obj_date = new Date();
  let miliseconds_now = obj_date.getTime();
  let get_idle_time_in_miliseconds = localStorage.getItem("idle_time");
  let one_minute_to_milisecond = 1000 * 60;
  let time_spent_idle = ((miliseconds_now - get_idle_time_in_miliseconds) / one_minute_to_milisecond)
  console.log('time spent idle: ' + time_spent_idle)
  if ( time_spent_idle >= max_idle_minutes) {
    console.log("expired");
    //end the session and redirect the user to logout page
    window.location.href = logoutUrl;
  } 
}

setInterval(check_if_session_expired, 5000);

window.onload = resetTimer;
document.onmousemove = resetTimer;
document.onkeydown = resetTimer;
document.onclick = resetTimer;
document.onscroll = resetTimer;