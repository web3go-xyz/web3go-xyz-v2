### Server
dev-v2.web3go.xyz   13.215.119.80

Directory:  ~/dev-zz/web3go-xyz-v2/v2-mvp/app-inherit-metabase/metabase-0.44.4-src


### Build Package
```
sudo yarn
sudo bash ./bin/build
```


###  Kill exising application
```
ps -ef|grep java    // view PID
sudo kill -9 <PID>

```

###  Start
````
 cd ./target/uberjar
 cp metabase.jar metabase1107.jar  //copy jar, to avoid side-effects when rebuild


 // Env variables set

 export MB_DB_TYPE=postgres
 export MB_DB_DBNAME=dev-web3go-v2-metabase
 export MB_DB_PORT=5432
 export MB_DB_USER=postgres
 export MB_DB_PASS='Dev123!@#'
 export MB_DB_HOST=localhost
 

 //set jetty port=3000， proxy by nginx for dev-v2.web3go.xyz

 nohup java -Xmx4g -DMB_JETTY_PORT=3000 -DMB_JETTY_HOST=0.0.0.0 -DMB_EDITION=ee -DMETASTORE_DEV_SERVER_URL=http://localhost:12346 -jar metabase1107.jar &
``
