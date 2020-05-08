window.onload = function() {
  let html = ['<table>'];
  html.push('<tr>');
  for(let i = 0; i < 10; i++) {
    html.push('<td></td>');
  }
    html.push('</tr>');
    html.push('</table>');
    document.getElementById('view').innerHTML = html.join('');
}