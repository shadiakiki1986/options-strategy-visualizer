#!/bin/bash
# http://blog.iron.io/2015/01/aws-lambda-vs-ironworker.html
# Usage: from root directory: bash scripts/upload.sh

if [ ! -d scripts ]; then
  echo "Please use this script from the root folder"
  echo "Usage bash scripts/upload.sh"
  exit
fi

# cannot have grep FunctionName line below with this # set -e

echo "Zipping"
zip -q -r options-strategy-visualizer-nodejs.zip *

aws s3 cp options-strategy-visualizer-nodejs.zip s3://zboota-server/lambda-zip/options-strategy-visualizer-nodejs.zip
upsertFunction() {
  aws lambda list-functions | grep "\"FunctionName\": \"$1\"" > /dev/null
  if [ $? == 0 ]; then
    echo "Updating function $1"
    aws lambda update-function-code \
      --function-name $1 \
      --s3-bucket zboota-server \
      --s3-key lambda-zip/options-strategy-visualizer-nodejs.zip > /dev/null
    
    aws lambda update-function-configuration \
      --function-name $1 \
      --role arn:aws:iam::886436197218:role/lambda_dynamo \
      --handler node_modules/app/$2 \
      --description "$3" \
      --timeout 30 > /dev/null
  else
    echo "Creating function $1"
    aws lambda create-function \
      --function-name $1 \
      --runtime nodejs \
      --role arn:aws:iam::886436197218:role/lambda_dynamo \
      --handler node_modules/app/$2 \
      --description "$3" \
      --timeout 30 \
      --code S3Bucket="zboota-server",S3Key="lambda-zip/options-strategy-visualizer-nodejs.zip" > /dev/null
  fi
}

upsertFunction "opstratvis-margin" "index.margin" "Options strategy visualizer: Calculates the margin of a portfolio"

rm options-strategy-visualizer-nodejs.zip
aws s3 rm s3://zboota-server/lambda-zip/options-strategy-visualizer-nodejs.zip
