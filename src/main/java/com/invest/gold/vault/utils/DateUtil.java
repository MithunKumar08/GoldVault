package com.invest.gold.vault.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

@Component
public class DateUtil {

    public static Logger logger = LoggerFactory.getLogger(DateUtil.class);

    public static LocalDateTime getLocalDate(){
        Date date = new Date();
        LocalDateTime localDate = LocalDateTime.now(ZoneId.of("Asis/Kolkata"));

        logger.info("Date: {}  | Local Date: {}",date,localDate);

        return localDate;
    }

}
