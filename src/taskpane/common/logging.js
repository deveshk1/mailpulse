export const HtmlLogger = {
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
