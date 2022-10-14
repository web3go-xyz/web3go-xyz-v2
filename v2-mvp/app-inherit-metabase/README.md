# metabase-magic
work on metabase to integrate with web3go.xyz

# quickstart

```
# install dependencies
sudo yarn 

# build dependencies
sudo bash ./bin/build
 
```

# start dev app
```
# start dev app with h2
sudo yarn dev-ee

# start dev app with postgres database
sudo yarn dev-ee-pg  

```

# release

```
sudo bash ./bin/build

```

# env setup
```
sudo apt install -y vim
sudo apt install -y git
sudo apt install -y openjdk-11*
sudo apt install -y rlwrap
	
sudo apt install -y nodejs
sudo apt install -y npm
sudo npm install -g n
sudo n lts
sudo n
sudo npm install -g yarn

curl -O https://download.clojure.org/install/linux-install-1.11.1.1165.sh
chmod +x linux-install-1.11.1.1165.sh
sudo ./linux-install-1.11.1.1165.sh

```

# run with package

start mbstore service as license mock service
```
cd mbstoreapi-src
yarn && yarn build
pm2 start ecosystem.config.js
```

run jar package with embeded h2 database 
```
 cp <metabase-src>/plugins ./
  
 java -Xmx4g -DMB_JETTY_PORT=12345 -DMB_JETTY_HOST=0.0.0.0 -DMB_EDITION=ee -DMETASTORE_DEV_SERVER_URL=http://localhost:12346 -jar metabase.jar
 
```

run jar package with postgres database
```
 cp <metabase-src>/plugins ./  

 export MB_DB_TYPE=postgres
 export MB_DB_DBNAME=dev-web3go-v2-metabase
 export MB_DB_PORT=5432
 export MB_DB_USER=postgres
 export MB_DB_PASS='Dev123!@#'
 export MB_DB_HOST=localhost
 java -Xmx4g -DMB_JETTY_PORT=12345 -DMB_JETTY_HOST=0.0.0.0 -DMB_EDITION=ee -DMETASTORE_DEV_SERVER_URL=http://localhost:12346 -jar metabase.jar
 
```