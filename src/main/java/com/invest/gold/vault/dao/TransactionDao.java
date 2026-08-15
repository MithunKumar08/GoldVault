package com.invest.gold.vault.dao;

import com.invest.gold.vault.entity.WalletEntity;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.sql.DataSource;
import java.math.BigDecimal;
import java.sql.*;
import java.time.LocalDateTime;


@Repository
@RequiredArgsConstructor
@Transactional
public class TransactionDao {

    private String NEW_WALLET = "INSERT INTO Wallet (user_id, amount_saved, created_date, last_updated_date) VALUES (?,?,?,?)";
    private String UPDATE_WALLET = "UPDATE WALLET SET amount_saved = ? and last_updated_date = ? where user_id = ?";
    private String SELECT_DATA = "SELECT * FROM WALLET WHERE user_id = ?";

    private final DataSource dataSource;

    private static final Logger logger = LoggerFactory.getLogger(TransactionDao.class);


    public WalletEntity getData(Long userId) {
        WalletEntity wallet = new WalletEntity();

        try (Connection connection = dataSource.getConnection();
             PreparedStatement ps = connection.prepareStatement(SELECT_DATA)) {

            ps.setLong(1,userId);

            ResultSet resultSet = ps.executeQuery();


            while (resultSet.next()){

                wallet.setWalletId(resultSet.getLong("wallet_id"));
                wallet.setUserId(resultSet.getLong("user_id"));
                wallet.setAmount_saved(resultSet.getBigDecimal("amount_saved"));
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return wallet;
    }


    public void saveWalletData(WalletEntity wallet) {
        try (Connection connection = dataSource.getConnection();
             PreparedStatement ps = connection.prepareStatement(NEW_WALLET)) {

            ps.setLong(1, wallet.getUserId());
            ps.setBigDecimal(2, wallet.getAmount_saved());
            ps.setTimestamp(3, Timestamp.valueOf(wallet.getCreatedDate()));
            ps.setTimestamp(4, Timestamp.valueOf(wallet.getLastUpdatedDate()));

            int rowcount = ps.executeUpdate();

            if (rowcount != 0) {
                logger.info("Executed Query Successfully...");
            } else logger.info("Executed Query Failed...");


        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public void updateWallet(BigDecimal amount, LocalDateTime last_updated_date, Long user_id) {
        try (Connection connection = dataSource.getConnection();
             PreparedStatement ps = connection.prepareStatement(UPDATE_WALLET)) {

            ps.setBigDecimal(1, amount);
            ps.setTimestamp(2,Timestamp.valueOf(last_updated_date) );
            ps.setLong(3, user_id);

            int rowcount = ps.executeUpdate();

            if (rowcount != 0) {
                logger.info("Executed Query Successfully...");
            } else logger.info("Executed Query Failed...");


        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
