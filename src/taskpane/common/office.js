import { HtmlLogger } from "./logging";

export const OfficeUtils = {
  async getCurrentEmailSender() {
    return "shiveshnavin@gmail.com";
  },
  async getCurrentEmailAsHtmlString() {
    return `Hello,

We agree to pay USD 66,373.43 for VD 15 August 2024.

Kindly let us know if you have queries.

Regards,
SG`;
  },
  async getTimeStampOfEmail() {
    return Date.now();
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
  parseTable(tableElement) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(tableElement, "text/html");
    const tables = doc.querySelectorAll("table");
    const allTablesData = [];

    tables.forEach((table) => {
      const tableData = [];
      const rows = table.querySelectorAll("tr");

      rows.forEach((row) => {
        const rowData = [];
        const cells = row.querySelectorAll("td, th");

        cells.forEach((cell) => {
          rowData.push(cell.textContent.trim());
        });

        tableData.push(rowData);
      });

      allTablesData.push(tableData);
    });

    return allTablesData;
  }

  cleanHtml(messyHtml) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(messyHtml, "text/html");
    cleanNode(doc.body);
    removeEmptyNodes(doc.body);
    return doc.body.innerHTML;
  }

  splitEmailThread(emailThreadHtml) {
    console.log(emailThreadHtml);
    //split email based on tag , add to emailParts array
    const emailParts = emailThreadHtml.split(/<div><font><b>From:|<div>On [^<]+<a/g);
    console.log(emailParts);

    return emailParts.filter((part) => part.trim() !== "").map((part) => "<div><font><b>From:" + part);
  }

  //   splitEmailThread(emailThreadHtml) {
  //     console.log(emailThreadHtml);
  //     // Split email based on tag, add to emailParts array
  //     const emailParts = emailThreadHtml.split(/<div><font><b>From:|<div>On [^<]+<a/g);
  //     console.log(emailParts);

  //     // Create JSON array with each split email
  //     const emailJsonArray = emailParts
  //         .filter((part) => part.trim() !== "") // Filter out empty parts
  //         .map((part) => {
  //             const emailContent = "<div><font><b>From:" + part;
  //             return { emailContent: emailContent }; // Return JSON object for each part
  //         });

  //     console.log(emailJsonArray);

  //     // Return JSON array
  //     return emailParts.filter((part) => part.trim() !== "").map((part) => "<div><font><b>From:" + part);
  // }

  extractEmailDetails(emailHtml) {
    const emailDetails = {};
    const emailRegex = /[^<@]+@[^<]+/g;
    const emailMatches = emailHtml.match(emailRegex);
    if (emailMatches && emailMatches.length >= 1) {
      emailDetails.party = emailMatches[0].trim();
    } else {
      emailDetails.party = "";
    }
    emailDetails.emailHtml = emailHtml.trim();
    if (emailDetails.party) {
      const fromSplit = emailDetails.party.split(">");
      emailDetails.party = fromSplit[fromSplit.length - 1];
    }
    return emailDetails;
  }
}
