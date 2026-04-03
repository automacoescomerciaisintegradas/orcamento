package com.itafrotas.orcamento.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.itafrotas.orcamento.dto.OrcamentoRequestDTO;
import com.itafrotas.orcamento.dto.OrcamentoResponseDTO;
import com.itafrotas.orcamento.service.OrcamentoService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/orcamentos")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class OrcamentoController {
    
    private final OrcamentoService orcamentoService;
    
    @PostMapping
    public ResponseEntity<OrcamentoResponseDTO> criarOrcamento(
            @Valid @RequestBody OrcamentoRequestDTO request) {
        OrcamentoResponseDTO response = orcamentoService.criarOrcamento(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<OrcamentoResponseDTO> atualizarOrcamento(
            @PathVariable Long id,
            @Valid @RequestBody OrcamentoRequestDTO request) {
        OrcamentoResponseDTO response = orcamentoService.atualizarOrcamento(id, request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<OrcamentoResponseDTO> buscarOrcamento(@PathVariable Long id) {
        OrcamentoResponseDTO response = orcamentoService.buscarOrcamento(id);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping
    public ResponseEntity<List<OrcamentoResponseDTO>> listarOrcamentos() {
        List<OrcamentoResponseDTO> response = orcamentoService.listarOrcamentos();
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarOrcamento(@PathVariable Long id) {
        orcamentoService.deletarOrcamento(id);
        return ResponseEntity.noContent().build();
    }
}