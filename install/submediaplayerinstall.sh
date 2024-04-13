#!/bin/bash
echo "Check if nodejs is installed"
curl -sL https://deb.nodesource.com/setup_18.x | sudo bash - | sudo apt-get install nodejs | sudo apt-get install npm
rm -rf submediaplayer
sleep 5s
git clone https://github.com/erikhandels/submediaplayer.git

echo "Installing submediaplayer in $PWD/submediaplayer"
cd submediaplayer
npm install

sudo sed -i "/#submediaplayer-start/,/#submediaplayer-end/d" /etc/xdg/lxsession/LXDE-pi/autostart
sleep 2s
sudo tee -a /etc/xdg/lxsession/LXDE-pi/autostart > /dev/null <<EOT

#submediaplayer-start
@node $PWD/server.mjs
@xscreensaver -no-splash
@xset s off
@xset -dpms
@xset s noblank
@chromium-browser --kiosk
#submediaplayer-end

EOT

echo "Edited autostart file"
echo -e "\033[32mInstall complete\033[m"
echo "Attempting to reboot..."
sleep 3s
sudo reboot now > /dev/null