echo 'stopping docker-compose containers <feedconsumer>, <contentinquiry>, <nginx> ...'
docker-compose down 

echo 'stopping mongodb ...'
docker stop mongo

echo 'removing created bridge network ...'
docker network remove newslettnetwork