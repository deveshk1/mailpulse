/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 *
 * See the getting started guide for more information
 * https://ai.google.dev/gemini-api/docs/get-started/node
 */

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: "1.summarize email in bullet points in plain html and show action items in form of buy/sell button, do not repeat it in summary as well  in plain html ONLY\nafter writing summary of email in bullet points ,improve the button quality , add more animation to look more attractive\nsummarize in bullet points the action expected from sender of email which should include descriptive action, then show all the buttons(as per previous instructions)\n \n2. create html action buttons in plain html where buy action should be in green colour and sell action should be in red colour\ncreate a purple colour \"Schedule Meeting\" button similar to buy and sell , also mention the name of the person in meeting button who has requested for meeting\ngenerated html button has button text which says quantity and price with buy or sell action\n3.onclick \"buy\" should redrect to /buy API and sell to /sell API and schedule meeting buttoin onclick should redirect to /meeting API. \n4.the ouput can contain plain html to show texts and CSS properties can only be used to create and show buttons (colour as per previous instructions ONLY)\n5. Highlight date , any id like #1234 ,price ,quantity in blue colour\n6. when there is mail chain, mention about each mail in summary points in the order of occurance of the mail and its information provided.",
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
        {
          role: "user",
          parts: [
            {text: "Dear Devesh,\n\nI hope this email finds you well.\n\nI am writing to bring to your immediate attention an issue we encountered with the settlement of order #478562, which was executed on 1st August 2024. The trade involved the purchase of 50,000 shares of ABC Corporation (ticker: ABC) at a price of $50.75 per share, for a total transaction value of $2,537,500. Despite the trade being confirmed and matched on the trading platform, we have not received the corresponding settlement confirmation from our custodian. This discrepancy is causing significant concern as the settlement date was scheduled for 3rd August 2024, and we are now at risk of a fail.\n\nGiven the urgency of the matter, I kindly request that you liaise with our custodian to determine the cause of the delay and expedite the settlement process. Additionally, please provide an update on the status of this order at your earliest convenience. If there are any further details or actions required from my end, please let me know, and I will prioritize them to ensure a swift resolution. The timely settlement of this trade is crucial to our portfolio strategy and compliance requirements.\n\nThank you for your immediate attention to this matter. I look forward to your prompt response.\n\nBest regards,\n\nPhil\n\nTrade User"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "```html\n<h2>Email Summary</h2>\n<ul>\n  <li>Issue with settlement of order #478562, executed on 1st August 2024.</li>\n  <li>Trade involved purchasing 50,000 shares of ABC Corporation (ticker: ABC) at $50.75 per share.</li>\n  <li>Trade confirmed and matched, but settlement confirmation not received from custodian.</li>\n  <li>Settlement date was 3rd August 2024, and risk of fail.</li>\n  <li>Request to liaise with custodian to determine cause of delay and expedite settlement.</li>\n  <li>Request for update on order status at earliest convenience.</li>\n  <li>Urgency highlighted due to portfolio strategy and compliance requirements.</li>\n</ul>\n\n<h2>Action Items</h2>\n<button style=\"background-color: purple; color: white; padding: 10px 20px; border: none; cursor: pointer;\" onclick=\"window.location.href='/meeting'\">Schedule Meeting with Phil</button>\n```\n"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "Dear Devesh,\nI hope this email finds you well.\nI am writing to bring to your immediate attention an issue we encountered with the settlement of order #478562, which was executed on 1st August 2024. The trade involved the purchase of 50,000 shares of ABC Corporation (ticker: ABC) at a price of $50.75 per share, for a total transaction value of $2,537,500. Despite the trade being confirmed and matched on the trading platform, we have not received the corresponding settlement confirmation from our custodian. This discrepancy is causing significant concern as the settlement date was scheduled for 3rd August 2024, and we are now at risk of a fail.\nGiven the urgency of the matter, I kindly request that you liaise with our custodian to determine the cause of the delay and expedite the settlement process. Additionally, please provide an update on the status of this order at your earliest convenience. If there are any further details or actions required from my end, please let me know, and I will prioritize them to ensure a swift resolution. The timely settlement of this trade is crucial to our portfolio strategy and compliance requirements.\nThank you for your immediate attention to this matter. I look forward to your prompt response.\nBest regards,\nPhil\nTrade User"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "```html\n<h2>Email Summary</h2>\n<ul>\n  <li>Issue with settlement of order <span style=\"color:blue\">#478562</span>, executed on <span style=\"color:blue\">1st August 2024</span>.</li>\n  <li>Trade involved purchasing <span style=\"color:blue\">50,000</span> shares of ABC Corporation (ticker: ABC) at a price of <span style=\"color:blue\">$50.75</span> per share, for a total transaction value of <span style=\"color:blue\">$2,537,500</span>.</li>\n  <li>Trade confirmed and matched, but settlement confirmation not received from custodian.</li>\n  <li>Settlement date was <span style=\"color:blue\">3rd August 2024</span>, and risk of fail.</li>\n  <li>Request to liaise with custodian to determine cause of delay and expedite settlement.</li>\n  <li>Request for update on order status at earliest convenience.</li>\n  <li>Urgency highlighted due to portfolio strategy and compliance requirements.</li>\n</ul>\n\n<h2>Action Items</h2>\n<button style=\"background-color: purple; color: white; padding: 10px 20px; border: none; cursor: pointer;\" onclick=\"window.location.href='/meeting'\">Schedule Meeting with Phil</button>\n``` \n"},
          ],
        },
      ],
    });
  
    const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
    console.log(result.response.text());
  }
  
  run();