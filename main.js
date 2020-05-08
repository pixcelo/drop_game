window.onload = function() {

  // 画面のサイズ
  let width = 10;
  let height = 20;
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
  let top = 0;
  let top0 = top; // 元の場所の赤色を消すために用意
  let move = function() {
    // 色を消す処理
    cells[top0 * width + 0].style.backgroundColor = '';
    cells[top0 * width + 1].style.backgroundColor = '';
    cells[top0 * width + 2].style.backgroundColor = '';
    cells[top0 * width + 3].style.backgroundColor = '';
    // 色を塗る処理
    cells[top * width + 0].style.backgroundColor = 'red';
    cells[top * width + 1].style.backgroundColor = 'red';
    cells[top * width + 2].style.backgroundColor = 'red';
    cells[top * width + 3].style.backgroundColor = 'red';
    top0 = top;
    top++;
    if (top < height) {
      setTimeout(move, 1000)
    }
  }
  move();
  

}