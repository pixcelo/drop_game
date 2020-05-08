window.onload = function() {

  // 画面のサイズ
  let width = 12;
  let height = 21;
  let speed = 20; // 1マス分下にさがるまでの間、操作できる最大回数を指定 
  let fills = {};
  let html = ['<table>'];

  for (let y = 0; y < height; y++) {
    html.push('<tr>');
    for (let x = 0; x < width; x++) {
      if (x == 0 || x == width -1 || y == height - 1) {
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
  let angles = [
      [-1, 1, 2],
      [-width, width, width + width],
      [-2, -1, 1],
      [-width - width, -width, width],
  ];
  let angle = 0;
  let angle0 = angle;
  let parts0 = [];
  let keys = {};

  document.onkeydown = function(e) {
    switch((e || event).keyCode) {
      case 37: // 左矢印のキー番号
        keys.left = true;
        break;
      case 39: // 右矢印のキー番号
        keys.right = true;
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
    if (keys.left) {
      left--;
    }
    if (keys.right) {
      left++;
    }
    if (tick % speed == 0) {
      top++;
    }
    if (keys.rotate) {
      angle++;
    }
    keys = {}; // 入力ごとに処理を消さないと移動し続けてしまう
    let parts = angles[angle % angles.length] // 色を消す為の処理

    for (let i = -1; i < parts.length; i++) {
          let offset = parts[i] || 0;
          if ( fills[top * width + left + offset]) {
            left = left0;
            top = top0;
            angle = angle0;
            parts = parts0;
          }
    }

    for (let i = -1; i < parts0.length; i++) {
          let offset = parts0[i] || 0;
          cells[top0 * width + left0 + offset].style.backgroundColor = '';
    }

    parts0 = parts;

    for (let i = -1; i < parts0.length; i++) {
          let offset = parts0[i] || 0;
          cells[top * width + left + offset].style.backgroundColor = 'red';
    }

    let info = tick + ' (' + left + ', ' + top + ')';
    document.getElementById('info').innerHTML = info;
    setTimeout(move, 1000 / speed) // 1秒間にspeed回動かせる

  }
  move();
  

}