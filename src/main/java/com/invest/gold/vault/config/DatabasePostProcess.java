package com.invest.gold.vault.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.EnvironmentPostProcessor;
import org.springframework.boot.SpringApplication;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import javax.xml.transform.Result;
import java.sql.*;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;

@Configuration
public class DatabasePostProcess implements EnvironmentPostProcessor {

    String QUERY1 = "SELECT ENV_KEY , ENV_VALUES FROM GOLD_ENV_CONFIG WHERE ENV = ?";


    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {

        Map<String,Object> properties = new LinkedHashMap<>();

        String dbUrl = environment.getProperty("spring.datasource.url");
        String username = environment.getProperty("spring.datasource.username");
        String password = environment.getProperty("spring.datasource.password");
        String env = Objects.requireNonNull(environment.getProperty("env")).toUpperCase();

        try(Connection connection = DriverManager.getConnection(dbUrl,username,password);
            PreparedStatement statement = connection.prepareStatement(QUERY1);){

            statement.setString(1,env);
            try(ResultSet rs = statement.executeQuery()){
                while(rs.next()){
                    properties.put(
                            rs.getString("ENV_KEY"),rs.getString("ENV_VALUES")
                    );
                }
            }


        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

        environment.getPropertySources().addFirst(new MapPropertySource("databaseConfiguration",properties));
    }
}
