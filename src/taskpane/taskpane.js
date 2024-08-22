import { PromptService } from "../service/promptService";
import { checkIsAgreement, extractAgreedValue } from "./agreement";
import { LLMApi } from "./common/llm";
import { HtmlLogger } from "./common/logging";
import { EmailCleaner, OfficeUtils } from "./common/office";
import { checkForMismatches, detectDisagreedCaclTable } from "./disagreement";
import MockSor from "./mock/mismatch/sor.json";

const axios = require("axios");
const promptSer = new PromptService();
Office.onReady((info) => {
  if (info.host === Office.HostType.Outlook) {
    document.getElementById("sideload-msg").style.display = "none";
    document.getElementById("app-body").style.display = "flex";
    var isRun = false;
    function onClick() {
      if (isRun) {
        return;
      }
      isRun = true;
      init().finally(() => {
        isRun = false;
      });
    }
    document.getElementById("run").onclick = onClick;
  }
});

export async function init() {
  HtmlLogger.startTimer();

  const currentEmailSender = await OfficeUtils.getCurrentEmailSender(); 
  OfficeUtils.get
  console.log(currentEmailSender)
  const currentEmailStr =
    `<b>From:</b><a>${currentEmailSender}</a>` + (await OfficeUtils.getCurrentEmailAsHtmlString());

  const ragHelper = new EmailCleaner();

  const cleanedHtml = ragHelper.cleanHtml(currentEmailStr);

console.log(cleanedHtml);

  const emailsArr = ragHelper.splitEmailThread(cleanedHtml).map(ragHelper.extractEmailDetails);
  console.log(emailsArr)

  const allTables = emailsArr.map((e) => {
    let table = ragHelper.parseTable(e.emailHtml);
    return { party: e.party, data: table };
  });

  // HtmlLogger.setStatus("Analyzing e-mail thread for agreement...");
  const [agreementResponse, summary, agreedValue] = await Promise.all([
    checkIsAgreement(emailsArr),
    LLMApi.summarizeThread(emailsArr),
    extractAgreedValue(emailsArr),
  ]);

  const AGREEMENT = "SG and Client both are in mutual agreement";
  const NON_AGREEMENT = "SG and Client both are not in agreement";
  if (!agreementResponse.includes("not_agreed")) {
    let outputHtml = `
      <p>
      <h4>Summary:</h4>
      ${summary}
      </p>
      ${HtmlLogger.okHead(AGREEMENT)}
      <h4>Actions:</h4>
        <button onClick='window.open("/assets/pay.html?agreedValue=${encodeURIComponent(agreedValue)}");' style='background-color:green;color:white;padding:10px;border-radius:10px;width:100%'>Settle</button>
      </p>
    `;
    HtmlLogger.setOutput(outputHtml);
  } else {
    const dataInCurrentEmail = allTables[0]?.data;
    console.log(emailsArr[0]);
    // const conflictTable = await detectDisagreedCaclTable(emailsArr[0]);
    const conflictTable = promptSer.detectDisagreedCaclTablePrompt(emailsArr[0]);
    const conflictTableData = ragHelper.parseTable(conflictTable, null, 2);
    const mismatches = await checkForMismatches(conflictTableData, MockSor);
    const mismatchJson = HtmlLogger.extractJSONFromMarkdown(mismatches)[0];

    let outputHtml = `
    <p>
    <h4>Summary:</h4>
        ${summary}
    </p>
        ${HtmlLogger.notOkHead(NON_AGREEMENT)}
    <h4>Conflicts:</h4>
        ${HtmlLogger.generateTableFromJSON(mismatchJson)}
    </p>
  `;
    HtmlLogger.setOutput(outputHtml);
  }
  HtmlLogger.setStatus("");
  HtmlLogger.stopTimer();
}