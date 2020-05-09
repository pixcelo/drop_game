window.onload = function() {

  // 画面のサイズ
  let width = 12;
  let height = 21;
  let speed = 20; // 1マス分下にさがるまでの間、操作できる最大回数を指定 
  let fills = {}; // ブロックのあるマスを記録する変数
  let html = ['<table>'];

  for (let y = 0; y < height; y++) {
    html.push('<tr>');
    for (let x = 0; x < width; x++) {
      if (x == 0 || x == width -1 || y == height - 1) { // 左端、右端、下端のとき
        html.push('<td style="background-color:silver"></td>');
        fills[x + y * width] = 'silver';
      } else {
        html.push('<td></td>');
      }
    }
    html.push('</tr>');
  }
  html.push('</table>');

  document.getElementById('view').innerHTML = html.join('');
  let cells = document.getElementsByTagName('td');
  let top = 2;
  let top0 = top; // 元の場所の赤色を消すために用意
  let left = Math.floor(width / 2);
  let left0 = left;

  // 90度毎の回転の角度（起点マスからの相対位置）の配列
  let w = width;
  let blocks = [
    {color: 'cyan', angles:[[-1,1,2],[-w,w,w+w],[-2,-1,1],[-w-w,-w,w]]},
    {color: 'yellow', angles:[[-w-1,-w,-1]]},
    {color: 'green', angles:[[-w,1-w,-1],[-w,1,w+1],[1,w-1,w],[-w-1,-1,w]]},
    {color: 'red', angles:[[-w-1,-w,1],[1-w,1,w],[-1,w,w+1],[-w,-1,w-1]]},
    {color: 'blue', angles:[[-w-1,-1,1],[-w,1-w,w],[-1,1,w+1],[-w,w-1,w]]},
    {color: 'orange', angles:[[1-w,-1,1],[-w,w,w+1],[-1,1,w-1],[-w-1,-w,w]]},
    {color: 'magenta', angles:[[-w,-1,1],[-w,1,w],[-1,1,w],[-w,-1,w]]}
  ];

  let block = blocks[Math.floor(Math.random() * blocks.length)];
  let angle = 0;
  let angle0 = angle; // 回転を元に戻す為の変数
  let parts0 = [];
  let score = 0;
  let score0 = score;
  let keys = {};

  document.onkeydown = function(e) {
    switch((e || event).keyCode) {
      case 37: // 左矢印のキー番号
        keys.left = true;
        break;
      case 39: // 右矢印のキー番号
        keys.right = true;
        break;
      case 40: // 下矢印のキー番号
        keys.down = true;
        break;
      case 32: // スペースキーで回転
        keys.rotate = true;
        break;
    }
  }

  let tick = 0; // 経過時間

  let move = function() {
    tick++;
    left0 = left;
    top0 = top;
    angle0 = angle;

    // マスの枠内で動くように範囲を指定する
    if (tick % speed == 0) {
      top++;
    } else {
      if (keys.left) {
        left--;
      }
      if (keys.right) {
        left++;
      }
      if (keys.down) {
        top++;
      }
      if (keys.rotate) {
        angle++;
      }
    }

    keys = {}; // 入力ごとに処理を消さないと移動し続けてしまう

    let parts = block.angles[angle % block.angles.length]

    // 当たり判定の処理（はみ出さないようにする）
    for (let i = -1; i < parts.length; i++) {
          let offset = parts[i] || 0;

          // ブロックが置かれている（fillを満たす）なら
          if ( fills[top * width + left + offset]) { 

            // 自然落下の場合の処理
            if (tick % speed == 0) {
              for (let j = -1; j < parts0.length; j++) {
                let offset = parts0[j] || 0;
                fills[top0 * width + left0 + offset] = block.color;
              }

              // ブロックが積み重なって得点が変化しなくなったらゲームオーバー
              if(score0 == score) {
                for (let i in fills) {
                  if (fills[i]) {
                    cells[i].style.backgroundColor = 'black';
                  }
                }
                return;
              }

              // ブロックを消す処理
              let cleans = 0;
              // 横一列が全部埋まっているかを調べる
              for (let y = height -2 ; y >= 0; y--) {
                let filled = true;
                // 横列のマスを左から順番に見る
                for (let x = 1; x < width - 1; x++) {
                  // 色が設定されていない場合に処理
                  if (!fills[y * width + x]) {
                    filled = false;
                    break;
                  }
                }
                if (filled) {
                  // y2が今の行、y2 -1 が一つ上の行
                  for (let y2 = y; y2 >= 0; y2--) {
                    for (var x = 1; x < width - 1; x++) {
                      fills[y2 * width + x] = fills[(y2 - 1) * width + x]; 
                    }
                  }
                  y++;
                  cleans++;
                }
              }

              // 一行消した後に得点の追加と下にずれたブロックの再表示
              if (cleans > 0) {
                score += Math.pow(10, cleans) * 10;
                for (let y = height - 2; y >= 0; y--) {
                    for(let x = 1; x < width - 1; x++) {
                      let color = fills[y * width + x] || '';
                      cells[y * width + x].style.backgroundColor = color;
                    }
                }
              }
              block = blocks[Math.floor(Math.random() * blocks.length)];
              left0 = left = Math.floor(width / 2);
              top0 = top = 2;
              angle0 = angle = 0;
              parts0 = parts = block.angles[angle % block.angles.length];
              score0 = score;
          } else {
            // 一つ前の状態を代入して戻す
            left = left0;
            top = top0;
            angle = angle0;
            parts = parts0;
          }
          break;
      }
    }

    if(top != top0) {
      score++;
    }

    // 色を消す処理
    for (let i = -1; i < parts0.length; i++) {
          let offset = parts0[i] || 0;
          cells[top0 * width + left0 + offset].style.backgroundColor = '';
    }

    parts0 = parts;

    // 色を塗る処理
    for (let i = -1; i < parts0.length; i++) {
          let offset = parts0[i] || 0;
          cells[top * width + left + offset].style.backgroundColor = block.color;
    }

    let info = tick + ' (' + left + ', ' + top + ') score: ' + score;
    document.getElementById('info').innerHTML = info;
    setTimeout(move, 1000 / speed) // 1秒間にspeed回動かせる

  }
  move();
  

}