// ======================
// FIREBASE CONFIG
// ======================
var firebaseConfig = {
  apiKey: "AIzaSyCsvwPkngkuo0hfKQ9_7WkstrVnlc84",
  authDomain: "calendario-amigos-681b3.firebaseapp.com",
  databaseURL: "https://calendario-amigos-681b3-default-rtdb.firebaseio.com",
  projectId: "calendario-amigos-681b3",
  storageBucket: "calendario-amigos-681b3.appspot.com",
  messagingSenderId: "1052367743336",
  appId: "1:1052367743336:web:cdd61216a9db0a11ec4dd"
};

// ======================
// INICIAR FIREBASE
// ======================
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const database = firebase.database();

// ======================
// ID ÚNICO DO USUÁRIO
// ======================
let userId = localStorage.getItem("userId");

if (!userId) {
  userId = "user_" + Math.random().toString(36).substr(2, 9);
  localStorage.setItem("userId", userId);
}

// ======================
// CONFIGURAÇÃO CALENDÁRIO
// ======================
const calendar = document.getElementById("calendar");

const year = 2026;
const month = 4; // Maio (0 = Janeiro)
const monthName = "maio_2026";

// Primeiro dia do mês
const firstDay = new Date(year, month, 1).getDay();

// Total de dias
const daysInMonth = new Date(year, month + 1, 0).getDate();

// Limpar calendário
calendar.innerHTML = "";

// ======================
// ESPAÇOS VAZIOS INICIAIS
// ======================
// Como vamos começar no dia 10,
// pegamos o dia da semana do dia 10
const firstVisibleDay = new Date(year, month, 10).getDay();

for (let i = 0; i < firstVisibleDay; i++) {
  const empty = document.createElement("div");
  empty.classList.add("empty");
  calendar.appendChild(empty);
}

// ======================
// GERAR DIAS (10 até 31)
// ======================
for (let dayNumber = 10; dayNumber <= daysInMonth; dayNumber++) {

  const day = document.createElement("div");
  day.classList.add("day");

  const number = document.createElement("div");
  number.classList.add("number");
  number.innerText = dayNumber;

  const count = document.createElement("div");
  count.classList.add("count");
  count.innerText = "0 pessoa(s)";

  day.appendChild(number);
  day.appendChild(count);
  calendar.appendChild(day);

  // Firebase referência
  const dayRef = database.ref(monthName + "/" + dayNumber);

  // Clique marcar/desmarcar
  day.onclick = () => {
    dayRef.child(userId).once("value", snapshot => {

      if (snapshot.exists()) {
        dayRef.child(userId).remove();
      } else {
        dayRef.child(userId).set(true);
      }

    });
  };

  // Atualização em tempo real
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