#!/bin/bash
echo 清理数据...
rm result.json
cd download
rm *.zip *.csv *._csv *.json
npm run download
unzip '*.zip'
cat *.csv > result._csv
rm *.csv
mv result._csv result.csv
npm run to_json
rm *.csv
