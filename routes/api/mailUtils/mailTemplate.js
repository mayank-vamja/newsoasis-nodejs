const getHtmlContent = (obj) => `
  <!DOCTYPE html>
  <html>
  <head>
  <style>
    table {
      font-family: arial, sans-serif;
      border-collapse: collapse;
      width: 100%;
    }
    td, th {
      border: 1px solid #dddddd;
      text-align: left;
      padding: 8px;
    }
    tr:nth-child(even) {
      background-color: #dddddd;
    }
  </style>
  </head>
  <body>
  <h3>Data received is as follows:</h3>
  <table>
    <tr>
      <th colspan="2">${obj.title}</th>
    </tr>
    ${obj.data.map((i) => "<tr><td>" + i[0] + "</td><td>" + i[1] + "</td></tr>").join("")}
  </table>
  </body>
  </html>`;

module.exports = getHtmlContent;
