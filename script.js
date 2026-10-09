const chatBox = document.getElementById('chatBox');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

// ⚠️ 这里填你 Vercel 后端的地址，注意末尾不要加 /
const API_URL = 'https://tea-backend-one.vercel.app';

async function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;

  addMessage(text, 'user');
  messageInput.value = '';
  sendBtn.disabled = true;

  const loadingId = addMessage('tea 正在思考...', 'assistant');

  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, sessionId: 1 })
    });

    const data = await response.json();
    document.getElementById(loadingId).querySelector('.message').textContent = data.reply || '出错了，没收到回复';
  } catch (error) {
    document.getElementById(loadingId).querySelector('.message').textContent = '网络错误，请检查后端是否在运行';
  } finally {
    sendBtn.disabled = false;
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}

function addMessage(text, role) {
  const row = document.createElement('div');
  row.className = `message-row ${role}`;

  const avatar = document.createElement('img');
  avatar.className = 'avatar';
  avatar.src = role === 'user' ? 'me.png' : 'tea.png';

  const bubble = document.createElement('div');
  bubble.className = `message ${role}`;
  bubble.textContent = text;

  if (role === 'user') {
    row.appendChild(bubble);
    row.appendChild(avatar);
  } else {
    row.appendChild(avatar);
    row.appendChild(bubble);
  }

  const id = 'msg-' + Date.now();
  row.id = id;
  chatBox.appendChild(row);
  chatBox.scrollTop = chatBox.scrollHeight;
  return id;
}

sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});