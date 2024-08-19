// Assuming `emailBody` is the HTML content you provided
const emailBody = `...`; // replace with the HTML string

// Function to extract and filter the emails
function extractFilteredEmails(html) {
    // Create a DOM parser to parse the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Get all the email parts (in this case, they are within blockquotes)
    const emailParts = doc.querySelectorAll('blockquote');
    
    // Initialize an array to hold the filtered emails
    const filteredEmails = [];
    
    emailParts.forEach(part => {
        const emailText = part.textContent || part.innerText;
        
        // Check if the email contains the excluded domain or email address
        const senderInfo = part.querySelector('font')?.textContent || '';
        if (!senderInfo.includes('gmail.com') && !senderInfo.includes('edustudy0@gmail.com')) {
            filteredEmails.push(emailText);
        }
    });

    return filteredEmails;
}

const filteredEmails = extractFilteredEmails(emailBody);

// Logging the filtered email parts
filteredEmails.forEach(email => console.log(email));
