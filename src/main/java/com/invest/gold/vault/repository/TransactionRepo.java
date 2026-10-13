package com.invest.gold.vault.repository;

import com.invest.gold.vault.entity.TransactionEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepo extends JpaRepository<TransactionEntity,Long> {

    Optional<TransactionEntity> findBySessionId(String sessionId);

    @Query("select t from TransactionEntity t where t.userId = :userId order by lastUpdatedTime desc")
    Page<TransactionEntity> findByUserId(@Param("userId") Long userId, Pageable pages);
}
