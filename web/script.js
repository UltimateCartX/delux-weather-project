document.addEventListener('DOMContentLoaded', () => {
  var now = new Date();
  var datetime = now.toLocaleString("fr-FR", { weekday: "long", month: "long", day: "2-digit" });

  document.getElementById("timeLabel").innerHTML = datetime.toUpperCase();
});
