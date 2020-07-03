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

  const projectInfos = projectIds.map(id => fetchProjectInfo(id, token))

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
  const insertData = projectInfos.map(p => [p.validated, p.submitted, p.subscribed]);
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

  const row = 2;
  const lastRow = projectsSheet.getRange(row, 1).getNextDataCell(SpreadsheetApp.Direction.DOWN).getRow();
  // read https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat
  const ids = projectsSheet.getRange(row, 1, lastRow - row + 1).getValues().flat();

  Logger.log(`project ids: ${ids}`);
  return ids;
}
