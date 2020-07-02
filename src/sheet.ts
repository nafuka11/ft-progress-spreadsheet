import { fetchProjectInfo } from "./ft";
import { ProjectInfo } from "./projectInfo";

/**
 * spreadsheetにproject情報を書き込む
 *
 * @export
 * @param {string} token 42API token
 */
export function writeProgress(token: string) {
  // spreadsheetを取得
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  // projectidのリストを取得
  const projectIds = fetchProjectIds(spreadsheet);

  let projectInfos = [];
  for (const id of projectIds) {
    projectInfos.push(fetchProjectInfo(id, token));
  }
  insertProjectInfo(spreadsheet, projectInfos);
}

/**
 * project情報を1行挿入する
 *
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} spreadsheet
 * @param {Array<ProjectInfo>} projectInfos project情報のリスト
 */
function insertProjectInfo(
  spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet,
  projectInfos: Array<ProjectInfo>) {
  const progressSheet = spreadsheet.getSheetByName("progress");

  progressSheet.insertRows(3, 1);
  let insertData = [];
  for (const projectInfo of projectInfos) {
    insertData.push(projectInfo.validated, projectInfo.submitted, projectInfo.subscribed);
  }
  const now = new Date();
  const dateStr = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`;

  progressSheet.getRange(3, 1).setValue(dateStr);
  progressSheet.getRange(3, 2, 1, insertData.length).setValues([insertData]);

  Logger.log(`inserted: ${dateStr} ${insertData}`);
}

/**
 * projectsシートからproject idのリストを取得する
 *
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} spreadsheet
 * @returns {Array<number>} project idのリスト
 */
function fetchProjectIds(
  spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet): Array<number> {
  const projectsSheet = spreadsheet.getSheetByName("projects");

  let row = 2;
  let ids = [];
  while (true) {
    const id = projectsSheet.getRange(row, 1).getValue();
    if (!id) {
      break;
    }
    ids.push(id);
    row++;
  }
  Logger.log(`project ids: ${ids}`);
  return ids;
}
