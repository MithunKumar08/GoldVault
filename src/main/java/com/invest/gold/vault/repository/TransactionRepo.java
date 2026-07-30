package com.invest.gold.vault.repository;

import com.invest.gold.vault.entity.TransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionRepo extends JpaRepository<TransactionEntity,Long> {
}
