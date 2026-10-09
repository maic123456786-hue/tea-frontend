const chatBox = document.getElementById('chatBox');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

const API_URL = 'https://tea-backend-one.vercel.app';

async function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;

  addMessage(text, 'user');
  messageInput.value = '';
  sendBtn.disabled = true;

  const loadingId = addMessage('小鲸鱼正在思考...', 'assistant');

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
  avatar.src = role === 'user' ? getUserAvatar() : getXiaoJingYuAvatar();

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

// ==== 换头像逻辑（支持换我 和 换小鲸鱼） ====
const avatarBtn = document.getElementById('avatarBtn');
const avatarMenu = document.getElementById('avatarMenu');
const avatarInput = document.createElement('input');
avatarInput.type = 'file';
avatarInput.accept = 'image/*';
let currentTarget = 'user';

avatarBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  avatarMenu.style.display = avatarMenu.style.display === 'block' ? 'none' : 'block';
});

document.addEventListener('click', () => {
  avatarMenu.style.display = 'none';
});

window.chooseAvatar = function(target) {
  currentTarget = target;
  avatarInput.click();
};

avatarInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    if (currentTarget === 'user') {
      localStorage.setItem('userAvatar', event.target.result);
      alert('你的头像换好啦！');
    } else {
      localStorage.setItem('xiaojingyuAvatar', event.target.result);
      alert('小鲸鱼的头像换好啦！');
    }
  };
  reader.readAsDataURL(file);
});

function getUserAvatar() {
  return localStorage.getItem('userAvatar') || 'me.png';
}
function getXiaoJingYuAvatar() {
  return localStorage.getItem('xiaojingyuAvatar') || 'xiaojingyu.png';
}
