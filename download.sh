#!/bin/bash
echo 清理数据...
rm result.json
cd download
rm *.zip *.csv *._csv *.json
npm run download $1 $2
unzip '*.zip'
cat *.csv > result._csv
rm *.csv
mv result._csv result.csv
npm run to_json
rm *.csv
echo 下载完成
