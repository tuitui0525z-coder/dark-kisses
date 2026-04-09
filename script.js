let affinity = 0;
let sync = 3;
let candy = 1;

// 记录每种普通互动用了几次，防止无限刷
let actionCount = {
  聊天: 0,
  触碰: 0,
  靠近: 0
};

function getStatus() {
  if (affinity >= 20) return "依赖";
  if (affinity >= 10) return "动摇";
  return "警惕";
}

function updateUI() {
  document.getElementById("affinity").innerText = affinity;
  document.getElementById("sync").innerText = sync;
  document.getElementById("candy").innerText = candy;
  document.getElementById("status").innerText = getStatus();
}

function setDialogue(text) {
  document.getElementById("dialogueText").innerText = text;
}

function getRepeatReply(type) {
  const repeatMap = {
    聊天: "……你今天已经说得够多了。",
    触碰: "（他避开了你的手）",
    靠近: "别再靠近了。"
  };
  return repeatMap[type];
}

function doAction(type) {
  const status = getStatus();

  // 普通互动前两次有效，之后只给冷淡反馈
  if (type !== "喂糖" && actionCount[type] >= 2) {
    setDialogue(getRepeatReply(type));
    return;
  }

  if (type === "聊天") {
    affinity += 1;
    actionCount.聊天 += 1;
    setDialogue(STORY[status].聊天);
  }

  if (type === "触碰") {
    affinity += 2;
    sync += 1;
    actionCount.触碰 += 1;
    setDialogue(STORY[status].触碰);
  }

  if (type === "靠近") {
    affinity += 3;
    actionCount.靠近 += 1;
    setDialogue(STORY[status].靠近);
  }

  if (type === "喂糖") {
    if (candy <= 0) {
      setDialogue("你已经没有糖果了。");
      return;
    }

    candy -= 1;
    affinity += 4;
    sync += 2;

    // 喂糖可以缓和状态，重置一次普通互动次数
    actionCount.聊天 = Math.max(0, actionCount.聊天 - 1);
    actionCount.触碰 = Math.max(0, actionCount.触碰 - 1);
    actionCount.靠近 = Math.max(0, actionCount.靠近 - 1);

    setDialogue(STORY[status].喂糖);
  }

  updateUI();
}

function sendMessage() {
  const inputEl = document.getElementById("userInput");
  const input = inputEl.value.trim();
  if (!input) return;

  const status = getStatus();
  let reply = STORY[status].输入.默认;

  if (input.includes("为什么")) {
    reply = STORY[status].输入.为什么;
  } else if (input.includes("喜欢")) {
    reply = STORY[status].输入.喜欢;
  } else if (input.includes("冷")) {
    reply = STORY[status].输入.冷;
  } else if (input.includes("陪")) {
    reply = STORY[status].输入.陪;
  } else if (input.includes("名字")) {
    reply = STORY[status].输入.名字;
  }

  setDialogue(reply);
  inputEl.value = "";
  updateUI();
}

function bindEvents() {
  document.getElementById("talkBtn").addEventListener("click", () => doAction("聊天"));
  document.getElementById("touchBtn").addEventListener("click", () => doAction("触碰"));
  document.getElementById("approachBtn").addEventListener("click", () => doAction("靠近"));
  document.getElementById("candyBtn").addEventListener("click", () => doAction("喂糖"));
  document.getElementById("sendBtn").addEventListener("click", sendMessage);
}

function initGame() {
  setDialogue(`${STORY.初见[0]} ${STORY.初见[1]}`);
  updateUI();
  bindEvents();
}

initGame();
