import { HtmlLogger } from "./logging";

export const OfficeUtils = {
  async getCurrentEmailSender(){
    const item = Office.context.mailbox.item;
     return item.from.emailAddress
  },
  async getCurrentEmailAsHtmlString() {
    const item = Office.context.mailbox.item;
    const emailBody = await new Promise((resolve, reject) => {
      item.body.getAsync(Office.CoercionType.Html, resolve);
    });
    return emailBody.value;
  },
};

function removeAttributes(node) {
  for (let i = node.attributes.length - 1; i >= 0; i--) {
    node.removeAttribute(node.attributes[i].name);
  }
}
function removeEmptyNodes(node) {
  if (node.nodeType === Node.ELEMENT_NODE) {
    // Recursively clean child nodes first
    for (let i = node.childNodes.length - 1; i >= 0; i--) {
      removeEmptyNodes(node.childNodes[i]);
    }
    // Remove the node if it is empty
    if (node.childNodes.length === 0 && node.textContent.trim() === "") {
      node.remove();
    }
  }
}
function cleanNode(node) {
  if (node.nodeType === Node.ELEMENT_NODE) {
    removeAttributes(node);
    node.childNodes.forEach(cleanNode);
  }
}

export class EmailCleaner {
  cleanHtml(messyHtml) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(messyHtml, "text/html");
    cleanNode(doc.body);
    removeEmptyNodes(doc.body);
    return doc.body.innerHTML;
  }

  splitEmailThread(emailThreadHtml) {
    const emailParts = emailThreadHtml.split(/<div><font><b>From:|<div>On [^<]+<a/g);
    return emailParts.filter((part) => part.trim() !== "").map((part) => "<div><font><b>From:" + part);
  }

  extractEmailDetails(emailHtml) {
    const emailDetails = {};

    // Regex to match any email address using the "@" symbol as a key indicator
    const emailRegex = /[^<@]+@[^<]+/g;

    // Extract all email addresses from the HTML
    const emailMatches = emailHtml.match(emailRegex);

    if (emailMatches && emailMatches.length >= 2) {
      // First match is 'From', second match is 'To'
      emailDetails.from = emailMatches[0].trim();
      emailDetails.to = emailMatches[1].trim();
    } else if (emailMatches && emailMatches.length >= 1) {
      // First match is 'From', second match is 'To'
      emailDetails.from = emailMatches[0].trim();
    } else {
      emailDetails.from = "";
      emailDetails.to = "";
    }

    // Store the full email HTML
    emailDetails.emailHtml = emailHtml.trim();
    HtmlLogger.log(emailDetails.to || "0", 1);

    return emailDetails;
  }
}
