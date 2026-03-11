package com.itafrotas.orcamento.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.itafrotas.orcamento.model.Item;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
}