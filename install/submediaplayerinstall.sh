#!/bin/bash
echo -e "\033[32m Installing submediaplayer in $PWD/submediaplayer \033[m"
curl https://deb.nodesource.com/setup_18.x | sudo bash
echo -e "\033[32mInstalling Nodejs \033[m"
sudo apt-get install nodejs -y

rm -rf submediaplayer
sleep 2s
echo -e "\033[32m Cloning git repository \033[m"
git clone https://github.com/erikhandels/submediaplayer.git
cd submediaplayer
echo -e "\033[32m Installing node packages \033[m"
npm install

echo -e "\033[32m Editing autostart file \033[m"
sudo sed -i "/#submediaplayer-start/,/#submediaplayer-end/d" /etc/xdg/lxsession/LXDE-pi/autostart
sleep 0.5s
sudo tee -a /etc/xdg/lxsession/LXDE-pi/autostart <<EOT

#submediaplayer-start
@node $PWD/server.mjs
@xscreensaver -no-splash
@xset s off
@xset -dpms
@xset s noblank
@chromium-browser --kiosk
#submediaplayer-end

EOT

echo -e "\033[32m Install complete \033[m"
echo -e "\033[32m Attempting to reboot in 3 seconds \033[m"
sleep 3s
sudo reboot now