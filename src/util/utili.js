export function minHtml(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
  
    // Function to remove attributes from a node
    function removeAttributes(node) {
        for (let i = node.attributes.length - 1; i >= 0; i--) {
            node.removeAttribute(node.attributes[i].name);
        }
    }
  
    // Function to remove empty nodes
    function removeEmptyNodes(node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
            // Recursively clean child nodes first
            for (let i = node.childNodes.length - 1; i >= 0; i--) {
                removeEmptyNodes(node.childNodes[i]);
            }
            // Remove the node if it is empty
            if (node.childNodes.length === 0 && node.textContent.trim() === '') {
                node.remove();
            }
        }
    }
  
    // Recursively clean the document
    function cleanNode(node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
            removeAttributes(node);
            node.childNodes.forEach(cleanNode);
        }
    }
  
    // Start cleaning from the body
    cleanNode(doc.body);
    removeEmptyNodes(doc.body);
  
    // Serialize the cleaned document back to a string
    return doc.body.innerHTML;
  }


  export function parseTable(tableElement) {
    const parser = new DOMParser();
      const doc = parser.parseFromString(tableElement, 'text/html');
      const tables = doc.querySelectorAll('table');
      const allTablesData = [];
  
      tables.forEach((table)=>{
        const tableData = [];
        const rows = table.querySelectorAll('tr');
  
        rows.forEach(row => {
            const rowData = [];
            const cells = row.querySelectorAll('td, th');
  
            cells.forEach(cell => {
                rowData.push(cell.textContent.trim());
            });
  
            tableData.push(rowData);
        });
  
        allTablesData.push(tableData);
      })
  
    return allTablesData;
  }

  export function findMismatches(emailThreadData){
    console.log(emailThreadData)
    let result
    try{
      result= parseTable(emailThreadData);
    }catch(e){console.log(e)}
    console.log('done',result)
  }

  export function filterNonGmailEmails(emailThreadData) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(emailThreadData, 'text/html');
    const emails = doc.querySelectorAll('div[dir="ltr"]'); // Adjust the selector based on your HTML structure
    const nonGmailEmails = [];

    emails.forEach(email => {
        const emailAddress = email.querySelector('address').textContent; // Adjust based on your HTML structure
        if (!emailAddress.endsWith('@gmail.com')) {
            nonGmailEmails.push(email.outerHTML);
        }
    });

    return nonGmailEmails.join('');
}

// Function to extract email addresses from the HTML content
function extractEmailsFromHTML(html) {
    const emailAddresses = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Find all email addresses in the HTML content
    doc.querySelectorAll('a[href^="mailto:"]').forEach(a => {
        const email = a.textContent.trim();
        if (email) {
            emailAddresses.push(email);
        }
    });

    return emailAddresses;
}

// Function to filter out emails from a specific address
function filterEmails(emailAddresses) {
    const filteredEmails = emailAddresses.filter(email => {
        return email !== 'devesh9494@outlook.com';
    });
    return filteredEmails;
}

// Main function to extract and filter email addresses
export function processEmailChain(html) {
    const emailAddresses = extractEmailsFromHTML(html);
    const filteredEmails = filterEmails(emailAddresses);
    return filteredEmails;
}



