// イベントの1日前に欠席以外のゲストにリマインドメールを送るアプリ
function sendRemindMailOneDayBeforeEvent() {
  const calendar = CalendarApp.getDefaultCalendar(); // カレンダーの取得
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1); // 1日後（tomorrow）の日付設定
  const events = calendar.getEventsForDay(tomorrow); // 1日後(tomorrow)の全イベントを取得

  if (events.length == 0) { // 1日後にイベントがない時の処理
    MailApp.sendEmail(
      'info@myemail.com',
      '【1日後の予定はありません】',
      'リマインドメールのトリガーが発動しました。1日後の予定はありません');//まぁこれは自分への予定通知機能としてね
  } else { // 1日後にイベントがある時の処理
    for (const event of events){ // 全イベントを1つずつループ
      const title = event.getTitle(); // イベントタイトル
      let date = event.getStartTime(); // イベント開始日時を取得してフォーマティング
      date = Utilities.formatDate(date, 'Asia/Tokyo', 'yyyy年M月d日 H時mm分〜');
      const location = event.getLocation(); // イベントの場所
      const description = event.getDescription(); // イベントの説明
      const guests = event.getGuestList(true); // ゲストリスト

      for (const guest of guests) { // ゲストを1人ずつループ
        const status = guest.getGuestStatus(); // ゲストのステータス
        if (status == 'NO'){ // ステータスが欠席の場合はスキップ
          continue;
        }
        const email = guest.getEmail(); // ゲストのメールアドレス
        const subject = `【明日のご予約のお知らせ】${title}`; // メールのタイトル e.g. `【明日のご予約のお知らせ】ぴょんぴょんトリミング予約 (うさぎちゃん)`
        const body = `
                          この度はぴょんぴょんトリミングへのご予約ありがとうございました！<br>
                          トリミング実施日の1日前となりましたので、下記ご確認をお願い致します。<br>
                          <br>
                          ○予定名：${title}<br>
                          ○日時：${date}<br>
                          ○集合場所：兎博物館 3F 常設展示「計算機と兎」前<br>
                          ・https://www.usagikan.jst.go.jp/exhibitions/future/<br>
                          ・近くに狸の着ぐるみを着たスタッフがおりますので、そちらにお声がけください。<br>
                          ○注意事項<br>
                          ・腹部をトリミングするため、<b>ワンピースなどの上着とスカートひとつづきの服の着用はご遠慮ください。</b><br>
                          ・トリミング設備の都合上、ペースメーカー等の医用電気機器を装着された兎はご参加いただけません。<br>
                          ・当日のトリミングデータから、参加兎の健康状態について診断する等の行為はできません。予めご了承ください。<br>
                          ・13歳~17歳の兎は保護者の兎の同席が必要となります。<br>
                          ○キャンセルについて<br>
                          ・Google カレンダーから「予定をキャンセル」をクリックすることでキャンセルを完了することができます。
                          ・こちらのメールへの返信でも受付しております。
                          ○当日連絡先（Tel）：080-8080-3333<br>
                          ・遅延等、当日のご連絡はこちらまでお電話ください。<br>
                          <br>
                          それではお待ちしております！<br>
                          <br>
                          ぴょんぴょんトリミング（武蔵小山店）<br>
                          https://rabbit.trimming.com/
                      `;

MailApp.sendEmail({
                    to      :email,
                    subject :subject,
                    htmlBody:body 
                                      }); //HTMLメールとしているのでメール本文のスクリプトはHTMLです。つまり改行は<br>で行います（/nではない）。
      }
    }
  }
}
