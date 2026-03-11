npm run dev > app_output.log 2>&1 &
sleep 15
npm run test:e2e
kill %1
