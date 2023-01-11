#/bin/bash
cd ~/dev-web3go-v2/web3go-xyz-v2/v2-mvp && git pull


cd ~/dev-web3go-v2/web3go-xyz-v2/v2-mvp/api-service-extend 
yarn build && pm2 restart ecosystem.config.js

cd ~/dev-web3go-v2/web3go-xyz-v2/v2-mvp/app-inherit-metabase/mbstoreapi-src 
yarn build && pm2 restart ecosystem.config.js

cd ~/dev-web3go-v2/web3go-xyz-v2/v2-mvp/app-inherit-metabase/metabase-0.44.4-src
sudo yarn 

sudo bash ./bin/build

cd ./target/uberjar

sudo kill -9 `ps -ef|grep metabase_lastbuild.jar| awk {'print $2'} `
cp metabase.jar metabase_lastbuild.jar

nohup java -Xmx4g -DMB_JETTY_PORT=3000 -DMB_JETTY_HOST=0.0.0.0 -DMB_EDITION=ee -DMETASTORE_DEV_SERVER_URL=http://localhost:12346 -jar metabase_lastbuild.jar &

ps -ef|grep metabase_lastbuild.jar