#!/bin/bash
# Po vytvoření spusť: chmod +x start.sh
cd /Volumes/SSD\ 2TB/DEV/Kvizomat
npm run dev &
sleep 3
open http://localhost:5173
