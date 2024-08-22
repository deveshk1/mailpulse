var gTimerId = undefined;
export const HtmlLogger = {
  okHead(innerHTML) {
    return `<h2 style='color:green'>${innerHTML}</h2>`;
  },

  notOkHead(innerHTML) {
    return `<h2 style='color:red'>${innerHTML}</h2>`;
  },

  extractJSONFromMarkdown(markdown) {
    if (!markdown.includes("`")) {
      return JSON.parse(markdown);
    }
    const regex = /```json([\s\S]*?)```/g;
    let match;
    const jsonArray = [];
    while ((match = regex.exec(markdown)) !== null) {
      try {
        const jsonString = match[1].trim();
        const jsonObject = JSON.parse(jsonString);
        jsonArray.push(jsonObject);
      } catch (e) {
        console.error("Error parsing JSON:", e);
      }
    }
    return jsonArray;
  },

  generateTableFromJSON(jsonArray) {
    if (jsonArray.length === 0) return "<p>No data available</p>";
    let table = "<table style=>";
    table += "<thead><tr>";
    Object.keys(jsonArray[0]).forEach((key) => {
      table += `<th>${key}</th>`;
    });
    table += "</tr></thead>";
    table += "<tbody>";
    jsonArray.forEach((item) => {
      table += "<tr>";
      Object.values(item).forEach((value) => {
        table += `<td>${value}</td>`;
      });
      table += "</tr>";
    });
    table += "</tbody>";

    table += "</table>";

    return table;
  },

  setOutput(output) {
    const statusElem = document.getElementById("output");
    statusElem.innerHTML = output;
  },

  setStatus(status) {
    const statusElem = document.getElementById("status");
    statusElem.innerHTML = status;
  },

  startTimer() {
    const timerDisplay = document.getElementById("timer");
    let startTime = Date.now();
    let timerId = setInterval(() => {
      const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
      timerDisplay.innerText = `${elapsedTime}s`;
    }, 10);
    gTimerId = timerId;
    return timerId;
  },

  stopTimer(timerId) {
    clearInterval(timerId || gTimerId);
  },

  log(str, append) {
    if (typeof str == "object") {
      str = JSON.stringify(str, null, 2);
    }
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
