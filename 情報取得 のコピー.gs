function getexpense() {

  //freeeAPIからアクセストークンを取得
  const accessToken = getService().getAccessToken();
  //var expense_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("expense");
  var apprequests_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("apprequests");
  
  //最終行取得
  var lr = apprequests_sheet.getLastRow();

  //きれいにします
  apprequests_sheet.getRange(2,1,lr,5).clear();

  //事前申請個別ID格納用
  var approval_id = [];

for ( var i = 0 ; i < 3 ; i++ ){
  const offset = i*500;
    
  const accessToken = getService().getAccessToken();

  //リクエストURL　下のパラメータを変更
  const baseUrl = "https://api.freee.co.jp/api/1/approval_requests";
  const url = baseUrl.concat(
　//事業所IDを入力   
"?company_id=" , "*********",
　//申請のファームIDを入力
"&form_id=" , "*********",
  //offsetは変更しない
"&offset="     , offset,
  //1リクエスト当たりで取得する件数　上限3,000件
"&limit="       , 500 ,   
  );
    
  const options = {"method"  : "get", "headers" : { "Authorization" : "Bearer " + accessToken }};
  const res = UrlFetchApp.fetch( url , options ).getContentText();
  const json = JSON.parse(res)
  
　//resの中から.partnersのプロパティのみ取り出す
  const approval = json.approval_requests;
  console.log(approval[0])

  //3秒待機
  Utilities.sleep(3000);

  //申請の個別IDを取得します
  for ( var j = 0 ; j < approval.length ; j++ ) {
    //var approval_id = approval[j].id
    approval_id.push(approval[j].id);
    //console.log(approval_id)
  };
  
};

  //シート反映用の変数
  var appreq = [];

  //個別の申請から金額等を取得します
  //リクエストURL　下のパラメータを変更
  for ( var b = 0 ; b < approval_id.length ; b++ ) {

    const accessToken = getService().getAccessToken();

    const baseUrl = "https://api.freee.co.jp/api/1/approval_requests/";
    const url = baseUrl.concat(

　  //申請IDを入力  
    + approval_id[b] ,
　  //事業所IDを入力   
    "?company_id=" , "*********",
  );

  const options = {"method"  : "get", "headers" : { "Authorization" : "Bearer " + accessToken }};
  const response = UrlFetchApp.fetch( url , options ).getContentText();
  const jsonappreq = JSON.parse(response);
  const data = jsonappreq;

  //シートに反映
    appreq.push([
      //data.approval_request[j].id,
      data.approval_request.id,
      data.approval_request.applicant_id,
      data.approval_request.title,
      data.approval_request.request_items[1].value,
      data.approval_request.application_date
    ]);
      apprequests_sheet.getRange( 2 , 1 , appreq.length , appreq[0].length ).setValues( appreq );

};

  console.log('レコードはこれ以上ありません');


};