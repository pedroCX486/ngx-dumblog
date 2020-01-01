set BLOGNAME=Custom Title
echo off
cls
echo Compiling ngx-Dumblog...
call ng build --prod
echo.
echo Updating blog information...
call powershell -Command "(gc dist/ngx-dumblog/index.html) -replace '<title>...</title>', '<title>%BLOGNAME%</title>' | Out-File -encoding utf8 dist/ngx-dumblog/index.html"
echo.
echo Complete.
cd dist/ngx-dumblog
explorer .
echo.
pause
exit