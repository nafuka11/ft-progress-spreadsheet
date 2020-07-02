import { fetchToken } from "./ft"
import { writeProgress } from "./sheet"

function main() {

  Logger.log("** start **");

  // プロパティ取得
  const properties = PropertiesService.getScriptProperties();
  const ftApiUid: string = properties.getProperty("FT_API_UID");
  const ftApiSecret: string = properties.getProperty("FT_API_SECRET");

  // Token取得
  const token = fetchToken(ftApiUid, ftApiSecret);

  // progressをspreadsheetに書き込み
  writeProgress(token);

  Logger.log("** finish **");
}
