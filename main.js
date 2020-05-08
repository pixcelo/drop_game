window.onload = function() {

  // 画面のサイズ
  let width = 10;
  let height = 20;
  let speed = 20; // 1マス分下にさがるまでの間、操作できる最大回数を指定 
  let html = ['<table>'];

  for (let y = 0; y < height; y++) {
    html.push('<tr>');
    for(let x = 0; x < width; x++) {
      html.push('<td></td>');
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
      case 32: // 回転させる
        keys.rotate = true;
        break;
    }
  }
  let tick = 0; // 経過時間
  let move = function() {
    tick++;
    left0 = left;
    
    // マスの枠内で動くように範囲を指定する
    if (keys.left && left > 0) {
      left--;
    }
    if (keys.right && left + 4 < width) {
      left++;
    }
    if (keys.rotate) {
      angle++;
    }
    keys = {}; // 入力ごとに処理を消さないと移動し続けてしまう
    for (let i = -1; i < parts0.length; i++) {
          let offset = parts0[i] || 0;
          cells[top0 * width + left0 + offset].style.backgroundColor = '';
    }
    parts0 = angles[angle % angles.length] // 色を消す為の処理
    for (let i = -1; i < parts0.length; i++) {
          let offset = parts0[i] || 0;
          cells[top * width + left + offset].style.backgroundColor = 'red';
    }

    top0 = top;
    if (tick % speed == 0) {
      top++;
    }
    let info = tick + ' (' + left + ', ' + top + ')';
    document.getElementById('info').innerHTML = info;

    if (top < height) {
      setTimeout(move, 1000 / speed) // 1秒間にspeed回動かせる
    }
  }
  move();
  

}