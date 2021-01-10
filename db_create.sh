#!/bin/bash
passed_var1=$1
mainsql=db_create.sql

mysql -h localhost -u "delilah" -p -e  "set @user_var1=$passed_var1; source $mainsql"