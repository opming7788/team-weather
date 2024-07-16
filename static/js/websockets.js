const websocket = new WebSocket(`ws://${location.host}/ws`);

const clientsTotal = document.getElementById("client-total");
const messageContainer = document.getElementById("message-container");
const nameInput = document.getElementById("name-input");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");

messageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMessage();
});

websocket.onopen = () => {
  console.log("WebSocket connected");
};

websocket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === "clients-total") {
    clientsTotal.innerText = `Total Clients: ${data.total}`;
  } else if (data.type === "chat-message") {
    addMessageToUI(false, data.data);
  } else if (data.type === "feedback") {
    handleFeedback(data.data);
  }
};

function sendMessage() {
  if (messageInput.value === "") return;
  if (!checkName()) return;
  const data = {
    type: "chat-message",
    data: {
      name: nameInput.value,
      message: messageInput.value,
      dateTime: new Date(),
    }
  };
  websocket.send(JSON.stringify(data));
  addMessageToUI(true, data.data);
  messageInput.value = "";
}

function checkName() {
  if (nameInput.value.trim() === "" ||nameInput.value.trim() === "請輸入名字"){
    alert("要在框框上方輸入名字哦！");
    nameInput.focus();
    return false;
  }
  return true;
}

function addMessageToUI(isOwnMessage, data) {
  clearFeedback();
  const element = `
    <li class="${isOwnMessage ? "message__right" : "message__left"}">
      <span class="${isOwnMessage ? "message__right--name" : "message__left--name"}">
        ${data.name} 
      </span>
      <div class="${isOwnMessage ? "message__right--text" : "message__left--text"}">
        ${data.message}
      </div>
    </li>
  `;
  messageContainer.innerHTML += element;
  scrollToBottom();
}

function scrollToBottom() {
  messageContainer.scrollTo({
    top: messageContainer.scrollHeight,
    behavior: 'smooth'
  });
}

// 3 秒後沒有輸入狀態則清除
let typingTimer;
const TYPING_INTERVAL = 3000;

function sendThrottledFeedback(feedback){
  clearTimeout(typingTimer);
  typingTimer = setTimeout(()=>{
    sendFeedback(feedback);
  }, TYPING_INTERVAL);
}

messageInput.addEventListener("focus", (event) => {
  if (checkName()) {
    sendFeedback(`${nameInput.value} 正在輸入...`);
  }
});

messageInput.addEventListener("input", (event) => {
  sendThrottledFeedback(`${nameInput.value} 正在輸入...`);
});

messageInput.addEventListener("blur", (event) => {
  clearTimeout(typingTimer)
  sendFeedback("");
});

function sendFeedback(feedback) {
  websocket.send(JSON.stringify({
    type: "feedback",
    data: { feedback }
  }));
}

function handleFeedback(data) {
  clearFeedback();
  const element = `
    <li class="message-feedback">
      <p class="feedback">${data.feedback}</p>
    </li>
  `;
  messageContainer.innerHTML += element;
  scrollToBottom(); 
}

function clearFeedback() {
  document.querySelectorAll("li.message-feedback").forEach((element) => {
    element.parentNode.removeChild(element);
  });
}

websocket.onclose = () => {
  console.log("WebSocket disconnected");
};

websocket.onerror = (error) => {
  console.error("WebSocket error:", error);
};