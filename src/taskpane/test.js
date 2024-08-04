const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  // function summarize(){  
  function summarize(emailBody){
  const apiKey = `AIzaSyDMpSIwNqmU3XmYcrl3RsRqQkOAVgQal-o`;
  const genAI = new GoogleGenerativeAI(apiKey);
    
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: "1.summarize email in bullet points in plain html and show action items in form of buy/sell button, do not repeat it in summary as well  in plain html ONLY\nafter writing summary of email in bullet points ,improve the button quality , add more animation to look more attractive\nsummarize in bullet points the action expected from sender of email which should include descriptive action, then show all the buttons(as per previous instructions)\n \n2. create html action buttons in plain html where buy action should be in green colour and sell action should be in red colour\ncreate a purple colour \"Schedule Meeting\" button similar to buy and sell , also mention the name of the person in meeting button who has requested for meeting\ngenerated html button has button text which says quantity and price with buy or sell action\n3.onclick \"buy\" should redrect to /buy API and sell to /sell API and schedule meeting buttoin onclick should redirect to /meeting API. \n4.the ouput can contain plain html to show texts and CSS properties can only be used to create and show buttons (colour as per previous instructions ONLY)",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
  async function run() {
    const chatSession = model.startChat({
      generationConfig,
   // safetySettings: Adjust safety settings
   // See https://ai.google.dev/gemini-api/docs/safety-settings
      history: [
        {
          role: "user",
          parts: [
            {text: "Dear Devesh\n\nI hope this email finds you well. I am writing to express my interest in purchasing stock in Société Générale.\n\nCould you please provide me with the necessary details and procedures for acquiring shares in Société Générale? Specifically, I would like information on the following:\n\nCurrent Stock Price: The current market value of Société Générale shares.\nMinimum Purchase Requirement: Any minimum number of shares or investment amount required for purchase.\nTransaction Process: The steps involved in completing the purchase, including any documentation or forms that need to be completed.\nPayment Options: Available methods for payment and any associated fees.\nTiming and Availability: The timeline for the transaction and the availability of shares.\nfor time being i would want you to sell societe generale equity stock of 500 quantity at price 10 eur\nfor time being i would want you to buy societe generale equity stock of 800 quantity at price 10 eur\nalso buy Tesla share for 200$  and sell microsoft share of 50$\nPlease let me know if there are any additional considerations or information I should be aware of before proceeding. If possible, I would appreciate a meeting or a call to discuss the details further.\n\nThank you for your assistance. I look forward to your response.\n\nBest regards,\n\nKumar Das\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "```html\n<h2>Email Summary</h2>\n<ul>\n  <li>Request for information on purchasing Société Générale stock.</li>\n  <li>Specific details requested: current stock price, minimum purchase requirement, transaction process, payment options, timing and availability.</li>\n  <li>Request to sell 500 Société Générale shares at 10 EUR.</li>\n  <li>Request to buy 800 Société Générale shares at 10 EUR.</li>\n  <li>Request to buy 200 Tesla shares at 200 USD.</li>\n  <li>Request to sell 50 Microsoft shares at 50 USD.</li>\n  <li>Request for a meeting or call to discuss further.</li>\n</ul>\n\n<h2>Action Items</h2>\n<button style=\"background-color: green; color: white; padding: 10px 20px; border: none; cursor: pointer;\" onclick=\"window.location.href='/buy'\">Buy 800 Société Générale @ 10 EUR</button>\n<button style=\"background-color: red; color: white; padding: 10px 20px; border: none; cursor: pointer;\" onclick=\"window.location.href='/sell'\">Sell 500 Société Générale @ 10 EUR</button>\n<button style=\"background-color: green; color: white; padding: 10px 20px; border: none; cursor: pointer;\" onclick=\"window.location.href='/buy'\">Buy 200 Tesla @ 200 USD</button>\n<button style=\"background-color: red; color: white; padding: 10px 20px; border: none; cursor: pointer;\" onclick=\"window.location.href='/sell'\">Sell 50 Microsoft @ 50 USD</button>\n<button style=\"background-color: purple; color: white; padding: 10px 20px; border: none; cursor: pointer;\" onclick=\"window.location.href='/meeting'\">Schedule Meeting with Kumar Das</button>\n```\n"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "Dear Devesh,I hope this message finds you well. I am interested in purchasing shares in Apple Inc.Could you please provide me with the following information?Current Stock Price: The current market value of Apple shares.Minimum Purchase Requirement: The minimum number of shares or investment amount required.Transaction Process: Steps to complete the purchase, including necessary documentation.Payment Options: Available methods for payment and any associated fees.Timing and Availability: The timeline for the transaction and the availability of shares.Additionally, I would like to:Sell 100 shares of Amazon at $1500 each.Buy 50 shares of Google at $1200 each.Buy 30 shares of Facebook at $250 each.Sell 40 shares of Netflix at $400 each.Please inform me of any other considerations or information I should be aware of. I would appreciate a meeting or call to discuss these details further.Thank you for your assistance. I look forward to your response.Best regards,John Smith\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "```html\n<h2>Email Summary</h2>\n<ul>\n  <li>Request for information on purchasing Apple Inc. stock.</li>\n  <li>Specific details requested: current stock price, minimum purchase requirement, transaction process, payment options, timing and availability.</li>\n  <li>Request to sell 100 Amazon shares at $1500 each.</li>\n  <li>Request to buy 50 Google shares at $1200 each.</li>\n  <li>Request to buy 30 Facebook shares at $250 each.</li>\n  <li>Request to sell 40 Netflix shares at $400 each.</li>\n  <li>Request for a meeting or call to discuss further.</li>\n</ul>\n\n<h2>Action Items</h2>\n<button style=\"background-color: red; color: white; padding: 10px 20px; border: none; cursor: pointer;\" onclick=\"window.location.href='/sell'\">Sell 100 Amazon @ $1500</button>\n<button style=\"background-color: green; color: white; padding: 10px 20px; border: none; cursor: pointer;\" onclick=\"window.location.href='/buy'\">Buy 50 Google @ $1200</button>\n<button style=\"background-color: green; color: white; padding: 10px 20px; border: none; cursor: pointer;\" onclick=\"window.location.href='/buy'\">Buy 30 Facebook @ $250</button>\n<button style=\"background-color: red; color: white; padding: 10px 20px; border: none; cursor: pointer;\" onclick=\"window.location.href='/sell'\">Sell 40 Netflix @ $400</button>\n<button style=\"background-color: purple; color: white; padding: 10px 20px; border: none; cursor: pointer;\" onclick=\"window.location.href='/meeting'\">Schedule Meeting with John Smith</button>\n```\n"},
          ],
        },
      ],
    });
    let h = `Dear Devesh

    I hope this email finds you well. I am writing to express my interest in purchasing stock in Société Générale.
    
    Could you please provide me with the necessary details and procedures for acquiring shares in Société Générale? Specifically, I would like information on the following:
    
    Current Stock Price: The current market value of Société Générale shares.
    Minimum Purchase Requirement: Any minimum number of shares or investment amount required for purchase.
    Transaction Process: The steps involved in completing the purchase, including any documentation or forms that need to be completed.
    Payment Options: Available methods for payment and any associated fees.
    Timing and Availability: The timeline for the transaction and the availability of shares.
    for time being i would want you to sell societe generale equity stock of 50 quantity at price 10 eur
    Please let me know if there are any additional considerations or information I should be aware of before proceeding. If possible, I would appreciate a meeting or a call to discuss the details further.
    
    Thank you for your assistance. I look forward to your response.
    
    Best regards,
    
    Kumar Das`
    const result = await chatSession.sendMessage(h);
    console.log(result.response.text());
  }
}
  run();

// }
  
//   $ curl \
//   > -H 'Content-Type: application/json' \
//     -d '{"contents":[{"parts":[{"text":"Explain how AI works"}]}]}' \
//     -X POST 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyDMpSIwNqmU3XmYcrl3RsRqQkOAVgQal-o'
  


API_KEY="YOUR_API_KEY"

# Adjust safety settings in generationConfig below.
# See https://ai.google.dev/gemini-api/docs/safety-settings
curl \
  -X POST https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY} \
  -H 'Content-Type: application/json' \
  -d @<(echo '{
  "contents": [
    {
      "role": "user",
      "parts": [
        {
          "text": "Dear Devesh\n\nI hope this email finds you well. I am writing to express my interest in purchasing stock in Société Générale.\n\nCould you please provide me with the necessary details and procedures for acquiring shares in Société Générale? Specifically, I would like information on the following:\n\nCurrent Stock Price: The current market value of Société Générale shares.\nMinimum Purchase Requirement: Any minimum number of shares or investment amount required for purchase.\nTransaction Process: The steps involved in completing the purchase, including any documentation or forms that need to be completed.\nPayment Options: Available methods for payment and any associated fees.\nTiming and Availability: The timeline for the transaction and the availability of shares.\nfor time being i would want you to sell societe generale equity stock of 500 quantity at price 10 eur\nfor time being i would want you to buy societe generale equity stock of 800 quantity at price 10 eur\nalso buy Tesla share for 200$  and sell microsoft share of 50$\nPlease let me know if there are any additional considerations or information I should be aware of before proceeding. If possible, I would appreciate a meeting or a call to discuss the details further.\n\nThank you for your assistance. I look forward to your response.\n\nBest regards,\n\nKumar Das\n"
        }
      ]
    },
    {
      "role": "model",
      "parts": [
        {
          "text": "```html\n<h2>Email Summary</h2>\n<ul>\n  <li>Request for information on purchasing Société Générale stock.</li>\n  <li>Specific details requested: current stock price, minimum purchase requirement, transaction process, payment options, timing and availability.</li>\n  <li>Request to sell 500 Société Générale shares at 10 EUR.</li>\n  <li>Request to buy 800 Société Générale shares at 10 EUR.</li>\n  <li>Request to buy 200 Tesla shares at 200 USD.</li>\n  <li>Request to sell 50 Microsoft shares at 50 USD.</li>\n  <li>Request for a meeting or call to discuss further.</li>\n</ul>\n\n<h2>Action Items</h2>\n<button style=\"background-color: green; color: white; padding: 10px 20px; border: none; cursor: pointer;\" onclick=\"window.location.href='\''/buy'\''\">Buy 800 Société Générale @ 10 EUR</button>\n<button style=\"background-color: red; color: white; padding: 10px 20px; border: none; cursor: pointer;\" onclick=\"window.location.href='\''/sell'\''\">Sell 500 Société Générale @ 10 EUR</button>\n<button style=\"background-color: green; color: white; padding: 10px 20px; border: none; cursor: pointer;\" onclick=\"window.location.href='\''/buy'\''\">Buy 200 Tesla @ 200 USD</button>\n<button style=\"background-color: red; color: white; padding: 10px 20px; border: none; cursor: pointer;\" onclick=\"window.location.href='\''/sell'\''\">Sell 50 Microsoft @ 50 USD</button>\n<button style=\"background-color: purple; color: white; padding: 10px 20px; border: none; cursor: pointer;\" onclick=\"window.location.href='\''/meeting'\''\">Schedule Meeting with Kumar Das</button>\n```\n"
        }
      ]
    },
    {
      "role": "user",
      "parts": [
        {
          "text": "Dear Devesh,I hope this message finds you well. I am interested in purchasing shares in Apple Inc.Could you please provide me with the following information?Current Stock Price: The current market value of Apple shares.Minimum Purchase Requirement: The minimum number of shares or investment amount required.Transaction Process: Steps to complete the purchase, including necessary documentation.Payment Options: Available methods for payment and any associated fees.Timing and Availability: The timeline for the transaction and the availability of shares.Additionally, I would like to:Sell 100 shares of Amazon at $1500 each.Buy 50 shares of Google at $1200 each.Buy 30 shares of Facebook at $250 each.Sell 40 shares of Netflix at $400 each.Please inform me of any other considerations or information I should be aware of. I would appreciate a meeting or call to discuss these details further.Thank you for your assistance. I look forward to your response.Best regards,John Smith\n"
        }
      ]
    },
    {
      "role": "model",
      "parts": [
        {
          "text": "```html\n<h2>Email Summary</h2>\n<ul>\n  <li>Request for information on purchasing Apple Inc. stock.</li>\n  <li>Specific details requested: current stock price, minimum purchase requirement, transaction process, payment options, timing and availability.</li>\n  <li>Request to sell 100 Amazon shares at $1500 each.</li>\n  <li>Request to buy 50 Google shares at $1200 each.</li>\n  <li>Request to buy 30 Facebook shares at $250 each.</li>\n  <li>Request to sell 40 Netflix shares at $400 each.</li>\n  <li>Request for a meeting or call to discuss further.</li>\n</ul>\n\n<h2>Action Items</h2>\n<button style=\"background-color: red; color: white; padding: 10px 20px; border: none; cursor: pointer;\" onclick=\"window.location.href='\''/sell'\''\">Sell 100 Amazon @ $1500</button>\n<button style=\"background-color: green; color: white; padding: 10px 20px; border: none; cursor: pointer;\" onclick=\"window.location.href='\''/buy'\''\">Buy 50 Google @ $1200</button>\n<button style=\"background-color: green; color: white; padding: 10px 20px; border: none; cursor: pointer;\" onclick=\"window.location.href='\''/buy'\''\">Buy 30 Facebook @ $250</button>\n<button style=\"background-color: red; color: white; padding: 10px 20px; border: none; cursor: pointer;\" onclick=\"window.location.href='\''/sell'\''\">Sell 40 Netflix @ $400</button>\n<button style=\"background-color: purple; color: white; padding: 10px 20px; border: none; cursor: pointer;\" onclick=\"window.location.href='\''/meeting'\''\">Schedule Meeting with John Smith</button>\n```\n"
        }
      ]
    },
    {
      "role": "user",
      "parts": [
        {
          "text": "INSERT_INPUT_HERE"
        }
      ]
    }
  ],
  "systemInstruction": {
    "role": "user",
    "parts": [
      {
        "text": "1.summarize email in bullet points in plain html and show action items in form of buy/sell button, do not repeat it in summary as well  in plain html ONLY\nafter writing summary of email in bullet points ,improve the button quality , add more animation to look more attractive\nsummarize in bullet points the action expected from sender of email which should include descriptive action, then show all the buttons(as per previous instructions)\n \n2. create html action buttons in plain html where buy action should be in green colour and sell action should be in red colour\ncreate a purple colour \"Schedule Meeting\" button similar to buy and sell , also mention the name of the person in meeting button who has requested for meeting\ngenerated html button has button text which says quantity and price with buy or sell action\n3.onclick \"buy\" should redrect to /buy API and sell to /sell API and schedule meeting buttoin onclick should redirect to /meeting API. \n4.the ouput can contain plain html to show texts and CSS properties can only be used to create and show buttons (colour as per previous instructions ONLY)"
      }
    ]
  },
  "generationConfig": {
    "temperature": 1,
    "topK": 64,
    "topP": 0.95,
    "maxOutputTokens": 8192,
    "responseMimeType": "text/plain"
  }
}')