#!/bin/bash
rm *.csv
unzip '*.zip'
cat *.csv > result._csv
rm *.csv
mv result._csv result.csv
