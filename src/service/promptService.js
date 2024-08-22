export class PromptService {

    //calculate mismatch accuracy
  calculateAccuracy() {}

  //generate summary
  summaryPrompt() {}

  //prompt to work with agreement case
  agreementPrompt() {}

  //prompt to work with disagreement case
  disagreementPrompt() {}

  //find the table with detailed calculation in case of mismatch
  detectDisagreedCaclTablePrompt(emailHtml) {
    console.log(emailHtml);

    const data = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `PARTY=${emailHtml.party}, EMAILHTML=${emailHtml.emailHtml}`,
            },
          ],
        },
      ],
      systemInstruction: {
        role: "user",
        parts: [
          {
            text: "Act as a worlds best email reviewer",
          },
          {
            text: "In the given email, the client has pointed out a disgreement/mismatch in the amounts",
          },
          {
            text: "I want you to go through the email provided. Of the tables present in the email, there is at least 1 table where the client has provided detailed calculation",
          },
          {
            text: "The calculation table generally has a lot of columns, data like exchange rates, quantity, initial price, initial date, etc are present in the calculation table",
          },
          {
            text: "You must not be confused by multiple tables, choose the table that has the most extensive data",
          },
          {
            text: "YOU MUST GIVE YOUR OUTPUT as one or more <table></table> tags that contains the detailed calculations",
          },
        ],
      },
      generationConfig: {
        temperature: 0,
        topK: 64,
        topP: 0.95,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
      },
    };

    return data;
  }

  checkForMismatchesPrompt(clientData, apiData) {}
}
