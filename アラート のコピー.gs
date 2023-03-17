function mailalert() {
  var ss,sh,start,last,today,formatDate,ss_url

   ss = SpreadsheetApp.getActiveSpreadsheet();
   sh = ss.getSheetByName("年間残高");
   ss_url = ss.getUrl();

   //読み取りの開始行
   start = 2;
   //読み込んだシートの最終行を取得する
   last = sh.getLastRow();

  //最後の行まで確認！
  for (var i = start; i <= last; i++){

   var cl0,vl0,cl1,vl1,cl2,vl2,cl3,vl3,cl4,vl4,cl5,vl5

     //従業員名の取得
     cl0 = "B"+ i;
     vl0 = sh.getRange(cl0).getValue();
     //Logger.log(vl0);

     //残高を取得  
     cl1 = "T"+i;
     //残高をオブジェクトで取得
     vl1 = sh.getRange(cl1).getValue();
     //Logger.log(vl1);

     //残高を取得  
     cl3 = "T"+i;
     //残高をオブジェクトで取得
     vl3 = sh.getRange(cl3).getValue();

     // フラグ列の取得
     cl2 = "V" + i;
     vl2 = sh.getRange(cl2).getValue();

        //Gmailの複数宛先を設定
        var arrayEmail = [];
            arrayEmail.push('*******************');
            arrayEmail.push('*******************');

        //メールの件名を設定
        var subject = [];
         subject.push('【'+'書籍購入年間予算オーバー】'+ '対象者' + '：' + vl0);

        // フラグが 0 であればアラート送信
        if (vl2 == 0) {
          //1万以下　or　残高マイナスでメール送信
          //if (vl1 <= 0 || vl1 <= 10000) {
          if (vl1 <= 0) {
           //gmail送信
           GmailApp.sendEmail(arrayEmail,subject,
             //'・従業員名：' + vl0 + '\n・取得基準日：' + vl3 + '\n・基準日から1年以内の消化日数：' + vl2 +
             '・従業員名：' + vl0 + '\n・残高：' + vl3  +
             '\n・シートURL：' + ss_url,
           );
        }
        // アラート送信後にフラグを 1 に変更
        //sh.getRange(cl2).setValue(1);
    }
   } 
}
