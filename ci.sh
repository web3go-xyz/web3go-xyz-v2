#!/bin/bash
echo 'update code'
cd ~/dev-web3go-v2/web3go-xyz-v2/v2-mvp && git pull


echo 'build api-ext service'

cd ~/dev-web3go-v2/web3go-xyz-v2/v2-mvp/api-service-extend 
yarn build && pm2 restart ecosystem.config.js

echo 'build mbstoreapi service'
cd ~/dev-web3go-v2/web3go-xyz-v2/v2-mvp/app-inherit-metabase/mbstoreapi-src 
yarn build && pm2 restart ecosystem.config.js


echo 'build metabase'
cd ~/dev-web3go-v2/web3go-xyz-v2/v2-mvp/app-inherit-metabase/metabase-0.44.4-src
sudo yarn 

sudo bash ./bin/build
echo 'build metabase finished'
cd ./target/uberjar

sudo kill -9 `ps -ef|grep metabase_lastbuild.jar| awk {'print $2'} `
cp metabase.jar metabase_lastbuild.jar
echo 'copied metabase_lastbuild.jar'

echo 'start metabase'
export MB_DB_TYPE=postgres
export MB_DB_DBNAME=dev-web3go-v2-metabase
export MB_DB_PORT=5432
export MB_DB_USER=postgres
export MB_DB_PASS='Dev123!@#'
export MB_DB_HOST=localhost

BUILD_ID=dontKillMe
nohup java -Xmx4g -DMB_JETTY_PORT=3000 -DMB_JETTY_HOST=0.0.0.0 -DMB_EDITION=ee -DMETASTORE_DEV_SERVER_URL=http://localhost:12346 -jar metabase_lastbuild.jar > ./metabase_lastbuild_nohup.out 2>&1 &

echo 'started metabase'

ps -ef|grep metabase_lastbuild.jar
