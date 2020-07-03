import { ProjectInfo } from "./projectInfo";

const CAMPUS_ID: number = 26;
const CURSUS_ID: number = 21;
// project開始時刻（2020-06以前にデータが存在するため）
const BEGIN_AT: Date = new Date("2020-06-22T00:00:00.000Z");
const END_AT: Date = new Date("2042-12-31T23:59:59.999Z");

const OAUTH_URL: string = "https://api.intra.42.fr/oauth/token";
const ENDPOINT_URL: string = "https://api.intra.42.fr/v2";

// APIアクセス毎のsleep時間
const SLEEP_MILLISEC: number = 500;

/**
 * 42 APIからtokenを取得する
 *
 * @export
 * @param {string} uid
 * @param {string} secret
 * @returns {string} token
 */
export function fetchToken(uid: string, secret: string): string {
  const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    method: "post",
    payload: `grant_type=client_credentials&client_id=${uid}&client_secret=${secret}`
  };
  const response = UrlFetchApp.fetch(OAUTH_URL, options);
  return JSON.parse(response.getContentText())["access_token"];
}

/**
 * 42 APIからproject情報を取得する
 *
 * @export
 * @param {number} id project_id
 * @param {string} token
 * @returns project情報
 */
export function fetchProjectInfo(id: number, token: string) {
  const url = `${ENDPOINT_URL}/projects/${id}/projects_users` +
    `?filter[campus]=${CAMPUS_ID}` +
    `&filter[cursus]=${CURSUS_ID}` +
    `&range[created_at]=${BEGIN_AT.toISOString()},${END_AT.toISOString()}`;
  const projects = fetchAllResource(url, token);

  const projectInfo: ProjectInfo = {
    validated: 0,
    submitted: 0,
    subscribed: 0
  }
  projects.forEach(
    project => {
      project["validated?"] ? projectInfo.validated++ : null;
      project["final_mark"] !== null ? projectInfo.submitted++ : null;
      projectInfo.subscribed++;
    }
  )
  Logger.log(`id[${id}]: ${JSON.stringify(projectInfo)}`);
  return projectInfo;
}

/**
 * 42 APIからリソースを取得する
 *
 * @param {string} url
 * @param {string} token
 * @returns リソース
 */
function fetchResource(url: string, token: string) {
  Logger.log(`fetch url: ${url}`);
  const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  const response: GoogleAppsScript.URL_Fetch.HTTPResponse = UrlFetchApp.fetch(
    url,
    options
  );
  Utilities.sleep(SLEEP_MILLISEC);
  return JSON.parse(response.getContentText());
}

/**
 * 42 APIから全てのリソースを取得する
 *
 * @param {string} url
 * @param {string} token
 * @returns 全てのリソース
 */
function fetchAllResource(url: string, token: string) {
  let page = 1;
  let accessUrl = `${url}&page[size]=100&page[number]=${page}`;

  let resource = fetchResource(accessUrl, token);
  let resources: Array<Object> = resource;

  while (resource && Object.keys(resource).length == 100) {
    page++;
    accessUrl = `${url}&page[size]=100&page[number]=${page}`;
    resource = fetchResource(accessUrl, token);
    Array.prototype.push.apply(resources, resource);
  }

  Logger.log(`resources.length: ${resources.length}`);
  return resources;
}
