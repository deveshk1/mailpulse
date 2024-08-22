import { LLMApi } from "../common/llm";
import { HtmlLogger } from "../common/logging";

export function checkForMismatches(clientData, sorData){
  
    HtmlLogger.log(clientData)
    const data = {
        contents: [
            {
                role: "user",
                parts: [
                  {
                    text: `THE DATA FROM CLIENT IS:  ${JSON.stringify(clientData)}`,
                  },
                ],
              },
              {
                role: "user",
                parts: [
                  {
                    text: `THE DATA FROM MY SOR IS:  ${JSON.stringify(sorData)}`,
                  },
                ],
              },
              {
                role: "user",
                parts: [
                  {
                    text: `Compare the client data vs sor data and provide the mismatches in the required format`,
                  },
                ],
              }
        ],
        systemInstruction: {
          role: "user",
          parts: [
            {
              text: 'Act as a worlds best data investigator',
            },
            {
              text: 'Your goal is to find the mismatches between the calculations data that client has shared with the data that is present in my SOR',
            },
            {
              text: 'you need to compare only numeric values, from client compare only numeric values like "Initial Price", Final Price, Final FX Rate, Flow Amount etc while from sor the name of the columns are not fixed,though they will alwyas be numeric, you need to use due deliegence to compare the columns frmo client with the corrosponding columns from sor data',
            },
            {
              text: `compare similar columns as the column names in party 1 and party 2 will be different technicall, for example u need to compare "Initial Price " with "Start Stock Ccy Proce", " Final Price" with "End Stock Ccy Price" and so on`,
            },
            {
              text: "THE RELEVANT COLUMNS TO COMPARE from client are only, Initial Price Quantity Initial Price Final Price Initial FX Rate Final FX Rate",
            },
            {
              text: 'LIST THE MISMATCHES IN THE FOLLOWING FLATENNED JSON ARRAY FORMAT), ONLY OUTPUT the json array [ { Field:"column name",  Client:"value from client data",  API:"value from sor data", Accuracy: "calculate client vs API in %" } ]',
            },
          ],
        },
        generationConfig: {
          temperature: 1,
          topK: 64,
          topP: 0.95,
          maxOutputTokens: 8192,
          responseMimeType: "text/plain",
        },
      };
  
      return LLMApi.query(data)
}

export function detectDisagreedCaclTable(emailHtml){
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
              }
        ],
        systemInstruction: {
          role: "user",
          parts: [
            {
              text: 'Act as a worlds best email reviewer',
            },
            {
              text: 'In the given email, the client has pointed out a disgreement/mismatch in the amounts',
            },
            {
              text: 'I want you to go through the email provided. Of the tables present in the email, there is at least 1 table where the client has provided detailed calculation',
            },
            {
              text: 'The calculation table generally has a lot of columns, data like exchange rates, quantity, initial price etc are present in the calculation table',
            },
            {
              text: "You must not be confused my multiple tables, choose the table that has the most extensive data",
            },
            {
              text: "YOU MUST GIVE YOUR OUTPUT as one or more <table></table> tags that contains the detailed calculations",
            }
          ],
        },
        generationConfig: {
          temperature: 1,
          topK: 64,
          topP: 0.95,
          maxOutputTokens: 8192,
          responseMimeType: "text/plain",
        },
      };
  
      return LLMApi.query(data)

}