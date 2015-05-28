sudo docker stop noise-management
sudo docker rm noise-management
sudo docker build -t temetz/noise-management .
sudo docker run -i -t -d -p $1:80 -e "APIKEY=$2" --privileged --name noise-management temetz/noise-management
