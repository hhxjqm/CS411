#/bin/sh

mysql -uroot -p$MYSQL_ROOT_PASSWORD $MYSQL_DATABASE < /seed/init.sql
mysql -uroot -p$MYSQL_ROOT_PASSWORD $MYSQL_DATABASE < /seed/seed.sql
exit 0
