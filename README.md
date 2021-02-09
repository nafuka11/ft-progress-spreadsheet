# ft-progress-spreadsheet

SpreadsheetにProjectの参加人数を追記するGoogle App Scriptです。

各Projectのvalidated, submitted, subscribed人数を追記します。

トリガーで毎日実行されることを想定されています。

## Requirements

- Git
- Node.js
- Googleアカウント
- 42 APIのUID, Secret

## Install

1. リポジトリをclone

   ```
   git clone https://github.com/nafuka11/ft-progress-spreadsheet.git
   ```

1. cloneしたリポジトリのディレクトリに移動し、必要なパッケージをインストール

   ```
   npm install
   ```

1. Googleアカウントのログイン。アカウントを選択し、リクエストを許可する

   ```
   npm run login
   ```

1. https://script.google.com/home/usersettings にアクセスし、`Google Apps Script API`の設定をオンにする

1. Google App Scriptのプロジェクトを新規作成

   ```
   npm run create
   ```

1. ローカルのソースコードをプロジェクトにアップロード

   ```
   npm run push
   ```

1. プロジェクトをブラウザ上で開く

   ```
   npm run open
   ```

1. ファイル > プロジェクトのプロパティから、`スクリプトのプロパティ`を追加する

   | プロパティ | 値 |
   | -- | -- |
   | FT_API_UID | 42 APIのUID |
   | FT_API_SECRET | 42 APIのSecret |

1. 編集 > 現在のプロジェクトのトリガー > 画面右下の「トリガーを追加」ボタンをクリック

   | 選択項目 | 値 |
   | -- | -- |
   | 実行する関数 | main |
   | 実行するデプロイ | Head (デフォルト値) |
   | イベントのソース | 時間主導型 |
   | 時間ベースのタイマー | 日付ベースのトリガー |
   | 時刻 | 午後11時〜午前0時<br /> (計測したい時刻に合わせて適宜変更してください。<br />ただし、timezoneがAmerica/New_Yorkになっているため、日付が一致しない場合にご注意ください) |

   ※トリガー追加時に「このアプリは確認されていません」画面が出ますが、詳細から安全ではないページに移動し、権限を付与してください。
