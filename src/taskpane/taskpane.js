import { getAccessToken } from "../auth/auth";
import { getGraphAccessToken, getGraphyToken } from "../auth/graph";
import { cleanHtml, parseTable, findMismatches, filterNonGmailEmails, processEmailChain } from "../util/utili";

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
  let insertAt = document.getElementById("item-subject");

  const running = document.getElementById("run");
  running.innerText = "Analyzing...";

  //show time take to provide response
  const timerDisplay = document.getElementById("timer");
  let startTime = Date.now();
  // Update timer every second
  let timerInterval = setInterval(() => {
    const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
    timerDisplay.innerText = `You Waited : ${elapsedTime}s`;
  }, 10);

  // outlook mailbox
  const item = Office.context.mailbox.item;

  const emailBody = await new Promise((resolve, reject) => {
    item.body.getAsync(Office.CoercionType.Html, resolve);
  });

  console.log(emailBody.value);
  const clean_html = cleanHtml(emailBody.value);
  console.log(clean_html);

  // Function to get the HTML body of the current email
  function getCurrentMailBody() {
    Office.context.mailbox.item.body.getAsync("html", function (result) {
      if (result.status === Office.AsyncResultStatus.Succeeded) {
        // Successfully retrieved the HTML body
        console.log("HTML Body:", result.value);

        // You can now process the HTML body as needed
        processEmailBody(cleanHtml(result.value));
      } else {
        // Error retrieving the HTML body
        console.error("Error retrieving the HTML body:", result.error);
      }
    });
  }

  // Function to process the email body (example placeholder)
  function processEmailBody(htmlBody) {
    // Example processing of the email body
    console.log("Processing email body:", htmlBody);
    // const r = extractLatestEmail(htmlBody);
    // console.log(r);
  }

  // Ensure Office.js is ready before calling getCurrentMailBody
  Office.onReady(function (info) {
    if (info.host === Office.HostType.Outlook) {
      // Call the function to get the current mail body
      getCurrentMailBody();
    }
  });

  // if (true) {
  //   // TODO: extract emails only FROM CLIENT

  //   let html = cleanHtml(emailBody.value);
  //   const mismatch_result = findMismatches(html);
  //   console.log(mismatch_result);

  //   var div = document.createElement("div");
  //   // div.innerHTML = `<div style='width:250px;'>${result.response.text()}</div>`
  //   div.innerHTML = `<textarea style='width:250px;'>${html}</textarea>`;
  //   insertAt.appendChild(div);
  //   return;
  // }

  const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");

  const apiKey = "AIzaSyDMpSIwNqmU3XmYcrl3RsRqQkOAVgQal-o";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

  const data = {
    contents: [
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
          text: 'Look for AGREEMENT OR DISAGREEMENT FROM ANY PARTY AND MENTION IN THE OUTPUT\n If AGREED : Show "settled"\n If NOT AGREED : show "Not Settled"',
        },
        {
          text: "If AGREED or SETTLED : show a action button with above instructions",
        },
        {
          text: 'If NOT AGREED : show "NOT SETTLED" with grey button',
        },
        {
          text: "IT IS MANDATORY TO SHOW FINAL RESPONSE ON AGREEMENT FROM CLIENT IF AVAILABLE",
        },
        {
          text: "IT IS MANDATORY TO SHOW SETTLED OR NOT SETTLED in the response, based on above rules.",
        },
        {
          text: "For each case create settled or not settled button immediately after it in summary",
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
  ).then((res) => {
    let good = res.flat().filter((o) => o?.id != undefined);
    console.log("res.flat()", good);
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

  insertAt.appendChild(document.createElement("br"));

  var div = document.createElement("div");
  // div.innerHTML = `<div style='width:250px;'>${result.response.text()}</div>`
  div.innerHTML = `<div style='width:250px;'>${gptResponse.replace("```html", "").replace("```", "")}</div>`;
  insertAt.appendChild(div);

  var div2 = document.createElement("div");
  // div.innerHTML = `<div style='width:250px;'>${result.response.text()}</div>`
  div2.innerHTML = `<ul style='width:250px;'>${allSearchResults.map((mail) => `<li>${mail.subject}</li>`).join("<br/>")}</ul>`;
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

//get keywords/phrase
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
