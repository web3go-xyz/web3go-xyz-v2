## Remove script
- package.json

 ```
  "prepare": "husky install",
 ```
 remove it since we don't use it as git hook




## Update code:
- metabase-0.44.4-src\src\metabase\public_settings\premium_features.clj

```
     (some-> (env :metastore-dev-server-url)
             ;; remove trailing slashes
             (str/replace  #"/$" "")))   
   "http://localhost:12346"))

```
update license server to use local mock license server.
the local mock license server will support all features.

Licence Code When active(64 chars required):
```
0000000000000000000000000000000000000000000000000000000000000000
```
## Update file:
- metabase-0.44.4-src\bin\build-mb\src\build.clj
```
  (case (env/env :mb-edition)
    "oss" :oss
    "ee"  :ee
    nil   :ee))

```
update default build edition as "ee"

## Update Clojure version
```
curl -O https://download.clojure.org/install/linux-install-1.11.1.1165.sh
chmod +x linux-install-1.11.1.1165.sh
sudo ./linux-install-1.11.1.1165.sh
```


## FIx UI error:
- metabase-0.44.4-src\frontend\src\metabase\query_builder\components\notebook\steps\JoinStep.jsx
```
const stepShape = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  query: PropTypes.object.isRequired,
  previewQuery: PropTypes.object,
  valid: PropTypes.bool.isRequired,
  visible: PropTypes.bool.isRequired,
  stageIndex: PropTypes.number.isRequired,
  itemIndex: PropTypes.number.isRequired,
  update: PropTypes.func.isRequired,
  revert: PropTypes.func.isRequired,
  clean: PropTypes.func.isRequired,
  actions: PropTypes.array.isRequired,

  previous: null,
  next: null,
};
stepShape.previous=stepShape;
stepShape.next=stepShape;

```
## Update Code For Security Issue when load JS
- src/metabase/server/middleware/security.clj
```
:script-src
:connect-src

localhost:8080 ==>  *

```

# Update files during development
## It DOES NOT WORK in release version, these configurations are used in hot-reloading server only.

- metabase-0.44.4-src\frontend\src\metabase\lib\api.js

```
//CHANGE_ME change basename to connect webpack hot server, it is used only when DEV.
// basename ="";  // keep empty in PRODUCTION 
  basename = "http://13.214.196.16:3001";  //port should be same with value of [ build-hot:js ] in package.json
  
```
update it to connect with remote js file server provided by webpack, eg: http://13.214.196.16:3001，https://dev-v2.web3go.xyz/webpack


- metabase-0.44.4-src\package.json:

```

 "build-hot:js": "yarn && NODE_OPTIONS=--max-old-space-size=8096 WEBPACK_BUNDLE=hot webpack serve --progress --host 0.0.0.0 --port 3001",
```
manully assign port to hot server.

- metabase-0.44.4-src\webpack.config.js
```
 // point the publicPath (inlined in index.html by HtmlWebpackPlugin) to the hot-reloading server
 config.output.publicPath ="http://13.214.196.16:3001/" + config.output.publicPath;

```


## Be aware if we use nginx as proxy,  handle the location carefully!!!
example:
```
 config.output.publicPath =
    "https://dev-v2.web3go.xyz/webpack/" + config.output.publicPath;
```
the real dir in webpack server will be : /webpack/<original_public_path>

in nginx:
```
     location /webpack/ {
          proxy_pass http://webpackmetabase/webpack/;  //keep the matched location regex
     }

```






