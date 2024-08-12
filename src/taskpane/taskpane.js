import { getAccessToken } from "../auth/auth";
import { getGraphAccessToken, getGraphyToken } from "../auth/graph";

const axios = require("axios");
/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global document, Office */

Office.onReady((info) => {
  if (info.host === Office.HostType.Outlook) {
    document.getElementById("sideload-msg").style.display = "none";
    document.getElementById("app-body").style.display = "flex";
    document.getElementById("run").onclick = run2;
  }
});



export async function run2() {
  const running = document.getElementById("run");
  running.innerText = "Analyzing...";

  
  const timerDisplay = document.getElementById("timer");
  let startTime = Date.now();
   // Update timer every second
   let timerInterval = setInterval(() => {
    const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
    timerDisplay.innerText = `You Waited : ${elapsedTime}s`;
  }, 10);


  const item = Office.context.mailbox.item;
  // console.log(Office.context.mailbox.item.conversationId);
  // id :

  const emailBody = await new Promise((resolve, reject) => {
    item.body.getAsync(Office.CoercionType.Text, resolve);
  });

  const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");

  const apiKey = "AIzaSyDMpSIwNqmU3XmYcrl3RsRqQkOAVgQal-o";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

  const data = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: "Hello, who are you",
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "I am MailPulse, your smart AI mail assistant",
          },
        ],
      },
      {
        role: "user",
        parts: [
          {
            text: "Dear Devesh\n\nI hope this email finds you well. I am writing to express my interest in purchasing stock in Société Générale.\n\nCould you please provide me with the necessary details and procedures for acquiring shares in Société Générale? Specifically, I would like information on the following:\n\nCurrent Stock Price: The current market value of Société Générale shares.\nMinimum Purchase Requirement: Any minimum number of shares or investment amount required for purchase.\nTransaction Process: The steps involved in completing the purchase, including any documentation or forms that need to be completed.\nPayment Options: Available methods for payment and any associated fees.\nTiming and Availability: The timeline for the transaction and the availability of shares.\nfor time being i would want you to sell societe generale equity stock of 500 quantity at price 10 eur\nfor time being i would want you to buy societe generale equity stock of 800 quantity at price 10 eur\nalso buy Tesla share for 200$  and sell microsoft share of 50$\nPlease let me know if there are any additional considerations or information I should be aware of before proceeding. If possible, I would appreciate a meeting or a call to discuss the details further.\n\nThank you for your assistance. I look forward to your response.\n\nBest regards,\n\nKumar Das\n",
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "```html\n<h2>Email Summary</h2>\n<ul>\n  <li>Request for information on purchasing Société Générale stock.</li>\n  <li>Specific details requested: current stock price, minimum purchase requirement, transaction process, payment options, timing and availability.</li>\n  <li>Request to sell 500 Société Générale shares at 10 EUR.</li>\n  <li>Request to buy 800 Société Générale shares at 10 EUR.</li>\n  <li>Request to buy 200 Tesla shares at 200 USD.</li>\n  <li>Request to sell 50 Microsoft shares at 50 USD.</li>\n  <li>Request for a meeting or call to discuss further.</li>\n</ul>\n\n<h2>Action Items</h2>\n<button style=\"background-color: green; color: white; padding: 10px 20px; border: none; cursor: pointer;\" onclick=\"window.location.href='''/buy'''\">Buy 800 Société Générale @ 10 EUR</button>\n<button style=\"background-color: red; color: white; padding: 10px 20px; border: none; cursor: pointer;\" onclick=\"window.location.href='''/sell'''\">Sell 500 Société Générale @ 10 EUR</button>\n<button style=\"background-color: green; color: white; padding: 10px 20px; border: none; cursor: pointer;\" onclick=\"window.location.href='''/buy'''\">Buy 200 Tesla @ 200 USD</button>\n<button style=\"background-color: red; color: white; padding: 10px 20px; border: none; cursor: pointer;\" onclick=\"window.location.href='''/sell'''\">Sell 50 Microsoft @ 50 USD</button>\n<button style=\"background-color: purple; color: white; padding: 10px 20px; border: none; cursor: pointer;\" onclick=\"window.location.href='''/meeting'''\">Schedule Meeting with Kumar Das</button>\n```\n",
          },
        ],
      },
      {
        role: "user",
        parts: [
          {
            text: "Dear Devesh,I hope this message finds you well. I am interested in purchasing shares in Apple Inc.Could you please provide me with the following information?Current Stock Price: The current market value of Apple shares.Minimum Purchase Requirement: The minimum number of shares or investment amount required.Transaction Process: Steps to complete the purchase, including necessary documentation.Payment Options: Available methods for payment and any associated fees.Timing and Availability: The timeline for the transaction and the availability of shares.Additionally, I would like to:Sell 100 shares of Amazon at $1500 each.Buy 50 shares of Google at $1200 each.Buy 30 shares of Facebook at $250 each.Sell 40 shares of Netflix at $400 each.Please inform me of any other considerations or information I should be aware of. I would appreciate a meeting or call to discuss these details further.Thank you for your assistance. I look forward to your response.Best regards,John Smith\n",
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "```html\n<h2>Email Summary</h2>\n<ul>\n  <li>Request for information on purchasing Apple Inc. stock.</li>\n  <li>Specific details requested: current stock price, minimum purchase requirement, transaction process, payment options, timing and availability.</li>\n  <li>Request to sell 100 Amazon shares at $1500 each.</li>\n  <li>Request to buy 50 Google shares at $1200 each.</li>\n  <li>Request to buy 30 Facebook shares at $250 each.</li>\n  <li>Request to sell 40 Netflix shares at $400 each.</li>\n  <li>Request for a meeting or call to discuss further.</li>\n</ul>\n\n<h2>Action Items</h2>\n<button style=\"background-color: red; color: white; padding: 10px 20px; border: none; cursor: pointer;\" onclick=\"window.location.href='''/sell'''\">Sell 100 Amazon @ $1500</button>\n<button style=\"background-color: green; color: white; padding: 10px 20px; border: none; cursor: pointer;\" onclick=\"window.location.href='''/buy'''\">Buy 50 Google @ $1200</button>\n<button style=\"background-color: green; color: white; padding: 10px 20px; border: none; cursor: pointer;\" onclick=\"window.location.href='''/buy'''\">Buy 30 Facebook @ $250</button>\n<button style=\"background-color: red; color: white; padding: 10px 20px; border: none; cursor: pointer;\" onclick=\"window.location.href='''/sell'''\">Sell 40 Netflix @ $400</button>\n<button style=\"background-color: purple; color: white; padding: 10px 20px; border: none; cursor: pointer;\" onclick=\"window.location.href='''/meeting'''\">Schedule Meeting with John Smith</button>\n```\n",
          },
        ],
      },
      {
        role: "user",
        parts: [
          {
            text: "Dear Devesh,\nI hope this email finds you well.\nI am writing to bring to your immediate attention an issue we encountered with the settlement of order #478562, which was executed on 1st August 2024. The trade involved the purchase of 50,000 shares of ABC Corporation (ticker: ABC) at a price of $50.75 per share, for a total transaction value of $2,537,500. Despite the trade being confirmed and matched on the trading platform, we have not received the corresponding settlement confirmation from our custodian. This discrepancy is causing significant concern as the settlement date was scheduled for 3rd August 2024, and we are now at risk of a fail.\nGiven the urgency of the matter, I kindly request that you liaise with our custodian to determine the cause of the delay and expedite the settlement process. Additionally, please provide an update on the status of this order at your earliest convenience. If there are any further details or actions required from my end, please let me know, and I will prioritize them to ensure a swift resolution. The timely settlement of this trade is crucial to our portfolio strategy and compliance requirements.\nThank you for your immediate attention to this matter. I look forward to your prompt response.\nBest regards,\nPhil\nTrade User",
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: '```html\n<h2>Email Summary</h2>\n<ul>\n  <li>Issue with settlement of order <span style="color:blue">#478562</span>, executed on <span style="color:blue">1st August 2024</span>.</li>\n  <li>Trade involved purchasing <span style="color:blue">50,000</span> shares of ABC Corporation (ticker: ABC) at a price of <span style="color:blue">$50.75</span> per share, for a total transaction value of <span style="color:blue">$2,537,500</span>.</li>\n  <li>Trade confirmed and matched, but settlement confirmation not received from custodian.</li>\n  <li>Settlement date was <span style="color:blue">3rd August 2024</span>, and risk of fail.</li>\n  <li>Request to liaise with custodian to determine cause of delay and expedite settlement.</li>\n  <li>Request for update on order status at earliest convenience.</li>\n  <li>Urgency highlighted due to portfolio strategy and compliance requirements.</li>\n</ul>\n\n<h2>Action Items</h2>\n<button style="background-color: purple; color: white; padding: 10px 20px; border: none; cursor: pointer;" onclick="window.location.href=\'/meeting\'">Schedule Meeting with Phil</button>\n``` \n',
          },
        ],
      },

      {
        role: "user",
        parts: [
          {
            text: emailBody.value,
          },
        ],
      },
    ],
    systemInstruction: {
      role: "user",
      parts: [
        {
          text: '1.summarize email in bullet points in plain html and show action items in form of buy/sell button, do not repeat it in summary as well  in plain html ONLY\nafter writing summary of email in bullet points ,improve the button quality , add more animation to look more attractive\nsummarize in bullet points the action expected from sender of email which should include descriptive action, then show all the buttons(as per previous instructions)\n \n2. create html action buttons in plain html where buy action should be in green colour and sell action should be in red colour\ncreate a purple colour "Schedule Meeting" button similar to buy and sell , also mention the name of the person in meeting button who has requested for meeting\ngenerated html button has button text which says quantity and price with buy or sell action\n3.onclick "buy" should redrect to /buy API and sell to /sell API and schedule meeting buttoin onclick should redirect to /meeting API. \n4.the ouput can contain plain html to show texts and CSS properties can only be used to create and show buttons (colour as per previous instructions ONLY)\n5. Highlight date , any id like #1234 ,price ,quantity in blue colour\n6. when there is mail chain, mention about each mail in summary points in the order of occurance of the mail and its information provided.',
        },
        {
          text:'Look for AGREEMENT OR DISAGREEMENT FROM ANY PARTY AND MENTION IN THE OUTPUT\n If AGREED : Show "settled"\n If NOT AGREED : show "Not Settled"'
        },
        {
          text:'If AGREED or SETTLED : show a action button with above instructions'
        },
        {
          text:'If NOT AGREED : show "NOT SETTLED" with grey button' 
        },
        {
          text:'IT IS MANDATORY TO SHOW FINAL RESPONSE ON AGREEMENT FROM CLIENT IF AVAILABLE' 
        },
        {
          text:'IT IS MANDATORY TO SHOW SETTLED OR NOT SETTLED in the response, based on above rules.'
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

  const config = {
    headers: {
      "content-Type": "application/json",
    },
  };

  // //get response from gemini
  //   let gptResponse = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, data, {
  //     headers: {
  //       'Content-Type': 'application/json'
  //     }
  //   })
  //   .then(response => {
  //     console.log(response.data.candidates[0].content.parts[0].text)
  //     return response.data.candidates[0].content.parts[0].text;
  //   })
  //   .catch(error => {
  //     console.error('Error:', error);
  //   });

  // Analyze current email
  //   const graphAPIAccessToken = await getGraphyToken();
  // console.log(graphAPIAccessToken)

  const gptResponse = await askAI(data, apiKey);
  // console.log(gptResponse);

  // //get keywords and summary from current email
  const currentIssueKeywords = await analyzeCurrentEmail(emailBody.value, apiKey);
  const ke = await currentIssueKeywords.keywords;
  const su = await currentIssueKeywords.summary;
  // console.log(ke);


  //get access token to cll ms grph api
  let graphAPIAccessToken = await getGraphyToken();

  const keywords = Object.keys(ke);
  console.log(keywords);

  let allSearchResults = await Promise.all(
    keywords.map((keyword) => {
      return searchEmails(graphAPIAccessToken, [keyword]).catch((e) => {
        console.log("tolerable Error reading mails api", e);
        return [];
      });
    })
  ).then((results) => {
    let good = results.flat().filter((o) => o?.id != undefined);
    console.log("results.flat()", good);
    const map = new Map();
    for (let i = 0; i < good.length; i++) {
      map.set(good[i].id, good[i]);
    }
    console.log("map.len", map.size);
    return Array.from(map.values());
  });

  // const searchResult = await searchEmails(graphAPIAccessToken,combineKeywords);
  // // Process the aggregated results to find the most relevant ones

  console.log(allSearchResults);

  //find similar search
  // const similarIssue = await searchBox(currentIssueKeywords);
  // console.log(similarIssue);


  let insertAt = document.getElementById("item-subject");
  insertAt.appendChild(document.createElement("br"));

  var div = document.createElement("div");
  // div.innerHTML = `<div style='width:250px;'>${result.response.text()}</div>`
  div.innerHTML = `<div style='width:250px;'>${gptResponse.replace("```html", "").replace("```", "")}</div>`;
  insertAt.appendChild(div);


  var div2 = document.createElement("div");
  // div.innerHTML = `<div style='width:250px;'>${result.response.text()}</div>`
  div2.innerHTML = `<ul style='width:250px;'>${allSearchResults.map(mail=>`<li>${mail.subject}</li>`).join("<br/>") }</ul>`;  
  insertAt.appendChild(div2);
  
clearInterval(timerInterval);
  running.innerText = "";
}

async function askAI(data, apiKey) {
  return await axios
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
    });
}

export async function run() {
  /**
   * Insert your Outlook code here
   */

  const running = document.getElementById("run");
  running.innerText = "Analyzing...";

  const item = Office.context.mailbox.item;
  console.log(Office.context.mailbox.item.conversationId);
  // id :

  const emailBody = await new Promise((resolve, reject) => {
    item.body.getAsync(Office.CoercionType.Text, resolve);
  });

  let prefix = `Tell me action items in short pointers from below email msg, output ur repose as html: `;
  prefix = "";
  //chatgpt i/p
  let data = JSON.stringify({
    text: `${prefix}${emailBody.value}`,
    options: {
      conversationId: "c_6b93fe555b8cdf01",
    },
  });
  // generates button: c_2c1d6d164526e4cd
  // generates pattern: c_449f0295901e0e93

  //config
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "/query",
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9,de;q=0.8",
      "cache-control": "no-cache",
      "content-type": "application/json",
      cookie:
        "_ga=GA1.1.274938184.1694205355; _ga_R1FN4KJKJH=GS1.1.1703357946.3.1.1703358770.0.0.0; _ga_MH88ELNX5E=GS1.1.1714573613.17.1.1714573660.0.0.0",
      pragma: "no-cache",
      priority: "u=1, i",
      "sec-ch-ua": '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
    },
    data: data,
  };

  let gptResponse = await axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response.data.response;
    })
    .catch((error) => {
      console.log(error);
      return JSON.stringify(error?.response?.data) || error.message;
    });

  let insertAt = document.getElementById("item-subject");
  insertAt.appendChild(document.createElement("br"));

  

  var div = document.createElement("div");
  div.innerHTML = `<div style='width:250px;'>${gptResponse.replace("```html", "").replace("```", "")}</div>`;
  insertAt.appendChild(div);

clearInterval(timerInterval);

  running.innerText = "";
}

// async function searchBox(query) {
//   const searchEmails = (query) => {
//     return new Promise((resolve, reject) => {
//       Office.context.mailbox.searchEmails(query, (result) => {
//         if (result.status === Office.AsyncResultStatus.Succeeded) {
//           console.log(result);
//           console.log(`Search result for query "${query}":`, result.value);
//           resolve(result.value);
//         } else {
//           reject(result.error);
//         }
//       });
//     });
//   };

//   return await searchEmails(query);
// }

//search graphAPI


async function searchEmails(accessToken, searchQueryArr) {
  let query = searchQueryArr
    .map((kw) => {
      return `((subject:${kw}) OR (body:${kw}))`;
    })
    .join(" OR ");
  console.log("searchQueryArr", query);

  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://graph.microsoft.com/v1.0/me/messages?$search=%22${encodeURIComponent(query)}%22`,
    headers: {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9,mr;q=0.8,kn;q=0.7",
      authorization: `Bearer ${accessToken}`,
      "cache-control": "no-cache",
      "client-request-id": "54e3ac7c-859b-4a2a-eb11-a2631e7232c8",
      origin: "https://developer.microsoft.com",
      pragma: "no-cache",
      prefer: "ms-graph-dev-mode",
      priority: "u=1, i",
      referer: "https://developer.microsoft.com/",
      sdkversion: "GraphExplorer/4.0, graph-js/3.0.7 (featureUsage=6)",
      "sec-ch-ua": '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
    },
  };

  return axios
    .request(config)
    .then((response) => {
      console.log("graph.microsoft.com", response.data.value);
      return response.data.value.map((v) => {
        return { searchQueryArr, id: v.id, subject: v.subject, body: v.body.content };
      });
    })
    .catch((error) => {
      console.log("graph.microsoft.com", error);
      return undefined;
    });

  // console.log(searchQuery);
  // const searchQueryA="issue with settlement of order";
  // try {
  //   const response = await axios.get(
  //     `https://graph.microsoft.com/v1.0/me/messages?$filter=contains(subject,'${searchQuery}')`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //         'Content-Type': 'application/json',
  //       },
  //     }
  //   );
  //   console.log(response.data.value);
  //   return response.data.value; // Returns the list of messages
  // } catch (error) {
  //   console.error('Error searching emails:', error);
  //   throw error;
  // }
}

async function analyzeCurrentEmail(emailBody, apiKey) {
  const data = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Extract keywords and summarize the following email content:\n${emailBody}`,
          },
        ],
      },
    ],
    systemInstruction: {
      role: "user",
      parts: [
        {
          text: "Extract and return the 5 most important keywords or phrases and a summary of the email.",
        },
      ],
    },
  };

  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const parts = response.data.candidates[0].content.parts;
  const text = parts[0].text;
  const keywordSection = text.split("## Summary:")[0].trim();
  const summarySection = text.split("## Summary:")[1].trim();
  // console.log(parts)
  // const keywords = parts[0].text.split("\n").filter((line) => line.trim() !== "");
  // const summary = parts[1].text;
  console.log(keywordSection);
  console.log(summarySection);
  return {
    keywords: extractKeywords(keywordSection),
    summary: summarySection,
  };
}

async function extractKeywords(text) {
  return text.split("\n").reduce((acc, line) => {
    const keyword = line.trim();
    if (keyword) acc[keyword] = true;
    return acc;
  }, {});
}

