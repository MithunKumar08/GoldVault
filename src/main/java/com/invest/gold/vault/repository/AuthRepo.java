package com.invest.gold.vault.repository;

import com.invest.gold.vault.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthRepo extends JpaRepository<UserEntity,Long> {
    UserEntity findByUserName(String username);
}
