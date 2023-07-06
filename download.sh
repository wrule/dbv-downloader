#!/bin/bash
echo 清理目录...
rm result.json
rm download/*.zip
rm download/*.csv
rm download/*._csv
rm download/*.json
npm run download
cd download
unzip '*.zip'
cat *.csv > result._csv
rm *.csv
mv result._csv result.csv
npm run to_json
rm *.csv
