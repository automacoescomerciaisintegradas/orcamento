package com.itafrotas.orcamento.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.itafrotas.orcamento.model.Orcamento;

@Repository
public interface OrcamentoRepository extends JpaRepository<Orcamento, Long> {
    List<Orcamento> findByClienteContainingIgnoreCase(String cliente);
    List<Orcamento> findByPlacaCarroContainingIgnoreCase(String placa);
}