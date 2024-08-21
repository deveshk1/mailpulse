import axios from "axios";

const apiKey = "AIzaSyDMpSIwNqmU3XmYcrl3RsRqQkOAVgQal-o";

export const LLMApi = {
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
