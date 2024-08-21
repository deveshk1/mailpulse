import { LLMApi } from "../common/llm";

export function extractAgreedValue(emailThreadArr){
  const ascEmailArr = emailThreadArr
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
            text: 'Act as a worlds best email reviewer',
          },
          {
            text: 'I want you to go through the email trail provided in ascending order and Look for mutual AGREEMENT OR DISAGREEMENT',
          },
          {
            text: 'if there is a FINAL AGREEMENT ON A SETTLEMENT AMOUNT, i want you to extract the amount',
          },
          {
            text: "YOU MUST GIVE YOUR OUTPUT IN single floating number format and nothing else",
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

export function checkIsAgreement(emailThreadArr = []){ // [{ party, emailHtml }]
    const ascEmailArr = [...emailThreadArr].reverse()
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
              text: 'I want you to go through the email trail provided in ascending order and Look for DISAGREEMENT or DISCRIPANCY or MISMATCH',
            },
            {
              text: 'LOOK FOR ANY DISAGREEMENTS or conflicts/mismatches/disagreements',
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