
echo 'start local application'

java -Xmx4g -DMB_JETTY_PORT=12345 -DMB_JETTY_HOST=0.0.0.0 -DMB_EDITION=ee -DMETASTORE_DEV_SERVER_URL=http://localhost:12346 -jar ./target/uberjar/metabase.jar 
