import fs from 'fs';

function get_lines() {
  const csv_text = fs.readFileSync('download/result.csv', 'utf8');
  const lines = csv_text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line)
    .filter((line) => /^\d{4,}/.test(line))
    .map((line) => line.split(','))
    .map((line) => line.map((num) => Number(num)))
    .map((line) => line.slice(0, 6));
  lines.sort((a, b) => a[0] - b[0]);
  return lines;
}

function main() {
  const lines = get_lines();
  fs.writeFileSync('result.json', JSON.stringify(lines, null, 2), 'utf8');
}

main();
