set current=%cd%

set module=org.scn.community.m.basics
cd ..\src\%module%\script\
call build.cmd
cd %current%
