echo 'initializing bridge docker network <newslettnetwork> ...'
docker network create newslettnetwork


echo 'starting the mongo database (with replica set enabled) ...'
docker run --rm -d -p 27017:27017 -h $(hostname) \
   	--network newslettnetwork \
   	--name mongo \
   	mongo:4.4.3 --replSet=rs0 && \
   	sleep 4 && \
   	docker exec mongo mongo --eval "rs.initiate();"
  # --add-host=host.docker.internal:host-gateway \

echo 'staring newslett containers as part of docker-compose <feedconsumer>, <contentinquiry>, <nginx> ...'
docker-compose up -d


echo 'wait for few seconds and execute curl POST request to register <dailyhodl> rss feed...'
sleep 4
curl --location --request POST 'localhost:3003/newslett/api/feed/rss' \
--header 'Content-Type: application/json' \
--data-raw '{
    "rssUrl":"https://dailyhodl.com/feed/",
    "name":"dailyhodl",
    "contentLocation":"CONTENT_ENCODED",
    "contentDomSelector":"p",
    "externalLink":"LINK"
}'

echo ''
echo ''
echo 'tailing the logs of <contentinquiry> app. Logs will contains query terms and found rss feed ...'
docker logs -f contentinquiry
