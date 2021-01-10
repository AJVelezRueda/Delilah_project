#!/bin/bash
passed_var1=$1
passed_var2=$2
mainsql=db_create.sql

mysql -h localhost -u "delilah" -p -e  "set @user_var1=$passed_var1;set @user_var2=$passed_var2; source $mainsql"