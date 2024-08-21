import { LLMApi } from "../common/llm";

export function checkIsAgreement(emailThreadArr = []){ // [{ party, emailHtml }]
    const ascEmailArr = emailThreadArr.reverse()
    const contents = ascEmailArr.map(email=>{
        return {
            role: "user",
            parts: [
              {
                text: `PARTY=${email.party}, EMAILHTML=${email.emailHtml}`,
              },
            ],
          }
    })
    const data = {
        contents: contents,
        systemInstruction: {
          role: "user",
          parts: [
            {
              text: 'Act as a worlds best email reviwer',
            },
            {
              text: 'I want you to go through the email trail provided in ascending order and Look for DISAGREEMENT from ANY PARTY',
            },
            {
              text: "YOU MUST GIVE YOUR OUTPUT IN one word format. YOUR RESPONSE should be either 'not_agreed' and nothing else",
            },
            {
              text: 'IF EITHER OF THE PARTIES are NOT IN AGREEMENT or there are any conflicts/mismatches/disagreements AT ALL, then you must return not_agreed',
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