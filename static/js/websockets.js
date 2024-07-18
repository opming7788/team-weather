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
    handleFeedback(data);
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
    }
  };
  websocket.send(JSON.stringify(data));
  addMessageToUI(true, data.data);
  messageInput.value = "";

}

// checkName
let hasAlerted = false;

function checkName() {
  if (nameInput.value.trim() === "" || nameInput.value.trim() === "請輸入名字") {
    if (!hasAlerted) {
      alert("要在框框上方輸入名字哦！");
      hasAlerted = true;
      setTimeout(() => { hasAlerted = false; }, 1000); 
    }
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
    behavior: "smooth"
  });
}

// send feedback
function debounce(func, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}

function sendTypingStatus(isTyping) {
  if (checkName()) {
    websocket.send(JSON.stringify({
      type: "typing",
      data: {
        name: nameInput.value,
        isTyping: isTyping
      }
    }));
  }
}

let typingTimer;
const TYPING_TIMEOUT = 5000;
const debouncedSendTypingStatus = debounce(sendTypingStatus, 600);

function longDebounce(func, delay){
  clearTimeout(typingTimer);
  typingTimer = setTimeout(func, delay);
}

messageInput.addEventListener("focus", () => {
  if (checkName()) {
    sendTypingStatus(true);  
  }
});

messageInput.addEventListener("input", () => {
  debouncedSendTypingStatus(true);  
  longDebounce(() => sendTypingStatus(false), TYPING_TIMEOUT);
});

messageInput.addEventListener("blur", () => {
  sendTypingStatus(false);  
});



// handel feedback
function handleFeedback(data) {
  if (data.name !== nameInput.value) {
    clearFeedback();
    const element = `
      <li class="message-feedback">
        <p class="feedback">${data.data.feedback}</p>
      </li>
    `;
    messageContainer.innerHTML += element;
    scrollToBottom();
  }
}

function clearFeedback() {
  document.querySelectorAll("li.message-feedback").forEach((element) => {
    element.parentNode.removeChild(element);
  });
}

// 刷新時清除 feedback
window.addEventListener("beforeunload", () => {
  if (websocket.readyState === WebSocket.OPEN) {
    websocket.send(JSON.stringify({
      type: "typing",
      data: {
        name: nameInput.value,
        isTyping: false
      }
    }));
  }
});

websocket.onclose = () => {
  console.log("WebSocket disconnected");
};

websocket.onerror = (error) => {
  console.error("WebSocket error:", error);
};