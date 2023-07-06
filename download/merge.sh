#!/bin/bash
rm *.csv
rm *.json
unzip '*.zip'
cat *.csv > result._csv
rm *.csv
mv result._csv result.csv
npm run to_json
rm *.csv
