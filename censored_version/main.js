//Discord CalculationDicerollbot is created by Poteamashusyu.

// Response for Uptime Robot
const http = require('http');
http.createServer(function (request, response) {
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.end('Discord bot is active now');
}).listen(3000);

// Discord bot implements & Constructions
const discord = require('discord.js');
  //@discord.js/opus voice chat node
const { OpusEncoder } = require('@discordjs/opus');

// Create the encoder.
// Specify 48kHz sampling rate and 2 channel size.
const encoder = new OpusEncoder(48000, 2);

/* Encode and decode.
    const encoded = encoder.encode(buffer);
    const decoded = encoder.decode(encoded);
  end*/

  //FFmpeg voice chat node
const pathToFfmpeg = require('ffmpeg-static');
console.log('FFmpeg: ' + 'Start ffmpeg.exe');
  //end
const admin = require('./admin.json');
const config = require('./config.json');
const client = new discord.Client();
const PREFIX = config.prefix;
const fs = require('fs');
const { measureMemory } = require('vm');

const Hiragana = ["あ", "い","う", "え", "お", "か", "き", "く", "け", "こ", "さ", "し", "す", "せ", "そ", "た", "ち", "つ", "て", "と", "な", "に", "ぬ", "ね", "の", "は", "ひ", "ふ", "へ", "ほ", "ま", "み", "む", "め", "も", "や", "ゆ", "よ", "ら", "り", "る", "れ", "ろ", "わ", "を", "ん", "が", "ぎ", "ぐ", "げ", "ご", "ざ", "じ", "ず", "ぜ", "ぞ", "だ", "ぢ", "づ", "で", "ど", "ば", "び", "ぶ", "べ", "ぼ", "ぱ", "ぴ", "ぷ", "ぺ", "ぽ", "っ", "ー"]
const GachaT_time = config.gachaT_TimeMS // Gacha Timely need time(ms)
var Presence_mode = 0; // Bot's presence mode number

/*
//MySQL Cooperation

const mysql = require('mysql');
const { isObject } = require('util');

const SQLconnection = mysql.createConnection({
  host: 'CDbot',
  user: 'Poteamashusyu',
  password: config.mysql_PW,
  database: 'CDdb'
});

SQLconnection.connect((err) => {
  if (err) {
    console.warn('MySQL: error connecting: ' + err.stack);
    console.info('--------------------')
    return;
  }
  console.info('MySQL: connect succeed');
});
//end
*/


// functions(& constants of function)

  //停止用function
function stop(messagechannel) {
  messagechannel.send('ボットを停止します。おやすみなさい...!');
  setTimeout(function(){client.destroy();
  }, 3000);
}
  // end

  //Calculation functions and elements->
function safeEval(val) {
  let temp;
  try {
    temp = Function('return (' + val + ')')();
    return temp;
  } catch {return 'Err';}
} //Great library URL:https://teratail.com/questions/141771#reply-214317
  //-> Calculation f&e's end

const maintenance = false; // If you do maintenance, it makes true.

client.on('ready', function() {

  let turn = 0;
  if(maintenance != true) {
  setInterval(() => {
    let timely_data = Object(JSON.parse(fs.readFileSync('./.data/gacha/timely.txt', (err, data) => {
      if(err) throw err;
    }), 'utf8'))
    let timelydif = Date.now() - timely_data;
    if(Presence_mode == 0) { //default_normal, デフォルト通常モード
      if(3 <= turn) turn = 0;
      if(0 == turn) client.user.setPresence({ activity: { name: '_cd ~ でコマンド実行!(Calculation&Diceroll bot) with discord.js'+` GachaT:${Math.floor(timelydif/600)/100}m` }, status: 'online' });
      else if(1 == turn) client.user.setPresence({ activity: { name: '_cd help でヘルプ!(Calculation&Diceroll bot) with discord.js'+` GachaT:${Math.floor(timelydif/600)/100}m` }, status: 'online' });
      else if(2 == turn) client.user.setPresence({ activity: { name: ''+`[${Math.floor(timelydif/GachaT_time*1000)/10}%]\t${Math.floor(timelydif/600)/100}m/${GachaT_time/60000}m(ガチャタイムリー進捗)` }, status: 'online' });
    }
    if(Presence_mode == 1) { //ガチャタイムリーのみ表示モード
      if(10 <= turn) turn = 0;
      client.user.setPresence({ activity: { name: ''+`[${Math.floor(timelydif/GachaT_time*1000)/10}%]\t${Math.floor(timelydif/600)/100}m/${GachaT_time/60000}m(ガチャタイムリー進捗)` }, status: 'online' });
    }
      turn++;
  }, 6000);

  } else {
    client.user.setPresence({ activity: { name: '-メンテナンス中-(Calculation&Diceroll bot) with discord.js' }, status: 'dnd' });
  }

  console.log('Discord_Calculation&Diceroll bot v' +config.version+ ' is ready!');
});

client.on('message', async message => {
  if(maintenance == true && message.author.bot == false && message.author.id !== config.owner_id) {
    //message.channel.send('---ただ今、メンテナンス中により全機能が使用できません。ご了承ください。---')
    message_log('メンテナンス中')
    return;
  }

  //Console log function
  function message_log(exe_result) {
    let date = new Date()
    console.warn('-' + date.toLocaleTimeString('ja-JP') + '-')
    if (message.channel.type === 'text') { console.log(' サーバー: ' + message.guild.name); } else if (message.channel.type === 'dm') { console.log('DMチャンネルにて送信') }
    console.log(' チャンネル: ' + message.channel.name)
    console.log(' 送信者: ' + message.author.username + ` [${message.author.id}]`)
    console.log(' メッセージ: ' + message.content)
    console.log(' 実行結果: ' + exe_result)
    console.log('')
  }
  //end

  var process_start = Date.now();
  var message_content = message.content.toLowerCase();
  if (message.author == client.user) return;

  //sequelize db Currency system(Deleted)

  //end

  //Actions when bot is mentioned
  if (message.mentions.has(client.user)) {
    let strs = message_content.trim().split(' ');
    let menstr = strs[1], random;
    if(menstr === '時計') menstr = 3;
    else if(message_content.includes('おやすみ') || message_content.includes(':osuyami:')) menstr = 4;
    menstr = Number(menstr)
    if(isNaN(menstr)) random = Math.floor(Math.random() * 4) + 1;
    else random = menstr;
    switch (random) {
      case 1: {
        message.reply('私は現在作成中のダイス計算ボット1号機です!(v' +config.version+ ')')
        message_log('ボットメンションアクション1:自己紹介')
        break;
      }
      case 2: {
        message.reply('用もなしに呼ばないでください。私の貴重な時間が無くなります。')
        message_log('ボットメンションアクション2:怒り')
        break;
      }
      case 3: {
        let today = new Date();
        let Dotw; 
        switch (today.getDay()){
          case 0: {Dotw = '日'; break;} case 1: {Dotw = '月'; break;} case 2: {Dotw = '火'; break;} case 3: {Dotw = '水'; break;} case 4: {Dotw = '木'; break;} case 5: {Dotw = '金'; break;} case 6: {Dotw = '土'; break;}
        }
        message.reply('\n現在の時刻は' + today.getFullYear() + '年 ' + (today.getMonth() + 1) + '月 ' + today.getDate() + '日(' + Dotw + ') ' + today.getHours() + '時' + today.getMinutes() + '分' + today.getSeconds() + '秒' + today.getMilliseconds() + 'ミリ秒')
        message_log('ボットメンションアクション3:時刻表示')
        break;
      }
      case 4: {
        message.reply('さん\nおやすみなさい！ゆっくり休んでくださいね')
        message_log('ボットメンションアクション4:おやすみコール')
        break;
      }
    }
  }
  //end

  //ダイス機能
  var min_strNum = 0, on_dice = false;
  while (message_content.slice(min_strNum).includes('d') == true) {
    let y = message_content.slice(min_strNum).indexOf('d') + min_strNum, dx = 0, dz = 0, dix, diz, x, z;
    do {
      dx--;
      dix = dx + y;
      if (message_content.charAt(dix) == '' || message_content.charAt(dix) == " ") break;
      dix = Number(message_content.charAt(dix))
    } while (isNaN(dix) == false)
    x = dx + y + 1;
    do {
      dz++;
      diz = dz + y;
      if (message_content.charAt(diz) == '' || message_content.charAt(diz) == " ") break;
      diz = Number(message_content.charAt(diz))
    } while (isNaN(diz) == false)
    z = dz + y;
    if (y - x <= 0 || z - y <= 1) {
      min_strNum = y + 1;
      continue;
    }
    let times = Number(message_content.slice(x, y)), param = Number(message_content.slice(y + 1, z)), cg_str = message_content.slice(x, z);
    let result = 0;
    if (times > 100000000) {
      message.channel.send('**※1億回を超えてダイスを振らないでください！**')
      message_log('ダイス制限回数オーバー')
      break;
    }
    for (; times > 0; times--) {
      result += Math.floor(Math.random() * param) + 1;
    }
    result = String(result);
    message_content = message_content.replace(cg_str, result);
    on_dice = true;
  }
  //end

  //joke message and voice
  if (message_content == 'グルメスパイザー') {
    if(message.member.voice.channel){
    var connection = await message.member.voice.channel.join();
    message_log('グルメスパイザー:コール(ボイス有り)')
    connection.play('./image/sounds/gurume_spicer5s.mp3', {volume: 0.5})
    }else{
      message_log('グルメスパイザー:コール(ボイス無し)')
    }

    function gurume(s) {
      return new Promise(function (resolve) {
        setTimeout(resolve, s);
      });
    }

    gurume(0)
      .then(function() {
        message.channel.send('**ポン**')
        return gurume(500)
      })
      .then(function() {
        message.channel.send('**クラッシュ**')
        return gurume(500)
      })
      .then(function() {
        message.channel.send('**クラッシュ！**')
        return gurume(1000)
      })
      .then(function() {
        message.channel.send('**パ、パ、パッ！**')
        return gurume(1000)
      })
      .then(function() {
        message.channel.send('**グルメスパイザー！！！**')
        return gurume(3000)
      })
      .then(function() {
        try{connection.disconnect()}catch(t){}
      })
  }

  if (message_content == '効果音こんにちは') {
    if(message.member.voice.channel) {
      function konnchiwa(Con){
        let i = Math.floor(Math.random() * 9)
        let source = [
        './image/sounds/シャキーン1.mp3',
        './image/sounds/ジャン！.mp3',
        './image/sounds/パフ.mp3',
        './image/sounds/歓声と拍手.mp3',
        './image/sounds/時代劇演出1.mp3',
        './image/sounds/時代劇演出2.mp3',
        './image/sounds/小鼓（こづつみ）.mp3',
        './image/sounds/拍子木1.mp3',
        './image/sounds/文字表示の衝撃音1.mp3']
        Con.play(source[i], {volume: 0.2})
      }

    var connection = await message.member.voice.channel.join();
    message_log('こんにちは:コール(ボイス有り)')
    }else{
      message_log('こんにちは:コール(ボイス無し)')
    }
    message.channel.send('**こ**')
    konnchiwa(connection);
    setTimeout(function () {
      message.channel.send('**ん**')
      konnchiwa(connection);
      setTimeout(function () {
        message.channel.send('**に**')
        konnchiwa(connection);
        setTimeout(function () {
          message.channel.send('**ち**')
          konnchiwa(connection);
          setTimeout(function () {
            message.channel.send('**は**')
            konnchiwa(connection);
            setTimeout(function () {
              try{connection.disconnect()}catch(t){}
            }, 1000);
          }, 1000);
        }, 1000);
      }, 1000);
    }, 1000);
  }

  //node.js fs テスト(不安定)
  if(message_content.slice(0, 2) === "記憶"){
    let S = message_content.split(' ')
    let kioku = S[1]
    fs.unlink('./temps/temp_memo.txt', () =>{
      console.log('---一時MEMOファイルを削除しました---')
      message_log('[テストC] 記憶機能')
    })
    fs.writeFileSync('./temps/temp_memo.txt', kioku)
    message.channel.send(kioku + ' を記憶しました。')
    console.log('---一時MEMOファイルを新規作成し、"' + kioku + '"を書き込みました---')
    message_log('[テストC] 記憶機能')
  }
  if(message_content.slice(0, 2) === '出力'){
    try {
      let yomikomi;
      fs.readFile('./temps/temp_memo.txt', 'utf8', (err, data) =>{
        console.log('---一時MEMOファイルのテキスト"' + data + '"を出力しました---')
        message_log('[テストC] 記憶機能')
        yomikomi = data;
        message.channel.send(yomikomi)
      })
    } catch (error) {
      console.error(error)
      message.channel.send('出力失敗')
    }
  }

  if(message_content === "最初はグー") {
  //let request = new XMLHttpRequest();
    message.channel.send("じゃんけん...")
    message.react('✊')
    message.react('✌')
    message.react('✋')
  }

//end

//------------------------------------ _cd(PREFIX) commands ------------------------------------
  if (message_content.slice(0, PREFIX.length) === PREFIX || on_dice == true) {

  //Tic Tac Toe game
//    if(message_content.slice(0, 11) === '_cd correct'){
//      await if(message_content.slice(0,4) === 'join'){
//        var p1 = message.author;
//      }
//    }
    //end

    if(message_content.slice(3) === '' || message_content.slice(0, 8) === '_cd help') {
      if(on_dice == false) {
        message.channel.send('↓↓↓説明書(作成中)のURL↓↓↓');
        //message.channel.send({
          //files: [{
            //attachment: './manuals/manual.html',
            //name: 'manual.html'
          //}]
        //})
        message.channel.send('https://manualofcanddbyp.blogspot.com/2020/12/blog-post.html')
        message_log('説明書があるURLを送信しました。');
      }
    }
    
    //Calculation program ->
    if (message_content.slice(0, 5) === '_cd c' || on_dice == true) {
      let Calculation = message_content.replace('_cd c ', '');
      while(Calculation.includes('math')) {
        Calculation = Calculation.replace('math', 'Math');
      }
      if(Calculation.includes('^')){
        message.reply('\n**^は現在使用できません。**')
      }else{
        var answer = safeEval(Calculation)
      }
      if (Number.isFinite(answer) || answer === 'Err') {
        let process_end = Date.now();
        message.channel.send('**`' + answer + '`** = ' + Calculation + ' `処理時間:' + ((process_end - process_start) / 1000) + 's`')
        message_log('計算、ダイス結果、' + Calculation + ' = *' + answer + ' 処理時間:' + (process_end - process_start) + 'ms')
      }
    }
    //-> Calculation program end

    if (message_content === '_cd ping') {
      let ping = client.ws.ping;
      message.channel.send('pong! ' + '`' + ping + 'ms`')
      message_log('ピン！ポン！' + ' ' + ping + 'ms')
    }

    if (message_content.slice(0, 11) == '_cd riabaku') {
      let S = message_content.split(' ', 5);
      let ria_countC, ria_countP;
      switch (S.length) {
        case 2: {
          ria_countC = 1;
          ria_countP = 10000;
          break;
        }
        case 3: {
          ria_countC = 1;
          ria_countP = Math.round(S[2]);
          break;
        }
        case 4: {
          ria_countC = Math.round(S[2]);
          ria_countP = Math.round(S[3]);
          break;
        }
      }
      if (S.length > 4) {
        ria_countC = 'コマンド';
        ria_countP = 'コマンドミス';
      }
      var ria_random = Math.floor(Math.random() * ria_countP) + 1;
      if (ria_random <= ria_countC) {
        message.reply(':fire: :bomb: :boom:リア充が爆発しました！:boom: :bomb: :fire: (' + ria_random + '/' + ria_countP + ')');
        message_log('リア爆結果、成功 ' + ria_random + '<=' + ria_countC + '/' + ria_countP);
      } else {
        message.channel.send(':shower: リア充爆発に失敗しました...(' + ria_random + '/' + ria_countP + ') :shower:');
        message_log('リア爆結果、失敗 ' + ria_random + '>' + ria_countC + '/' + ria_countP);
      }
    }
    //server same mute
    if(message.channel.type === 'text') {
      if (message.member.voice.channel) {
        let A_id = admin.Admin_id;
        let A_test = (element) => element === message.member.id;
        if (message.member.permissions.has('ADMINISTRATOR', true) == true || A_id.some(A_test) == true) {
          let Vusers = message.member.voice.channel.members;
          if (message_content.slice(0, 8) === '_cd mute' || message_content.slice(0, 6) === '_cd mt') {
            await Vusers.each(use_r => {
              if (!use_r.voice.mute && !use_r.user.bot) {
                use_r.voice.setMute(true)
              }
            })
            message.channel.send('一斉ミュートを適用しました。(ボット除く)')
            message_log('ボイスチャンネル一斉ミュート適用(ボット除く)')
          }
          if (message_content.slice(0, 10) === '_cd unmute' || message_content.slice(0, 7) === '_cd umt') {
            Vusers.each(use_r => {
              use_r.voice.setMute(false)
            })
            message.channel.send('一斉ミュートを解除しました。')
            message_log('ボイスチャンネル一斉ミュート解除')
          }
        }
      }
    }
    //end

    //Lottery system
    if(message_content.slice(0, 11) === '_cd lottery' || message_content.slice(0, 7) === '_cd lot'){
      let address = './temps/lottery/' + message.guild.name + '.json';
      try {
        fs.accessSync(address, fs.constants.F_OK)
      } catch {
        fs.copyFileSync('./.data/.InitialData/lottery_input.json', address)
      }

      let S = message_content.split(' ')
      let Author = message.member.nickname;
      let data = Object(JSON.parse(fs.readFileSync(address, (err, datas) => {
        if(err) throw err;
      }), 'utf8'))

      if(S[2] == undefined){
        message.channel.send(undefined, {
          embed: {
            color: "#4169e1",
            title: "おみくじコマンド`_cd lottery(lot) ...`",
            description: "`join [任意の名前]`: 抽選に参加\n`list`: エントリーリストを表示\n`remove [番号/名前]`: 番号か名前を指定してエントリーを取消\n`reset(del)`: くじ引きをリセット\n`start [当選人数]`: くじ引き抽選開始(当選人数デフォ:1)"}})
        message_log('くじ引きの説明をチャットしました。/おみくじデータを作成しました。')
      }
      //サーバー全員指定は出来なさそう
      
      if(S[2] === 'join'){

        let text = {};
        try {
          var Ova = Object.values(data.entry);
        } catch {}
        let name;
        if(S[3] !== undefined) {
          name = S[3];
        } else {
          name = Author;
        }

        if(Ova.includes(name)) {
          text.entry = Ova
          message.channel.send('**※あなたはすでに抽選に参加しています。**')
          message_log('くじ引き参加: 失敗(すでに登録済み)')
        } else {
          text.entry = Ova.concat(name)
          /*
          let r;
          if(isNaN(S[3])){r = 1;}else{r = Number(S[3])}
          text.entry.Author = this.rate = r;
          */
          if(S[3] !== undefined) {
            message.channel.send(`「${S[3]}」を抽選に参加させました。`)
            message_log('くじ引き参加: 成功(カスタム)')
          } else {
            message.reply('抽選に参加しました。')
            message_log('くじ引き参加: 成功(自身)')
          }
        }
        fs.writeFileSync(address, JSON.stringify(text))
      }

      if(S[2] === 'list'){
        let list = "", n=0;
        data.entry.forEach(element => {
          n++;
          list = list + `${n}. ` + element + '\n';
        })
        if(n == 0) list = "※誰も参加していません"
        message.channel.send(undefined, {
          embed: {
            color: "#4169e1",
            title: "エントリーリスト",
            description: list}})
        message_log('くじ引きのエントリーリストをチャットしました。')
      }

      if(S[2] === 'start') {
        let list = Object.values(data.entry);
        let winning = [];
        let winnum = 1;
        if(isNaN(Number(S[3])) == false) winnum = Number(S[3]);
        if(winnum > 20) winnum = 1;
        for(let i=1; i <= winnum; i++){
          let n = Math.floor(Math.random() * list.length)
          winning.push(list[n])
          list.splice(n, 1)
        }
        let winmes = '';
        winning.forEach(element => winmes += element + '\n')
        message.channel.send(undefined, {
          embed: {
            color: "#ffd700",
            title: ":crown:くじ引き結果:crown:",
            description: "当選者はこちら...\n\n**" + winmes + "**\n一人当たりの当選確率:`"+(Math.floor(winnum /(winnum + list.length) * 10000) / 100)+"%`"}})
        message_log('くじ引きの結果をチャットしました。')
      }

      if(S[2] === 'del' || S[2] === 'reset') {
        fs.unlink(address, (err) => {
          
        })
        message.channel.send('くじ引きをリセットしました。')
        message_log('くじ引きのエントリーリストを削除しました。')
      }
      
      if(S[2] === 'remove') {
        let list = [];
        data.entry.forEach(element => {
          list = list.concat(element)
        })
        if(isNaN(S[3])) {
          if(list.includes(S[3])) {
            message.channel.send('エントリーリストから「'+ S[3] + '」を取り消しました。')
            message_log('くじ引き参加取り消し: 成功(名前取り消し)')
            list.splice(list.indexOf(S[3]), 1)
          } else {
            if(S[3] == undefined) {
              message.channel.send('**※取り消したい名前もしくは番号を入力してください。**')
              message_log('くじ引き参加取り消し: 失敗(入力なし)')
            } else {
              message.channel.send('**※そのような名前はエントリー(参加)していません。**')
              message_log('くじ引き参加取り消し: 失敗(名前該当なし)')
            }
          }
        } else {
          if(1 <= Number(S[3]) && Number(S[3]) <= list.length) {
            message.channel.send('エントリーリストから「'+ list[Number(S[3])-1] + '」を取り消しました。')
            message_log('くじ引き参加取り消し: 成功(番号取り消し)')
            list.splice(Number(S[3])-1, 1)
          } else {
            message.channel.send('**※その番号でエントリー(参加)したものが見つかりませんでした。**')
            message_log('くじ引き参加取り消し: 失敗(番号該当なし)')
          }
        }
        let text = {};
        text.entry = list;
        fs.writeFileSync(address, JSON.stringify(text))
      }
    }
    //end

    //おまけガチャ
    if(message_content.slice(0, 9) === '_cd gacha'){
      let Author = message.author.username;
      let coins_ad = './.data/gacha/has_coins/coin_data.json';
      let users_ad = './.data/gacha/users/' + Author + '.json';
      let timely_ad = './.data/gacha/timely.txt';
      let S = message_content.split(' ')

      try {
        fs.accessSync(coins_ad, fs.constants.F_OK)
      } catch {
        fs.copyFileSync("./.data/.InitialData/gacha_coins_data.json", coins_ad)
      }
      try {
        fs.accessSync(users_ad, fs.constants.F_OK)
      } catch {
        fs.copyFileSync("./.data/.InitialData/gacha_users.json", users_ad)
      }

      let coin_data = Object(JSON.parse(fs.readFileSync(coins_ad, (err, data) => {
        if(err) throw err;
      }), 'utf8'))
      let coin_Init = Object(JSON.parse(fs.readFileSync("./.data/.InitialData/gacha_coins.json", (err, data) => {
        if(err) throw err;
      }), 'utf8'))
      let user_data = Object(JSON.parse(fs.readFileSync(users_ad, (err, data) => {
        if(err) throw err;
      }), 'utf8'))
      let timely_data = Object(JSON.parse(fs.readFileSync(timely_ad, (err, data) => {
        if(err) throw err;
      }), 'utf8'))
      
      let test = (element) => Author === element.name;
      if(coin_data.datas.some(test) == false) {//新規コインデータ作成
        coin_Init.name = Author;
        coin_data.datas.push(coin_Init)
      }
      //送信者のデータ取得
      let Acdn = coin_data.datas.findIndex(element => Author === element.name); //Acdn =Author's_coin_data_number

      //ガチャラインナップデフォルト
      if(coin_data.datas[Acdn].select_lineup_Num == undefined) {
        coin_data.datas[Acdn].select_lineup_Num = 0; //nシーズン前
      }

      //ガチャラインナップJSON
      const LA = 3; // Lineup_Amount
      let Gacha_lineup;
      //let AE_ad, AEmes_ad; // AE(Award&Event)
      switch (LA - coin_data.datas[Acdn].select_lineup_Num) { // use_lineup
        case 3: {
          Gacha_lineup = Object(JSON.parse(fs.readFileSync("./.data/gacha/.lineups/[S3]Great******_gacha.json", (err, data) => {
            if(err) throw err;
          }), 'utf8'))
          break;
        }
        
        case 2: {
          Gacha_lineup = Object(JSON.parse(fs.readFileSync("./.data/gacha/.lineups/Goopix******_gacha.json", (err, data) => {
            if(err) throw err;
          }), 'utf8'))
          break;
        }
        
        case 1: {
          Gacha_lineup = Object(JSON.parse(fs.readFileSync("./.data/gacha/.lineups/Gachi******_gacha.json", (err, data) => {
            if(err) throw err;
          }), 'utf8'))
          //AE_ad = "./.data/gacha/.lineups/lineup_modules/Gachi******_gacha_A&E";
          //AEmes_ad = "./.data/gacha/.lineups/lineup_modules/Gachi******_gacha_A&Emes";
          break;
        }
        
        default: {
          Gacha_lineup = Object(JSON.parse(fs.readFileSync("./.data/gacha/.lineups/Goopix******_gacha.json", (err, data) => {
            if(err) throw err;
          }), 'utf8'))
          break;
        }
      }

      //const { common_event, local_event, award_item } = require(AE_ad);
      //const event_mes = require(AEmes_ad);

      //送信者に予備コイン(reserve_c)の情報追加
      if(coin_data.datas[Acdn].reserve_c == undefined) coin_data.datas[Acdn].reserve_c = 0;

      //送信者のユーザーデータ:アイテム全てにタグ配列追加
      user_data.items.forEach(element => {
        if(element.tag == undefined) element.tag = [];
      });
      
      //送信者のオンライン時刻データ更新
      coin_data.datas[Acdn].onlineD = Date.now();
      
      //送信者の所持アイテムの名前をリスト化
      let has_items = [];
      user_data.items.forEach(element => {
        has_items.push(element.name);
      })

      //雪倉シャスティフォル>>>霊槍シャスティフォル
      user_data.items.forEach(element => {
        if(element.name === '雪倉シャスティフォル') {
          element.name = '霊槍シャスティフォル';
        }
      });
      user_data.items.forEach(element => {
        if(element.name === '***の愛人 ***') {
          element.name = 'エペトラヒロイン ***';
        }
      });

      //タグ消去処理
      function rem_tag(obj, tags) { // remove tags (object, [tags])
        if(obj.tag == undefined) obj.tag = [];
        tags.forEach(element => {
          let n = obj.tag.indexOf(element);
          if(n >= 0) {
            obj.tag.splice(n, 1)
          }
        })
        if(obj.tag.length == 0) obj.tag = [];
        return obj;
      }
      //end

      //褒賞アイテム処理
      let CI = 0, awaev = []; //has_items, Check_Item(amount), award_event
      function AwardJ(item, ci, need, event) { // Award Judging (獲得アワードアイテム, 該当アイテム個数, 必要アイテム数, イベントナンバー)
        if(ci >= need && !(has_items2.includes(item))) {
          let getA = {};
          let n = Gacha_lineup.goods.findIndex(element => element.name === item);
          getA = Object.assign(getA, Gacha_lineup.goods[n]);
          delete getA.percent;
          getA = rem_tag(getA, [ 'namehide', 'rarehide', 'perhide' ])
          user_data.items = user_data.items.concat(getA);
          awaev.push(event)
        }
      }
      //end

      if(S[2] === 'help') {
        message.channel.send(undefined, {
          embed: {
            color: "#00ff00",
            title: "ガチャコマンド`_cd gacha ...`",
            description: "`(入力無し)or[1~10の数字]`: ガチャを引く\n`(タイムリーボーナス)`: ガチャを使うとたまにもらえるコインボーナス\n`coin`: 自身の所持コイン枚数を表示\n`detail(det)`: ガチャの詳細を確認できます。\n`has [ページ数]`: 自身が持っているガチャアイテムを表示\n`help`: このコマンドリストを表示\n`lineup <戻すシーズン数>`: ガチャのラインナップを変更"}})
        message_log('ガチャの説明をチャットしました。/ガチャのユーザー・コインデータを作成しました。')
      }

      if(S[2] == undefined || !isNaN(S[2]) || S[2] === 'c') {
        var use_coins = 10; //使用コイン枚数
        // let Uoutput = {}; Coutput = {}, があった
        let add_event = 0; //追加イベント番号定義
        let G_num = 0; //ガチャ回数
        let result = ''; //ガチャ結果メッセージ
        let upperUR = 0; //UR以上獲得枚数
        if(1 <= Number(S[2]) && Number(S[2]) <= 10) {
          G_num = Math.floor(Number(S[2]));
        } else {
          G_num = 1;
        }
        if(coin_data.datas[Acdn].coins >= use_coins * G_num) {
          for(let i=0; i < G_num; i++) {
          let D1000000 = (Math.floor(Math.random() * 1000000) + 1) / 10000;
          if(message.author.id === config.owner_id && S[2] === 'c') { //ボットオーナー専用確率操作コマンド
            D1000000 = Number(S[3]);
          }
          let pl = 0, get = {}, testPer;
          Gacha_lineup.goods.forEach(element => {
            testPer = element.percent;
            if(pl < D1000000 && D1000000 <= testPer + pl) {//当選処理
              Object.assign(get, element)
            }//次検索処理
            pl += testPer;
          })
          let Emirate = get.percent, D_check = false;
          if(get.rarity === 'UR' || get.rarity === 'LR') upperUR++;
          delete get.percent;
          get = rem_tag(get, ['namehide', 'rarehide', 'perhide']); //タグ消し
          let info_mark = '';
          user_data.items.forEach(element => { // 被りなどの判定
            if(Object.is(get.name, element.name) && Object.is(get.rarity, element.rarity)) {
              if(element.amount == undefined) { element.amount = 2;
              } else { element.amount += 1; }
              element.tag = get.tag;
              D_check = true;
            }
          });
          if(D_check == false) {
            info_mark += ':new:'
            user_data.items = user_data.items.concat(get);
          }

          //アワードに関係ある場合、ラベル絵文字追加
          ['kcp', 'monaxodia', 'yari', 'goopix', 'dajare', 'medicine', 'GP', 'takasaki', 'GC', 'pexer', 'PMOG', 'merapyoi'].forEach(element => {
            if(get.tag.includes(element))info_mark += ':label:';
          })
          
          //追加イベント
            //シーズン1
          if(get.name === "ガチャコイン15枚券") {
            coin_data.datas[Acdn].coins += 15;
            add_event = 1;
          }
          if(get.name === "ガチャコイン150枚券") {
            coin_data.datas[Acdn].coins += 150;
            add_event = 2;
          }
          if(get.name === "タイムリー短縮券(10分)") {
            timely_data -= 600000;
            fs.writeFileSync(timely_ad, timely_data)
            add_event = 3;
          }
          if(get.name === "アルティメット促進剤(タイムリーボーナス仕様)") {
            timely_data -= GachaT_time * 0.35;
            fs.writeFileSync(timely_ad, timely_data)
            add_event = 4;
          }
          if(get.name === "ポテマシュの電話番号下2ケタ") {
            message.author.send('???からのリーク>>> ポテマシュの電話番号下2ケタは「**76**」だぜwww')
            add_event = 5;
          }
            //シーズン2
          if(get.name === "ココちゃん(スイカバージョン)") {
            message.author.send('**[SSR]**ココちゃん(スイカバージョン)', {
              files: [{
                attachment: './image/images/gacha/photos/coco_suika.jpg',
                name: 'coco_suika.jpg'
              }]
            })
            add_event = 6;
          }
          if(get.name === "ゲーミング*Kiss") {
            message.author.send('**[LR]**ゲーミング泉Kiss', {
              files: [{
                attachment: './image/images/gacha/photos/Gaming_izumiKiss.gif',
                name: 'Gaming_izumiKiss.gif'
              }]
            })
            add_event = 7;
          }
          if(get.name === "グラフィック***くん") {
            message.author.send('**[LR]**グラフィックゆずるくん', {
              files: [{
                attachment: './image/images/gacha/photos/Gaming_yuzuru.gif',
                name: 'Gaming_yuzuru.gif'
              }]
            })
            add_event = 8;
          }
          //シーズン3
          if(get.name === "幻の*ダッシュ") {
            message.author.send('**[ULR]**幻の泉ダッシュ', {
              files: [{
                attachment: './image/images/gacha/photos/S3/Izumi_dash.mp4',
                name: 'Izumi_dash.mp4'
              }]
            })
            add_event = 9;
          }
          if(get.name === "磯野野球しようぜ\n坊主を撲殺するスネ夫") {
            message.author.send('**[LR]**磯野野球しようぜ\n坊主を撲殺するスネ夫', {
              files: [{
                attachment: './image/images/gacha/photos/S3/GP_isono.gif',
                name: 'GP_isono.gif'
              }]
            })
            add_event = 10;
          }
          if(get.name === "リンゴをシリから食べる**\nかまぼこのりんご出産") {
            message.author.send('**[UR]**リンゴをシリから食べる**\nかまぼこのりんご出産', {
              files: [{
                attachment: './image/images/gacha/photos/S3/GP_rinngoKamaboko.gif',
                name: 'GP_rinngoKamaboko.gif'
              }]
            })
            add_event = 11;
          }
          if(get.name === "スマホを食べる****\nコナンの犯沢が不慮の事故で死亡") {
            message.author.send('**[SSR]**スマホを食べる****\nコナンの犯沢が不慮の事故で死亡', {
              files: [{
                attachment: './image/images/gacha/photos/S3/GP_jumboHannin.gif',
                name: 'GP_jumboHannin.gif'
              }]
            })
            add_event = 12;
          }
          if(get.name === "リンゴを食べる**\nリンゴを握りつぶした*****") {
            message.author.send('**[SSR]**リンゴを食べる**\nリンゴを握りつぶした*****', {
              files: [{
                attachment: './image/images/gacha/photos/S3/GP_ringo.gif',
                name: 'GP_ringo.gif'
              }]
            })
            add_event = 13;
          }

          //褒賞アイテム
          CI = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
          user_data.items.forEach(element => {
            // S1
            if(element.tag.includes('S1'))CI[0]++;
            if(element.tag.includes('kcp'))CI[1]++;
            if(element.tag.includes('monaxodia'))CI[2]++;
            if(element.tag.includes('yari'))CI[3]++;
            // S2
            if(element.tag.includes('S2'))CI[4]++;
            if(element.tag.includes('goopix'))CI[5]++;
            if(element.tag.includes('dajare'))CI[6]++;
            if(element.tag.includes('medicine'))CI[7]++;
            if(element.tag.includes('GG'))CI[8]++;
            // S3
            if(element.tag.includes('S3'))CI[9]++;
            if(element.tag.includes('GP'))CI[10]++;
            if(element.tag.includes('takasaki'))CI[11]++;
            if(element.tag.includes('pexer'))CI[12]++;
            if(element.tag.includes('GC'))CI[13]++;
            if(element.tag.includes('PMOG'))CI[14]++;
            if(element.tag.includes('merapyoi'))CI[15]++;
          });
          var has_items2 = [];
          user_data.items.forEach(element => {
            has_items2.push(element.name)
          });
          //シーズン1
          AwardJ('シーズン1完全制覇トロフィー', CI[0], 84, 4) //新・ガチ**ガチャの制覇トロフィー以外の84種類のアイテム全てを獲得
          AwardJ('クリス****信者S1', CI[1], 4, 1) //シーズン1・kcpシリーズ4種を獲得
          AwardJ('もなゾディア', CI[2], 5, 2) //もなゾディアパーツ5つを獲得
          AwardJ('生粋の槍コレクターS1', CI[3], 6, 3) //シーズン1・槍シリーズ6種を獲得
          //シーズン2
          AwardJ('シーズン2完全制覇トロフィー', CI[4], 74, 5) //******ガチャの制覇トロフィー以外の74種類のアイテム全てを獲得
          AwardJ('グーグルピクセルヘビーユーザー', CI[5], 5, 6) //****関連のアイテムを5種類獲得
          AwardJ('ダジャレおじさん', CI[6], 4, 7) //ダジャレを4種類獲得
          AwardJ('メディック(?)の称号', CI[7], 10, 8) //お薬を10種類獲得
          AwardJ('グラフィックデザイナー', CI[8], 2, 9) //ゲーミンググラフィックアイテムを2種類獲得
          //シーズン3
          AwardJ('シーズン3完全制覇トロフィー', CI[9], 79, 10) //ぐれーと**ガチャの制覇トロフィー以外の79種類のアイテム全てを獲得
          AwardJ('Gartic PHONE 全一', CI[10], 4, 11) //Gartic PHONE作品を4種類集めると獲得
          AwardJ('***のベンツ', CI[11], 7, 12) //***についての情報を7種類を集めると獲得
          AwardJ('APEXトライアングル', CI[12], 3, 13) //**ペクサー3人衆を集めると獲得
          AwardJ('ゲームコレクター', CI[13], 7, 14) //特定のゲームを7種類集めると獲得
          AwardJ('*****おすすめゲーム四選', CI[14], 4, 15) //*****の個人的おすすめゲーム4種類集めると獲得
          AwardJ('**ぴょい伝説', CI[15], 6, 16) //**ぴょいアイテム6種類を集める

          //end
          coin_data.datas[Acdn].coins -= 10;
          let rare_mark;
          if(get.rarity === 'LR') {
            rare_mark = ':trident:';
          } else if(get.rarity === 'UR') {
            rare_mark = ':gem:';
          } else {
            rare_mark = '';
          }
          result += `${rare_mark}**[${get.rarity}]\t${get.name}**`+' `('+Math.floor(Emirate*1000)/1000+'%)`'+`${info_mark}\n`;
          }

          if(G_num >= 2) add_event = -1;

          fs.writeFileSync(users_ad, JSON.stringify(user_data))

          switch (LA - coin_data.datas[Acdn].select_lineup_Num) {
            case 3: {
              message.channel.send(undefined, {
                  color: "#00ff00",
                  files: [{
                    attachment: './image/images/gacha/黄ガチャf1.png',
                    name: 'Normal_gacha_f1.png'
                  }]})
              break;
            }
            
            case 2: {
              message.channel.send(undefined, {
                  color: "#00ff00",
                  files: [{
                    attachment: './image/images/gacha/緑ガチャf1.png',
                    name: 'Normal_gacha_f1.png'
                  }]})
              break;
            }

            case 1: {
              message.channel.send(undefined, {
                  color: "#00ff00",
                  files: [{
                    attachment: './image/images/gacha/青ガチャf1.png',
                    name: 'Normal_gacha_f1.png'
                  }]})
              break;
            }
          
            default: {
              message.channel.send(undefined, {
                  color: "#00ff00",
                  files: [{
                    attachment: './image/images/gacha/緑ガチャf1.png',
                    name: 'Normal_gacha_f1.png'
                  }]})
              break;
            }
          }

          let delay = 0;
          if(Math.floor(Math.random() *100)+1 <= upperUR*45) {//確定演出(&評価)
            delay = 2400;
            setTimeout(() => {
                message.channel.send('UR以上確定！！！', {
                  color: "#ffd700",
                  files: [{
                    attachment: './image/images/gacha/確定ガチャS3(黄).png',
                    name: 'Normal_gacha_kaku.png'
                  }]
                })
            }, 1200);
          }

            setTimeout(() => {
              message.reply('')
              message.channel.send(undefined, {
                embed: {
                  color: "#00ff00",
                  title: `:leafy_green:${Gacha_lineup.title}:sushi:`,
                  description: `獲得したのはこちら...!\n\n`+ result +'\nおめでとうございます!\n`残りコイン枚数: '+coin_data.datas[Acdn].coins+'`\n`ラインナップ更新日時:'+Gacha_lineup.update_time+'`\n`※_cd gacha helpでコマンド一覧表示`'}})
              message_log('ガチャ: ガチャ結果をチャットしました。 当選:「\n'+ result +'」')
              if(G_num >= 11) message.channel.send('**※一度に回せる回数は10回までです。**');
              
              //追加イベントメッセージ
              if(add_event == -1) message.channel.send('〇連続ガチャでは発生した効果が表示されませんが、適用はされています。');
              if(add_event == 1) message.channel.send('「ガチャコイン15枚券」の効果で__ガチャコイン15枚を獲得__しました。');
              if(add_event == 2) message.channel.send('「ガチャコイン150枚券」の効果で__ガチャコイン150枚を獲得__しました。');
              if(add_event == 3) message.channel.send('「タイムリー短縮券(10分)」の効果でタイムリーボーナス無効時間が__10分短縮__されました。');
              if(add_event == 4) message.channel.send('「アルティメット促進剤(タイムリーボーナス仕様)」の効果でタイムリーボーナス無効時間が__35%短縮__されました。');

              //褒賞獲得イベントメッセージ
              if (awaev.includes(1)) {
                message.channel.send(undefined, {
                  embed: {
                    color: "#ff8c00",
                    title: `:star:${Author}:アワード獲得:diamond_shape_with_a_dot_inside:`,
                    description: `条件: クリス***ピーアイテム(シーズン1)全4種類をコンプリート\nを達成しました！\n\n:star:**[ULR]クリスちんポピー信者S1**:diamond_shape_with_a_dot_inside:\n\nを進呈します。\nおめでとうございます!`
                  }})
                message_log('ガチャ: ガチャのアワードアイテム「[ULR]クリス***ピー信者S1」を進呈')
              }
              if (awaev.includes(2)) {
                message.channel.send(undefined, {
                  embed: {
                    color: "#8b4513",
                    title: `:star:${Author}:アワード獲得:diamond_shape_with_a_dot_inside:`,
                    description: `条件: **ゾディア胴体・左腕・右腕・左足・右足、合計5つを収集\nを達成しました！\n\n:star:**[ULR]もなゾディア**:diamond_shape_with_a_dot_inside:\n\nを進呈します。\nおめでとうございます!`
                  }})
                message_log('ガチャ: ガチャのアワードアイテム「[ULR]**ゾディア」を進呈')
              }
              if (awaev.includes(3)) {
                message.channel.send(undefined, {
                  embed: {
                    color: "#6495ed",
                    title: `:star:${Author}:アワード獲得:diamond_shape_with_a_dot_inside:`,
                    description: `条件: 槍系アイテム(シーズン1)全6種類をコンプリート\nを達成しました！\n\n:star:**[ULR]生粋の槍コレクターS1**:diamond_shape_with_a_dot_inside:\n\nを進呈します。\nおめでとうございます!`
                  }})
                message_log('ガチャ: ガチャのアワードアイテム「[ULR]生粋の槍コレクターS1」を進呈')
              }
              if (awaev.includes(4)) {
                message.channel.send(undefined, {
                  embed: {
                    color: "#9400d3",
                    title: `:star:${Author}:アワード獲得:diamond_shape_with_a_dot_inside:`,
                    description: `条件: シーズン1アイテム全84種類を収集\nを達成しました！\n\n:star:**[ULR]シーズン1完全制覇トロフィー**:diamond_shape_with_a_dot_inside:\n\nを進呈します。\nおめでとうございます!そしてシーズン1ガチャ回しお疲れ様でした！\nThank you for playing. and Congraturations!`
                  }})
                message_log('ガチャ: ガチャのアワードアイテム「[ULR]シーズン1完全制覇トロフィー」を進呈')
              }
              if (awaev.includes(5)) {
                message.channel.send(undefined, {
                  embed: {
                    color: "#d3cf00",
                    title: `:star:${Author}:アワード獲得:large_orange_diamond: `,
                    description: `条件: シーズン2アイテム全71種類を収集\nを達成しました！\n\n:gift:**[ULR]シーズン2完全制覇トロフィー**:star:\n\nを進呈します。\nおめでとうございます!そしてシーズン2ガチャ回しもお疲れ様でした！\nThank you for playing. and Congraturations!`
                  }})
                message_log('ガチャ: ガチャのアワードアイテム「[ULR]シーズン2完全制覇トロフィー」を進呈')
              }
              if (awaev.includes(6)) {
                message.channel.send(undefined, {
                  embed: {
                    color: "#076ddb",
                    title: `:star:${Author}:アワード獲得:large_orange_diamond:`,
                    description: `条件: ぐーぴくアイテムを5種類集める。\nを達成しました！\n\n:gift:**[ULR]グーグルピクセルヘビーユーザー**:star:\n\nを進呈します。\nおめでとうございます!`
                  }})
                message_log('ガチャ: ガチャのアワードアイテム「[ULR]グーグルピクセルヘビーユーザー」を進呈')
              }
              if (awaev.includes(7)) {
                message.channel.send(undefined, {
                  embed: {
                    color: "#5710ad",
                    title: `:star:${Author}:アワード獲得:large_orange_diamond:`,
                    description: `条件: ダジャレを4つ唱える。\nを達成しました！\n\n:gift:**[ULR]ダジャレおじさん**:star:\n\nを進呈します。\nおめでとうございます!`
                  }})
                message_log('ガチャ: ガチャのアワードアイテム「[ULR]ダジャレおじさん」を進呈')
              }
              if (awaev.includes(8)) {
                message.channel.send(undefined, {
                  embed: {
                    color: "#1fcc0c",
                    title: `:star:${Author}:アワード獲得:large_orange_diamond:`,
                    description: `条件: お薬を10種類集める。\nを達成しました！\n\n:gift:**[ULR]メディック(?)の称号**:star:\n\nを進呈します。\nおめでとうございます!`
                  }})
                message_log('ガチャ: ガチャのアワードアイテム「[ULR]メディック(?)の称号」を進呈')
              }
              if (awaev.includes(9)) {
                message.channel.send(undefined, {
                  embed: {
                    color: "#1fcc0c",
                    title: `:star:${Author}:アワード獲得:large_orange_diamond:`,
                    description: `条件: ゲーミンググラフィックを2種類集める。\nを達成しました！\n\n:gift:**[ULR]グラフィックデザイナー**:star:\n\nを進呈します。\nおめでとうございます!`
                  }})
                message_log('ガチャ: ガチャのアワードアイテム「[ULR]グラフィックデザイナー」を進呈')
                
                /*
                message.author.send(undefined, {
                  embed: {
                    color: "#edd011",
                    title: `:star:${Author}:アワード獲得:large_orange_diamond:`,
                    description: `条件: ゲーミンググラフィックを2種類集める。\nを達成しました！\n\n:gift:**[ULR]グラフィックデザイナー**:star:\n\nを進呈します。\nおめでとうございます!`
                  }})
                message_log('ガチャ: ガチャのアワードアイテム「[ULR]グラフィックデザイナー」を進呈')
                */
              }
              if (awaev.includes(10)) {
                message.channel.send(undefined, {
                  embed: {
                    color: "#ff8717",
                    title: `:star:${Author}:アワード獲得:large_blue_diamond:`,
                    description: `条件: シーズン3アイテム全79種類を収集\nを達成しました！\n\n:gift:**[ULR]シーズン3完全制覇トロフィー**:star:\n\nを進呈します。\nおめでとうございます!`
                  }})
                message_log('ガチャ: ガチャのアワードアイテム「[ULR]シーズン3完全制覇トロフィー」を進呈')
              }
              if (awaev.includes(11)) {
                message.channel.send(undefined, {
                  embed: {
                    color: "#5c0ec9",
                    title: `:star:${Author}:アワード獲得:large_blue_diamond:`,
                    description: `条件: Gartic PHONE作品4種類を収集\nを達成しました！\n\n:gift:**[ULR]Gartic PHONE 全一**:star:\n\nを進呈します。\nおめでとうございます!`
                  }})
                message_log('ガチャ: ガチャのアワードアイテム「[ULR]Gartic PHONE 全一」を進呈')
              }
              if (awaev.includes(12)) {
                message.channel.send(undefined, {
                  embed: {
                    color: "#09b01c",
                    title: `:star:${Author}:アワード獲得:large_blue_diamond:`,
                    description: `条件: ***についての情報を7種類収集\nを達成しました！\n\n:gift:**[ULR]高崎山のベンツ**:star:\n\nを進呈します。\nおめでとうございます!`
                  }})
                message_log('ガチャ: ガチャのアワードアイテム「[ULR]***のベンツ」を進呈')
              }
              if (awaev.includes(13)) {
                message.channel.send(undefined, {
                  embed: {
                    color: "#f7071f",
                    title: `:star:${Author}:アワード獲得:large_blue_diamond:`,
                    description: `条件: **ペクサー三人衆を集める\nを達成しました！\n\n:gift:**[ULR]APEXトライアングル**:star:\n\nを進呈します。\nおめでとうございます!`
                  }})
                message_log('ガチャ: ガチャのアワードアイテム「[ULR]APEXトライアングル」を進呈')
              }
              if (awaev.includes(14)) {
                message.channel.send(undefined, {
                  embed: {
                    color: "#2a05e3",
                    title: `:star:${Author}:アワード獲得:large_blue_diamond:`,
                    description: `条件: 特定のゲームを7種類収集\nを達成しました！\n\n:gift:**[ULR]ゲームコレクター**:star:\n\nを進呈します。\nおめでとうございます!`
                  }})
                message_log('ガチャ: ガチャのアワードアイテム「[ULR]ゲームコレクター」を進呈')
              }
              if (awaev.includes(15)) {
                message.channel.send(undefined, {
                  embed: {
                    color: "#d4a20d",
                    title: `:star:${Author}:アワード獲得:large_blue_diamond:`,
                    description: `条件: *****おすすめゲーム四選を収集\nを達成しました！\n\n:gift:**[ULR]*****おすすめゲーム四選**:star:\n\nを進呈します。\nおめでとうございます!`
                  }})
                message_log('ガチャ: ガチャのアワードアイテム「[ULR]*****おすすめゲーム四選」を進呈')
              }
              if (awaev.includes(16)) {
                message.channel.send(undefined, {
                  embed: {
                    color: "#f09413",
                    title: `:star:${Author}:アワード獲得:large_blue_diamond:`,
                    description: `条件: **ぴょいアイテムを6種類収集\nを達成しました！\n\n:gift:**[ULR]**ぴょい伝説**:star:\n\nを進呈します。\nおめでとうございます!`
                  }})
                message_log('ガチャ: ガチャのアワードアイテム「[ULR]**ぴょい伝説」を進呈')
              }
            }, 1200 + delay);

            /*debugger
            setTimeout(() => {
              message.edit(undefined, {
                files: [{attachment: './image/images/gacha/赤ガチャf2.png', name: 'Normal_gacha_f2.png'}]
              })
              setTimeout(() => {
                message.edit(undefined, {
                  files: [{attachment: './image/images/gacha/赤ガチャf3.png', name: 'Normal_gacha_f3.png'}]
              })
              setTimeout(() => {
                message.edit(undefined, {
                  files: [{attachment: './image/images/gacha/赤ガチャf4.png', name: 'Normal_gacha_f4.png'}]
              })
            }, 500);
            }, 500);
            }, 500);
            */
        } else {
          message.channel.send('**※コインが足りません！**\n`※_cd gacha helpでコマンド一覧表示`')
          message_log('ガチャ: ガチャ失敗(コイン不足)')
        }
      }

      if(S[2] === 'coin') {
        message.channel.send('あなたの所持ガチャコイン:coin:枚数は「**'+coin_data.datas[Acdn].coins+'**」枚です。\nまたリザーブ(予備)コイン:moneybag:枚数は「__'+coin_data.datas[Acdn].reserve_c+'__」枚です。')
        message_log('ガチャ: チャットした人の所持枚数をチャットしました。'+`(コイン枚数:${coin_data.datas[Acdn].coins}, リザーブ枚数:${coin_data.datas[Acdn].reserve_c})`)
      }

      if(S[2] === 'detail' || S[2] === 'det') {
        let text = '';

        function Gdet(rare) {
          rare = rare.toUpperCase();
          let txt = '';
          let show = {name: '', rarity: '', percent: ''};
          Gacha_lineup.goods.forEach(element => {
            if(element.rarity === rare) {
              if(element.tag == undefined) element.tag = [];
              if(has_items.includes(element.name)) {
                show.name = element.name; show.rarity = element.rarity; show.percent = element.percent;
              } else {
                if(element.tag.includes('namehide')) {show.name = '?????';} else {show.name = element.name;}
                if(element.tag.includes('rarehide')) {show.rarity = '??';} else {show.rarity = element.rarity;}
                if(element.tag.includes('perhide')) {show.percent = '???';} else {show.percent = element.percent;}
              }
              txt += `**[${show.rarity}]\t${show.name}**`+' `('+Math.floor(show.percent*1000)/1000+'%)`\n'
            }
          });
          return txt;
        }

        if(S[3] == undefined) {
          message.author.createDM()
          message.channel.send('あなたとのDMチャンネルに詳細を送信しました。')
          message.author.send(undefined, {
            embed: {
              color: "#4169e1",
              title: `:book:ガチャ詳細情報(${Gacha_lineup.update_time}):book:`,
              description: `${Gacha_lineup.description}`+'\n<排出率表示>\n`_cd gacha det `の後に`award, ULR, LR, UR, SSR, SR, R, NR, N`のいずれかを入力するとそのレアリティの排出率を見ることが出来ます。'}})
        } else if(S[3] === 'award') {
          text = `**<アワードアイテム>**\n\n` + Gacha_lineup.award_hint;
        } else if(['ulr', 'lr', 'ur', 'ssr', 'sr', 'r', 'nr', 'n'].includes(S[3])) {
          text = `**<${S[3].toUpperCase()}排出率>**\n` + Gdet(S[3]);
        }
        if(text !== '') {
          message.author.send(undefined, {
            embed: {
              color: "#00bfff",
              title: `:book:ガチャ詳細情報(${Gacha_lineup.update_time}):book:`,
              description: text}})
        }
        message_log('ガチャ: ガチャ詳細情報DMに送信')
      }

      if(S[2] === 'has') {
        let text = '';
        let list = user_data.items;
        list.forEach(element => {
          switch (element.rarity) {
            case 'ULR': element.rare_rank = 0; break;
            case 'LR': element.rare_rank = 1; break;
            case 'UR': element.rare_rank = 2; break;
            case 'SSR': element.rare_rank = 3; break;
            case 'SR': element.rare_rank = 4; break;
            case 'R': element.rare_rank = 5; break;
            case 'NR': element.rare_rank = 6; break;
            case 'N': element.rare_rank = 7; break;

            default: element.rare_rank = 9; break;
          }
        });
        list.sort(function (a, b) {
          let nameA = a.name.toUpperCase(); // 大文字と小文字を無視する
          let nameB = b.name.toUpperCase(); // 大文字と小文字を無視する
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;// names must be equal
        })
        list.sort(function (a, b) {
          return a.rare_rank - b.rare_rank;
        })

        let amountSum = 0;
        function Wpage() {
          if(!isNaN(S[3])) {
            return Number(S[3])-1;} else {
            return 0;}}
        let page = Wpage(), i = 0;
        const A_page = 10; //一ページで表示するアイテム数
        list.forEach(element => {
          if (element.amount == undefined) element.amount = 1;
          if(A_page*page <= i && i < A_page*page+A_page) {
            text += `**[${element.rarity}]\t${element.name}**`+' `×'+element.amount+'`\n';
          }
          amountSum += element.amount;
          i++;
        });
        message.channel.send(undefined, {
          embed: {
            color: "#00ff00",
            title: message.member.nickname+"の所持ガチャアイテム一覧",
            description: text+`----------ページ:${page+1}/${Math.ceil(i/A_page)}----------\n`+'`所持アイテム合計個数: '+amountSum+'`'}})
        message_log('ガチャ: 送信者の所持ガチャアイテムの一覧を表示しました。')
      }

      if(S[2] === 'lineup') {
        if(!isNaN(S[3])) {
          coin_data.datas[Acdn].select_lineup_Num = Number(S[3]);
          message.channel.send(`使用するガチャラインアップを**${S[3]}シーズン前**のもの__(シーズン${LA-Number(S[3])})__に変更しました。\n`+'`※ラインナップが見つからなかった場合、最新のラインナップが使用されます。`')
          message_log(`ガチャ: 送信者が使うガチャラインナップを変更(${S[3]}シーズン前)`)
        } else {
          message.channel.send('**※最後に番号を入力してください。**')
          message_log('ガチャ: ガチャラインナップ変更失敗(番号入力ミス)')
        }
      }

      if (message.author.id === config.owner_id) { //ボットオーナー専用コマンド
        if (S[2] === 'p_check') { //ガチャのパーセンテージ合計(100%で正常)
          let Sum = 0;
          Gacha_lineup.goods.forEach(element => {
            Sum += element.percent;
          });
          message.channel.send('`' + Sum + '%`')
          message_log('ガチャ(オーナーチート): ガチャラインナップ総パーセント表示' + `[${Sum}%]`)
        } else
        if (S[2] === 'timely') { //タイムリー関連の操作
          if(S[3] === 'instant') { //即席でタイムリーを作動
            message_log('ガチャ(オーナーチート): 即席タイムリー -100000000ms')
            timely_data -= 100000000;
          }
          if(S[3] === 'adjm') { //タイムリー時間変更/調整(何の略か忘れた)

          }
          if(S[3] === 'allonline') { //全員オンライン時刻現在化
            coin_data.datas.forEach(element => {
              element.onlineD = Date.now();
            });
            message.channel.send('[チート]全員のオンライン最終時刻を現在の時刻に設定しました。')
            message_log('ガチャ(オーナーチート): オンライン時効現在化(全員)')
          }
        } else
        if (S[2] === 'reserve') {
          if(S[3] === 'setall' && !isNaN(S[4])) {
            coin_data.datas.forEach(element => {
              let dif = element.coins - Number(S[4]);
              if(dif >= 0) {
                element.reserve_c += dif;
                element.coins -= dif;
              }
            })
            message.channel.send(`[チート]全員のコイン枚数が__${S[4]}__になるようにリザーブコインを設定しました。\n`+'`設定枚数以下:変化なし\n設定枚数以上:余剰分がリザーブコインに加算`')
            message_log('ガチャ(オーナーチート): リザーブコイン設定(全員)')
          }
        } else
        if(S[2] === 'gift') {
          if(S[3] === 'coin' && !isNaN(S[4])) {
            coin_data.datas.forEach(element => {
              element.coins += Number(S[4]);})
            message.channel.send(`**:coin:ガチャコイン:${S[4]}枚 を全プレイヤーにプレゼントしました。**`)
            message_log(`ガチャ(オーナーチート): 全員にガチャコイン贈呈:${S[4]}枚`)
          } else if(S[3] === 'reserve' && !isNaN(S[4])) {
            coin_data.datas.forEach(element => {
              element.reserve_c += Number(S[4]);})
            message.channel.send(`**:moneybag:リザーブコイン:${S[4]}枚 を全プレイヤーにプレゼントしました。**`)
            message_log(`ガチャ(オーナーチート): 全員にリザーブコイン贈呈:${S[4]}枚`)
          }
        } else
        if(S[2] === 'setlineup' && !isNaN(S[3])) {
          coin_data.datas.forEach(element => {
            element.select_lineup_Num = Number(S[3]);})
            message.channel.send(`[チート]全員の使用するガチャラインナップを__${S[3]}シーズン前__のものにしました。`)
            message_log(`ガチャ(オーナーチート): 全員使用ラインナップ変更:${S[3]}シーズン前`)
        }
      }

      //ガチャ: タイムリーボーナス
      var setGacha_timely = GachaT_time;
      if(Date.now() - Number(timely_data) >= setGacha_timely) {//unit ms
        let value_n = -1, rate_n = -1;
        let value = [(Math.floor(Math.random()*30)+21), 24, 50, 20, (Math.floor(Math.random()*90)+11)] //基礎値
        let rate= [0.8, 2.5, (Math.floor(Math.random()*56)/10+0.5), 1, (Math.floor(Math.random()*21)/10+2)]; //倍率
        let get = 0;
        message.channel.send(undefined, {
          embed: {
            color: "#ffff00",
            title: ":clock3:タイムリーボーナス(基礎値2倍キャンペーン):coin:",
            description: "タイムリーボーナス(2時間)を獲得しました。\n※**ガチャを回したことがある全員**に配られます。\n**※48時間ガチャを回していない人は獲得量が__20%__になります。**\n※送信者はボーナスとして2倍獲得します。\n"+`**抽選中:**\n<基礎値>\n<${value[0]}> <${value[1]}> <${value[2]}> <${value[3]}> <${value[4]}>\n[倍率]\n[x${rate[0]}] [x${rate[1]}] [x${rate[2]}] [x${rate[3]}] [x${rate[4]}]\n`+"`5秒後、獲得量が確定...`"}})
        message_log('ガチャ: タイムリーボーナス抽選開始//Min:5>>>6, Max:300>>>600')
        function Arraylen_rand(array) {
          return Math.floor(Math.random() * array.length);
        }
        value_n = Arraylen_rand(value); rate_n = Arraylen_rand(rate);
        get = Math.ceil(value[value_n] * rate[rate_n]);
        value[value_n] = "__**"+value[value_n]+"**__"; rate[rate_n] = "__**"+rate[rate_n]+"**__";

        let leave_count = 0;
        coin_data.datas.forEach(element => {
          if(Date.now() - element.onlineD <= 172800000) { // 48時間オンラインじゃない場合獲得量20%化
            if(Author === element.name) { //送信者はダブルゲット
              element.coins += get * 2;
            } else {
            element.coins += get;
            }
          } else {
            leave_count++;
            if(Author === element.name) { //送信者はダブルゲット
              element.coins += Math.ceil(get * 2 * 0.20);
            } else {
            element.coins += Math.ceil(get * 0.2);
            }
          }

          var reserve_max = 100;
          if(element.reserve_c >= reserve_max) { //リザーブコイン変換(上限100枚)
            element.reserve_c -= reserve_max;
            element.coins += reserve_max;
          } else if(element.reserve_c >= 1) {
            element.coins += element.reserve_c;
            element.reserve_c = 0;
          }
        });
        fs.writeFileSync(timely_ad, Date.now())

        setTimeout(() => {
          message.channel.send(undefined, {
            embed: {
              color: "#ffd700",
              title: ":clock3:タイムリーボーナス結果:coin:",
              description: `**抽選完了:**\n<基礎値>\n<${value[0]}> <${value[1]}> <${value[2]}> <${value[3]}> <${value[4]}>\n[倍率]\n[x${rate[0]}] [x${rate[1]}] [x${rate[2]}] [x${rate[3]}] [x${rate[4]}]\n\n獲得枚数: <${value[value_n]}> × [${rate[rate_n]}] = **${get}**枚(切り上げ)\n`+"__獲得量20%人数__: `"+leave_count+"人(ガチャを回すと時間リセット)`\n`おめでとうございます!(ボーナスは"+(Math.ceil(GachaT_time/360000)/10)+"時間経過後に再度可能)`"}})
          message_log('ガチャ: タイムリーボーナス抽選完了'+`当選枚数: ${get}枚`)
          message.channel.send('〇リザーブコインがある人は__最大100枚__リザーブコインをガチャコインにしました。')
          message_log('ガチャ: リザーブコイン変換(設定最大枚数:100枚)')
        }, 5000);
      }
      
      //コインデータ最終入力
      fs.writeFileSync(coins_ad, JSON.stringify(coin_data))
    }

    //Bot's presence mode changer
    if(message_content.slice(0, 12) === '_cd presence') {
      Presence_mode++;
      if(Presence_mode > 1) Presence_mode = 0;
      switch (Presence_mode) {
        case 0: {
          message.channel.send('ボットのプリセンス(ゲームプレイ)表示のモードを「0.デフォルト」に変更しました。')
          message_log('ボットのプリセンスモード変更「0.デフォルト」')
          break;
        }
        case 1: {
          message.channel.send('ボットのプリセンス(ゲームプレイ)表示のモードを「1.タイムリー進捗状況」に変更しました。')
          message_log('ボットのプリセンスモード変更「1.タイムリー進捗状況」')
          break;
        }
      }
    }
    //end

    //Umako_gacha simulator
    
    if(message_content.slice(0, 7) === '_cd umm') {
      let S = message_content.split(' ');
      let gacha_ad;
      if(S[1] === 'ummpd') {
        gacha_ad = './.data/ummpd/ummpd_gacha_main.json';
      } else if(S[1] === 'umms') {
        gacha_ad = './.data/ummpd/ummpd_gacha_support.json';
      }
      if(gacha_ad == undefined) {
        message.channel.send('**※・プリティーダービーガチャ(`_cd ummpd`)\n　・サポートカードガチャ(`※未対応`)\n　のいずれかを選択してください。**')
        message_log('ウマ娘ガチャシミュレーター: ラインアップアドレス取得失敗')
        return;
      }
      let gacha_data = Object(JSON.parse(fs.readFileSync(gacha_ad, (err, data) => {
        if(err) throw err;
      }), 'utf8'));

      if(S[2] == undefined || !isNaN(S[2]) || S[2] === 'c') {
        let G_num = 0; //ガチャ回数
        let get_list = []; //獲得リスト
        let result = ''; //ガチャ結果メッセージ
        let perf_prob = 0; //確定演出確率
        if(Number(S[2]) == 10) {
          G_num = 10;
        } else {
          G_num = 1;
        }
        /* else if(1 <= Number(S[2]) && Number(S[2]) <= 100 && S[3] == gacha_data.over_pass) {
          G_num = Math.floor(Number(S[2]));
        } */
        let totalPercent = 0, TenPercent = 0;
        gacha_data.entry.forEach(element => {
          totalPercent += element.percent;
        })
        gacha_data.entry.forEach(element => {
          TenPercent += element.s10percent;
        })
        for(let i=0; i < G_num; i++) {
          if((i+1) % 10 != 0) {
            let WinNum = Math.random() * totalPercent;
            if(message.author.id === config.owner_id && S[2] === 'c') { //ボットオーナー専用確率操作コマンド
              WinNum = Number(S[3]);
            }
            let pl = 0, testPer; // get = {},
            gacha_data.entry.forEach(element => {
              testPer = element.percent;
              if(pl < WinNum && WinNum <= testPer + pl) {//当選処理
                get_list.push(element)
                if(element.rarity >= 3) perf_prob += 60;
              }//次検索処理
              pl += testPer;
            })
          } else {
            let WinNum = Math.random() * TenPercent;
            let pl = 0, testPer; // get = {},
            gacha_data.entry.forEach(element => {
              testPer = element.s10percent;
              if(pl < WinNum && WinNum <= testPer + pl) {//当選処理
                get_list.push(element)
                if(element.rarity >= 3) perf_prob += 60;
              }//次検索処理
              pl += testPer;
            })
          }
        }
        //画像演出(通常&確定)
          let file = '', color = '';
        if(Math.random()*100 <= perf_prob) {
          switch (Math.floor(Math.random()*2)+1) {
            case 1: file = './.data/ummpd/images/uncommon/3star.jpg';
              break;
            case 2: file = './.data/ummpd/images/uncommon/gold_door.jpg';
              break;
            case 3: file = './.data/ummpd/images/uncommon/shiny_plate.jpg';
              break;
          }
          color = '#e6de07';
        } else {
          file = './.data/ummpd/images/common/1star.jpg';
          color = '#faebf5';
        }
        message.channel.send(undefined, {
          files: [{
            attachment: file
          }]
        })
        
        for(const element of get_list) {
          let rare_mark;
          if(element.rarity == 3) {
            rare_mark = ':rainbow:';
          } else if(element.rarity == 2) {
            rare_mark = ':coin:';
          } else {
            rare_mark = '';
          }
          result += `${rare_mark}**★${element.rarity}\t${element.name}**`+' `('+element.percent+'%)`\n';
        }
        setTimeout(function() {
          message.reply('')
          message.channel.send(undefined, {
            embed: {
              color: color,
              title: `${gacha_data.title}`,
              description: `結果はこちら...!\n\n`+ result +'\n`ラインナップ更新日時:'+gacha_data.update_time+'`\n`Tips: 「_cd ummpd 10」で10連(10回目☆2以上確定)`'}})
          message_log('ウマ娘ガチャシミュレーター: ガチャ結果をチャットしました。 当選:「\n'+ result +'」')
        }, 1800)
      }
    }
    
    //end

    //Vote Gamble
    if(message_content.slice(0, 10) === '_cd gamble' || message_content.slice(0, 7) === '_cd gam') {
      //debugger;
      let S = message_content.split(' ');
      let Author = message.author.username;
      let coins_ad = './.data/gacha/has_coins/coin_data.json';
      let ready_ad = `./.data/gamble/ready_session/${Author}.json`;
      let gamble_ad = `./.data/gamble/in_session/${Author}.json`;
      let e_count_ad = './.data/gamble/end_session/count.txt';
      let coin_data, gamble_data, r_files, i_files;
      try {
        coin_data = Object(JSON.parse(fs.readFileSync(coins_ad, (err, data) => {
          if(err) throw err;
      }), 'utf8'))
      } catch (error) {
        message.channel.send('**※なんらかの理由でコインデータが見つかりませんでした。**')
        message_log('ギャンブル: コインデータ読み込みエラー')
        return;
      }
      
      let Acdn = coin_data.datas.findIndex(element => //Acdn =Author's_coin_data_number
        Author === element.name
      );
      if(Acdn == -1) {
        message.channel.send('**※あなたのコインデータが見つかりませんでした。お手数ですがガチャを回してデータを作成してください。`_cd gacha`**')
        message_log('ギャンブル: コインデータヒットなし')
        return;
      }

      try {
        gamble_data = Object(JSON.parse(fs.readFileSync(gamble_ad, (err, data) => {
          if(err) throw err;
        }), 'utf8'))
      } catch (error) {}

      let e_count = Object(JSON.parse(fs.readFileSync(e_count_ad, (err, data) => {
        if(err) throw err;
      }), 'utf8'))

      try {
        r_files = fs.readdirSync('./.data/gamble/ready_session', "utf8");
        i_files = fs.readdirSync('./.data/gamble/in_session', "utf8");
      } catch (error) {
        message.channel.send('**重大なエラー: ギャンブルデータのリスト読み込みに失敗しました。**')
        message_log('ギャンブル: [重大]ギャンブルデータ読み込み失敗')
        return;
      }

      function bdt(d, A) { // Bet detail text(gamble_data, Author)
        let text = '<配当>`賞金(掛け金)合計: ', betext = '';
        let bets = [], sumbets = 0, i = 0;
        d.choices.forEach(element1 => {
          bets[i] = 0;
          element1.Entries.forEach(element2 => {
            bets[i] = bets[i] + element2.bet;
            sumbets += element2.bet;
          }); i++;
        });
        i = 0;
        text += sumbets+'`\n';
        d.choices.forEach(element1 => {
          let rate = 0;
          if(bets[i] > 0) {
            rate = Math.floor(sumbets/bets[i]*100)/100;
          } else { rate = '---'; }
          text += `**${i+1}**. ${element1.subject}\n`+'`ベット合計:'+bets[i]+' 倍率:'+rate+'倍`\n';
          element1.Entries.forEach(element2 => {
            if(A === element2.player && element2.bet >= 1) {
              betext += `**${i+1}**. ${element2.bet}枚 => **[${Math.ceil(element2.bet*rate)}枚]**\n`; }
          }); i++;
        });
        text = text + '\n<あなたのベット([]内は的中時の予想獲得枚数)>\n' + betext;
        return text;
        }

      function datalist(p, refer, session) { // Gamble data files makes list(setting_page, refer_files, session)
        let text = '', datas;
        if(p == undefined || !isNaN(p)) {
          let page = 1;
          if(!isNaN(p)) page = Number(S[3]);
          let files = refer.slice((page-1)*5, page*5);
          let i = (page-1)*5+1;
          files.forEach(element => {
            datas = Object(JSON.parse(fs.readFileSync(`./.data/gamble/${session}/`+element, (err, data) => {
              if(err) throw err;
            }), 'utf8'));
            text += `**${i}**. *${datas.organizer}*のセッション:\n`+'タイトル: `'+datas.title+'`\nパスコード: `'+datas.passcode+'`\n';
            i++;
          });
          return text;
        }
      }

      function passdata(pas, refer, session) { // Gamble data display with Passcode. (passcode, refer_files, session)
        let search, data;
        refer.forEach(element => {
          search = Object(JSON.parse(fs.readFileSync(`./.data/gamble/${session}/`+element, (err, d) => {
            if(err) throw err;
          }), 'utf8'));
          if(Number(pas) == search.passcode) data = search;
        });
        return data;
      }
      
      if(S[2] == undefined || S[2] === 'help'){
        message.channel.send(undefined, {
          embed: {
            color: "#ff7f00",
            title: "投票ギャンブルコマンド`_cd gamble(gam) ...`",
            description: "`bet <パスコード> <ベット番号> <ベット額>`: 受付中のセッションにベット\n`detail(det)`: セッションの詳細表示\n`end <勝利選択肢(名前)>`: 自身のプレイ中セッションの結果を確定させて終了する。\n`help`: このヘルプを表示\n`open <タイトル> <内容1,2...,6>`: 新しいセッションを作成\n`start`: 準備中の自分のセッションを開始\n"}})
        message_log('投票ギャンブルの説明(コマンドリスト)をチャットしました。')
      }

      if(S[2] === 'open') {
        let beingR = false, beingI = false;
        try { fs.accessSync(ready_ad, fs.constants.F_OK) } catch (error) { beingR = true; }
        try { fs.accessSync(gamble_ad, fs.constants.F_OK) } catch (error) { beingI = true; }

        if(!(beingR && beingI)) {
          message.channel.send('**※あなたのギャンブルはすでに開催されています。**')
          message_log('ギャンブル: 開催失敗(開催中セッションが存在)')
        } else {
          fs.copyFileSync('./.data/.InitialData/gamble_Init.json', ready_ad)
          let Igamble_data = Object(JSON.parse(fs.readFileSync(ready_ad, (err, data) => {
            if(err) throw err;
          }), 'utf8'))
          Igamble_data.title = S[3];
          Igamble_data.organizer = Author;
          Igamble_data.date_ms = Date.now();
          Igamble_data.passcode = Math.floor(Math.random()*10000);
          let s_text = "";
          delete Igamble_data.choices;
          Igamble_data.choices = [];
          for(let i=4; i < S.length && i < 10; i++) {
            let choice = {};
            choice.subject = S[i];
            choice.Entries = [];
            Igamble_data.choices = Igamble_data.choices.concat(choice);
            s_text += `${i-3}. ` + S[i] + '\n';
          }
          fs.writeFileSync(ready_ad, JSON.stringify(Igamble_data))
          message.channel.send(undefined, {
            embed: {
              color: "#ff4500",
              title: ':bellhop:'+Igamble_data.title,
              description: "投票ギャンブル開催(パスコード:`"+Igamble_data.passcode+"`)\n------------------------\n"+`${s_text}\n`+"`_cd gamble bet "+Igamble_data.passcode+" <ベット番号> <ベット額>`\nでベット出来ます。"}})
          message_log(`ギャンブル: 開催成功(主催:${Author})`)
        }
      }

      if(S[2] === 'bet') {
        let files = r_files;
        let data, bet_ad;
        files.forEach(element => {
          let address = './.data/gamble/ready_session/'+element;
          let search = Object(JSON.parse(fs.readFileSync('./.data/gamble/ready_session/'+element, (err, deta) => {
            if(err) throw err;
          }), 'utf8'));
          if(Number(S[3]) == search.passcode) {
            bet_ad = address;
            data = search;
          }
        })
        if(data == undefined) {
          message.channel.send('**※そのセッションはすでにベット締め切り・終了しているか、パスコードが間違っています。**')
          message_log('ギャンブル: ベット失敗(セッション不明)')
          return;
        }
        let choice_num = Number(S[4])-1;
        if(!(0 <= choice_num && choice_num <= data.choices.length-1)) {
          message.channel.send('**※ベットする番号(1~6)を指定してください。**')
          message_log('ギャンブル: ベット失敗(ベット番号無し)')
          return;
        }
        if(isNaN(S[5])) {
          message.channel.send('**※ベット額を入力してください。**')
          message_log('ギャンブル: ベット失敗(ベット額入力無し)')
          return;
        } else if(coin_data.datas[Acdn].coins < Number(S[5])) {
          message.channel.send('**※ベット額が所持コイン枚数を超えています。**`所持コイン枚数:'+coin_data.datas[Acdn].coins+'枚`')
          message_log('ギャンブル: ベット失敗(ベット額>所持コイン枚数)')
          return;
        }
        let fluct = 0;
        let D_check = false;
        data.choices[choice_num].Entries.forEach(element => {
          if(Author === element.player) {
            fluct = element.bet - Number(S[5]);
            element.bet = Number(S[5]);
            D_check = true;
            }
          });
        if(D_check == false) {
          let adddata = {};
          adddata.player = Author;
          fluct = -Number(S[5]);
          adddata.bet = Number(S[5]);
          data.choices[choice_num].Entries = data.choices[choice_num].Entries.concat(adddata);
        }
        coin_data.datas[Acdn].coins += fluct;
        fs.writeFileSync(bet_ad, JSON.stringify(data));
        fs.writeFileSync(coins_ad, JSON.stringify(coin_data));

        let showbet = bdt(data, Author);

        message.channel.send(undefined, {
          embed: {
            color: "#ff4500",
            title: `:white_check_mark:ベット成功(${Author})`,
            description: `タイトル:__**${data.title}(${S[3]})**__\n主催者:__**${data.organizer}**__\n__**${S[4]}番**__にコイン:__**${S[5]}枚**__をベットしました。`+'`残りコイン枚数:'+coin_data.datas[Acdn].coins+'`'+`\n\n${showbet}`}})
        message_log(`ギャンブル: ベット成功(主催:${Author})`)
      }

      if(S[2] === 'start') {
        let data;
        try {
          data = Object(JSON.parse(fs.readFileSync(ready_ad, (err, deta) => {
            if(err) throw err;
          }), 'utf8'));
          fs.copyFileSync(ready_ad, `./.data/gamble/in_session//${Author}.json`)
          fs.unlinkSync(ready_ad)
        } catch (error) {
          message.channel.send('**※あなたが主催する準備中セッションが見つかりませんでした。**')
          message_log('ギャンブル: 開始失敗(準備中セッション不明)')
          return;
        }
        let text = bdt(data, '---');

        message.reply('')
        message.channel.send(undefined, {
          embed: {
            color: "#ff4500",
            title: `:small_blue_diamond:セッション開始(ベット締切):small_blue_diamond:`,
            description: `タイトル:__**${data.title}(${data.passcode})**__\n主催者:__**${data.organizer}**__\n\n${text}`}})
        message_log(`ギャンブル: セッション開始(主催:${Author})`)
      }
      
      if(S[2] === 'detail' || S[2] === 'det') {
        message.channel.send(undefined, {
          embed: {
            color: "#ff7f00",
            title: "投票ギャンブル詳細表示コマンド`_cd gamble(gam) ...`",
            description: "`Rdet [ページ]`: 準備中のセッションを検索します。\n`Idet [ページ]`: プレイ中のセッションを検索します。\n\n4つ目以降の引数を「`p <パスコード>`」にして検索するとそのセッションの詳細を見ることが出来ます。\n**(※終了済みセッション除く)**\n例:`_cd gamble Rdet p 0708`=>「準備中のパスコード:0708のセッションの詳細を表示」"}}) // \n`Edet [ページ]`: 終了済みのセッションを検索します。
        message_log('投票ギャンブル詳細表示の方法をチャットしました。')
      }

      if (S[2] === 'rdetail' || S[2] === 'rdet') {
        let text;
        if(S[3] == undefined || !isNaN(S[3])) {
          let page = 1;
          if (!isNaN(S[3])) page = Number(S[3]);
          text = datalist(S[3], r_files,'ready_session');
          message.channel.send(undefined, {
            embed: {
              color: "#ff4500",
              title: ':green_circle:準備中ギャンブルセッション一覧',
              description: text + `----------ページ:${page}/${Math.ceil(r_files.length / 5)}----------`
            }})
          message_log(`ギャンブル: 準備中セッション一覧表示`)
        } else if (S[3] === 'p') {
          let data = passdata(S[4], r_files, 'ready_session');
          if(data == undefined) {
            message.channel.send('**※そのセッションはすでにベット締め切り・終了しているか、パスコード:`'+S[4]+'`が間違っています。**')
            message_log('ギャンブル: 詳細表示(セッション不明)')
            return;
          }
          text = bdt(data, Author);
          message.channel.send(undefined, {
            embed: {
              color: "#ff4500",
              title: `:green_circle:${data.organizer}の準備中セッション詳細`,
              description: `タイトル:__**${data.title}(${data.passcode})**__\n主催者:__**${data.organizer}**__\n\n${text}`}})
          message_log(`ギャンブル: 準備中セッション詳細表示`)
        }
      }
      
      if (S[2] === 'idetail' || S[2] === 'idet') {
        let text;
        if(S[3] == undefined || !isNaN(S[3])) {
          let page = 1;
          if (!isNaN(S[3])) page = Number(S[3]);
          text = datalist(S[3], i_files, 'in_session');
          message.channel.send(undefined, {
            embed: {
              color: "#ff4500",
              title: ':red_circle:プレイ中ギャンブルセッション一覧',
              description: text + `----------ページ:${page}/${Math.ceil(i_files.length / 5)}----------`
            }})
          message_log(`ギャンブル: プレイ中セッション一覧表示`)
        } else if (S[3] === 'p') {
          let data = passdata(S[4], i_files, 'in_session');
          if(data == undefined) {
            message.channel.send('**※そのセッションは現在行われていないか、パスコード:`'+S[4]+'`が間違っています。**')
            message_log('ギャンブル: 詳細表示(セッション不明)')
            return;
          }
          text = bdt(data, Author);
          message.channel.send(undefined, {
            embed: {
              color: "#ff4500",
              title: `:red_circle:${data.organizer}のプレイ中セッション詳細`,
              description: `タイトル:__**${data.title}(${data.passcode})**__\n主催者:__**${data.organizer}**__\n\n${text}`}})
          message_log(`ギャンブル: プレイ中セッション詳細表示`)
        }
      }

      if(S[2] === 'end') { //終了処理(大事なので日本語コメントあり)
        if(gamble_data == undefined) {
          message.channel.send('**※あなたのプレイ中ギャンブルセッションはありません。**')
          message_log('ギャンブル: 結果処理失敗(プレイ中セッションなし)')
          return;
        }
        let won_n = gamble_data.choices.findIndex(element => //勝利した項目番号を検索
          S[3] === element.subject);
        if(won_n == -1) {
          message.channel.send('**※あなたのプレイ中セクションもしくは該当する掛け項目が見つかりませんでした。**')
          message_log('ギャンブル: 結果処理失敗(該当掛け項目なし)')
          return;
        }
        gamble_data.winner = S[3];
        let bets = [], sumbets = 0, i = 0;
        gamble_data.choices.forEach(element1 => { //選択肢ごとの掛け金の情報と合計掛け金の情報収集
          bets[i] = 0;
          element1.Entries.forEach(element2 => {
            bets[i] = bets[i] + element2.bet;
            sumbets += element2.bet;
          }); i++;
        });
        let winners = ''; i = 0;
        gamble_data.choices[won_n].Entries.forEach(element1 => { //当選処理
          i++;
          let get = Math.ceil(element1.bet / bets[won_n] * sumbets);
          coin_data.datas.forEach(element2 => {
            if(Object.is(element1.player, element2.name)) {
              element2.coins += get;
              winners += `${i}. ${element1.player}:${element1.bet}枚-->**[${get}枚]**\n`
            }
          });
        });
        e_count++;
        try {
          fs.copyFileSync(gamble_ad, `./.data/gamble/end_session/${Author}_${e_count}.json`)
          fs.unlinkSync(gamble_ad)
        } catch (error) {}
        fs.writeFileSync(e_count_ad, e_count)
        fs.writeFileSync(coins_ad, JSON.stringify(coin_data))
        message.channel.send(undefined, { //結果表示
          embed: {
            color: "#4169e1",
            title: `:coin:結果: ${gamble_data.title}`,
            description: `当選番号: **${won_n+1}. ${S[3]}**\n倍率: **${Math.round(sumbets/bets[won_n]*100)/100}倍**\n\n<当選者>\n${winners}`+'\n`-お疲れ様でした-`'}})
        message_log(`ギャンブル: セッション終了、結果表示`)
      }
    }
    //end

  //end
    //導入しているサーバー全てで動作が止まるので、非推奨コマンドです。
        if(message.content == '_cd stop'){
          let O_id = config.owner_id;
          let O_test = message.member.id;
          if(O_id === O_test){
          stop(message.channel)
          }
        }
    
//Random Hiragana generator
    if (message_content.slice(0, 9) === '_cd hrgen'){
      let c = Number(message_content.slice(10))
      let n;
      let str = String();
      if(c > 40){message.channel.send('※**字数は「40」文字以内にしてください。**')}
      if(c == 0 || isNaN(c)){message.channel.send('※**生成文字数を指定してください。**')}
      while(40 >=c && c > 0){
        n = Math.floor(Math.random() * 73)
        str += Hiragana[n]
        c--;
      }
      message.channel.send('生成ワード: ' + str)
      message_log('ひらがなジェネレーターによる文字生成')
    }
//end
//FS_data_money
    if(message_content.slice(0, 9) === '_cd money'){
      debugger
      let mar = message_content.split(' ')
      let source = './fs_data/money'; //基本データ元
      let O_id = Array(config.owner_id)
      let M_id = (element) => element === message.member.id;
      if(O_id.some(M_id) == true){
        if(mar[2] === 'setup'){
          try{
            source += '/' + message.guild.id;
            fs.mkdir(source, (err) =>{
              if(err){
                message.channel.send('何らかのエラーが発生しました')
                message_log('[エラー]マネーシステムセットアップエラー')
              }
                message.channel.send('ギルドデータを新たに作成しました')
                message_log('マネーシステムセットアップ成功')
            })
          }catch{
            message.channel.send('すでにギルドデータが作成されています')
            message_log('[エラー]マネーシステムセットアップ失敗')
          }
          source = source + '/' +message.guild.name + '.txt';
          fs.writeFile(source, message.guild.name, 'utf8', (err) =>{
            if(err){
              message.channel.send('何らかのエラーが発生しました')
              message_log('[エラー]マネーシステムセットアップエラー')
            }
              message.channel.send('セットアップを完了しました')
              message_log('マネーシステムセットアップ完了')
          })
        }
        //if(mar[2] === 'award'){
          //source += '/' + mar[3] + '/' + message.author.id
          //let Ndata = Number(fs.readFileSync(source, 'utf8', (err, data) =>{
            //if(err){}
            //if(data == undefined)Ndata = 0;
            //return Ndata;
          //}))
          //Ndata += Number()
        //}
      }
    }

    if (message_content === '_cd othello') {
      message.reply('誰かと勘違いしてませんか？\n私はオセロ出来ませんよwwwﾌﾟｷﾞｬｰｯ(*´з`)')
    }
  }

//end
});

if (config.token == undefined) {
  console.log('please set ENV: DISCORD_BOT_TOKEN');
  process.exit(0);
}

client.login(config.token);