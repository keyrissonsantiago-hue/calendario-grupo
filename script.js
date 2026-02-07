var firebaseConfig = {
  apiKey: "AIzaSyCsvwPkngkuo0hfKQ9_7WkstrVnlc84",
  authDomain: "calendario-amigos-681b3.firebaseapp.com",
  databaseURL: "https://calendario-amigos-681b3-default-rtdb.firebaseio.com",
  projectId: "calendario-amigos-681b3",
  storageBucket: "calendario-amigos-681b3.appspot.com",
  messagingSenderId: "1052367743336",
  appId: "1:1052367743336:web:cdd61216a9db0a11ec4dd"
};

// INICIALIZA FIREBASE
firebase.initializeApp(firebaseConfig);
var database = firebase.database();

// ID ÚNICO POR PESSOA (salvo no navegador)
let userId = localStorage.getItem("userId");
if (!userId) {
  userId = "user_" + Math.random().toString(36).substr(2, 9);
  localStorage.setItem("userId", userId);
}

// CALENDÁRIO
const calendar = document.getElementById("calendar");

// fevereiro do ano atual
const year = new Date().getFullYear();
const month = 1; // fevereiro (0 = janeiro)
const daysInMonth = new Date(year, month + 1, 0).getDate();



for (let i = 1; i <= daysInMonth; i++) {
  const day = document.createElement("div");
  day.classList.add("day");

  const number = document.createElement("div");
  number.innerText = i;

  const count = document.createElement("div");
  count.style.fontSize = "11px";
  count.style.marginTop = "4px";

  day.appendChild(number);
  day.appendChild(count);
  calendar.appendChild(day);

  // 🔹 verificar se é fim de semana
  const date = new Date(year, month, i);
  const weekDay = date.getDay(); // 0 = domingo, 6 = sábado

  if (weekDay === 0 || weekDay === 6) {
    day.classList.add("weekend");
  }

  const dayRef = database.ref("dias/" + i);

  day.onclick = () => {
    dayRef.child(userId).once("value", snapshot => {
      if (snapshot.exists()) {
        dayRef.child(userId).remove();
      } else {
        dayRef.child(userId).set(true);
      }
    });
  };

  dayRef.on("value", snapshot => {
    const data = snapshot.val() || {};
    const total = Object.keys(data).length;

    count.innerText = total + " pessoa(s)";

    if (data[userId]) {
      day.classList.add("marked");
    } else {
      day.classList.remove("marked");
    }
  });
}