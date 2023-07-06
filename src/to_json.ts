import fs from 'fs';

function get_lines(pathname = 'download/result.csv') {
  const csv_text = fs.readFileSync(pathname, 'utf8');
  return csv_text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line)
    .filter((line) => /^\d{4,}/.test(line))
    .map((line) => line.split(','))
    .map((line) => line.map((num) => Number(num)))
    .map((line) => line.slice(0, 6));
}

function main() {
  const lines = get_lines();
  console.log(lines[0]);
}

main();
