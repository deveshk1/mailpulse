var gTimerId = undefined
export const HtmlLogger = {
  
  okHead(innerHTML){
    return `<h2 style='color:green'>${innerHTML}</h2>`
  },

  notOkHead(innerHTML){
    return `<h2 style='color:red'>${innerHTML}</h2>`
  },


  setOutput(output) {
    const statusElem = document.getElementById("output");
    statusElem.innerHTML = output
  },

  setStatus(status) {
    const statusElem = document.getElementById("status");
    statusElem.innerHTML = status
  },

  startTimer() {
    const timerDisplay = document.getElementById("timer");
    let startTime = Date.now();
    let timerId = setInterval(() => {
      const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
      timerDisplay.innerText = `${elapsedTime}s`;
    }, 10);
    gTimerId = timerId
    return timerId;
  },

  stopTimer(timerId) {
    clearInterval(timerId || gTimerId);
  },

  log(str, append) {
    const consoleElement = document.getElementById("console");

    if (consoleElement) {
      if (append) {
        consoleElement.value += str + "\n"; // Append the string
      } else {
        consoleElement.value = str + "\n"; // Replace the content
      }
    } else {
      console.error('Textarea with id="console" not found');
    }
  },
};
