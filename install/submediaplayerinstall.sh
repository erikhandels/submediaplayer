#!/bin/bash
echo "Check if nodejs is installed"
dpkg -s nodejs 2>/dev/null >/dev/null || curl -sL https://deb.nodesource.com/setup_5.x | sudo bash - | apt-get install nodejs
git clone https://github.com/erikhandels/submediaplayer.git

echo "Installing submediaplayer in $PWD/submediaplayer"
cd submediaplayer
npm install
echo "Install complete"

sudo tee -a /etc/xdg/lxsession/LXDE-pi/autostart > /dev/null <<EOT
@node $PWD/server.mjs
@xscreensaver -no-splash
@xset s off
@xset -dpms
@xset s noblank
@chromium-browser --kiosk
EOT

echo "Edited autostart file"
echo ""
echo -e "\033[32mPlease reboot the system to start submediaplayer\033[m"
sudo reboot now > /dev/null