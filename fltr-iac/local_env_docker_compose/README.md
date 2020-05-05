This project installs:
 - Postgresql 9.6 + postgis 2.5
 - PgAdmin4
 - Tailon
 - Wildfly 8.2.1.Final
 - Nginx 

To run: 
>docker-compose up --build

In your browser you may open the following url:
 - http://localhost:80   - Nginx
 - http://localhost:8070 - PgAdmin
 - http://localhost:8080 - WildFly
 - http://localhost:9990 - WildFly Console
 - http://localhost:8071 - Tailon