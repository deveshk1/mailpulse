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
              text: 'I want you to go through the email trail provided in ascending order and Look for mutual AGREEMENT OR DISAGREEMENT',
            },
            {
              text: 'Mutual AGREEMENT can only be there if there are NO conflicts/mismatches/disagreements or both parties come to a mutual agreement on all data',
            },
            {
              text: "YOU MUST GIVE YOUR OUTPUT IN one word format. YOUR RESPONSE should be either 'agreed' or 'not_agreed' and nothing else",
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