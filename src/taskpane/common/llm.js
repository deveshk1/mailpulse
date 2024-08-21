import axios from "axios";

const apiKey = "AIzaSyDMpSIwNqmU3XmYcrl3RsRqQkOAVgQal-o";

export const LLMApi = {

  summarizeThread(emailArr, points = 5){ // [{ party, emailHtml }]
    const ascEmailArr = emailArr
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
              text: 'Act as a worlds best email summarizer',
            },
            {
              text: 'I want you to go through the email trail provided in ascending order and summarize the email',
            },
            {
              text: 'DONOT, I REPEAT DONOT INCLUDE ANY DATA FROM within the <table></table> tags in your summary to reduce clutter',
            },
            {
              text: `Output the summary in no more than ${points} short points. Only output as a html <ul></ul> and nothing else`,
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
  },

   query(data) {
    return axios 
      .post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response.data.candidates[0].content.parts[0].text);
        return response.data.candidates[0].content.parts[0].text;
      })
      .catch((error) => {
        console.error("Error:", error);
        throw error
      });
  },
};
