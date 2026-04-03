package com.itafrotas.orcamento.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.itafrotas.orcamento.dto.OrcamentoRequestDTO;
import com.itafrotas.orcamento.dto.OrcamentoResponseDTO;
import com.itafrotas.orcamento.model.Item;
import com.itafrotas.orcamento.model.Orcamento;
import com.itafrotas.orcamento.repository.OrcamentoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrcamentoService {
    
    private final OrcamentoRepository orcamentoRepository;
    
    @Transactional
    public OrcamentoResponseDTO criarOrcamento(OrcamentoRequestDTO request) {
        Orcamento orcamento = new Orcamento();
        atualizarOrcamento(orcamento, request);
        
        orcamento = orcamentoRepository.save(orcamento);
        return converterParaResponseDTO(orcamento);
    }
    
    @Transactional
    public OrcamentoResponseDTO atualizarOrcamento(Long id, OrcamentoRequestDTO request) {
        Orcamento orcamento = orcamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Orçamento não encontrado"));
        
        atualizarOrcamento(orcamento, request);
        orcamento = orcamentoRepository.save(orcamento);
        return converterParaResponseDTO(orcamento);
    }
    
    private void atualizarOrcamento(Orcamento orcamento, OrcamentoRequestDTO request) {
        orcamento.setEndereco(request.getEndereco());
        orcamento.setCliente(request.getCliente());
        orcamento.setClienteEndereco(request.getClienteEndereco());
        orcamento.setClienteTelefone(request.getClienteTelefone());
        orcamento.setClienteEmail(request.getClienteEmail());
        orcamento.setPlacaCarro(request.getPlacaCarro().toUpperCase());
        orcamento.setModeloCarro(request.getModeloCarro());
        orcamento.setValidade(request.getValidade());
        orcamento.setPorcentagemSinistro(request.getPorcentagemSinistro());
        orcamento.setObservacoes(request.getObservacoes());
        orcamento.setFotos(request.getFotos());
        
        // Atualizar itens
        orcamento.getItens().clear();
        if (request.getItens() != null) {
            request.getItens().forEach(itemDTO -> {
                Item item = new Item();
                item.setDescricao(itemDTO.getDescricao());
                item.setQuantidade(itemDTO.getQuantidade());
                item.setValorUnitario(itemDTO.getValorUnitario());
                orcamento.getItens().add(item);
            });
        }
    }
    
    public OrcamentoResponseDTO buscarOrcamento(Long id) {
        Orcamento orcamento = orcamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Orçamento não encontrado"));
        return converterParaResponseDTO(orcamento);
    }
    
    public List<OrcamentoResponseDTO> listarOrcamentos() {
        return orcamentoRepository.findAll().stream()
                .map(this::converterParaResponseDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public void deletarOrcamento(Long id) {
        orcamentoRepository.deleteById(id);
    }
    
    private OrcamentoResponseDTO converterParaResponseDTO(Orcamento orcamento) {
        BigDecimal subtotal = orcamento.getItens().stream()
                .map(Item::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal percentual = new BigDecimal(orcamento.getPorcentagemSinistro())
                .divide(new BigDecimal(100));
        BigDecimal acrescimo = subtotal.multiply(percentual);
        BigDecimal totalGeral = subtotal.add(acrescimo);
        
        List<OrcamentoResponseDTO.ItemDTO> itensDTO = orcamento.getItens().stream()
                .map(item -> OrcamentoResponseDTO.ItemDTO.builder()
                        .id(item.getId())
                        .descricao(item.getDescricao())
                        .quantidade(item.getQuantidade())
                        .valorUnitario(item.getValorUnitario())
                        .total(item.getTotal())
                        .build())
                .collect(Collectors.toList());
        
        return OrcamentoResponseDTO.builder()
                .id(orcamento.getId())
                .empresa(orcamento.getEmpresa())
                .endereco(orcamento.getEndereco())
                .cliente(orcamento.getCliente())
                .clienteEndereco(orcamento.getClienteEndereco())
                .clienteTelefone(orcamento.getClienteTelefone())
                .clienteEmail(orcamento.getClienteEmail())
                .placaCarro(orcamento.getPlacaCarro())
                .modeloCarro(orcamento.getModeloCarro())
                .validade(orcamento.getValidade())
                .porcentagemSinistro(orcamento.getPorcentagemSinistro())
                .observacoes(orcamento.getObservacoes())
                .itens(itensDTO)
                .fotos(orcamento.getFotos())
                .subtotal(subtotal)
                .acrescimoSinistro(acrescimo)
                .totalGeral(totalGeral)
                .dataCriacao(orcamento.getDataCriacao())
                .dataAtualizacao(orcamento.getDataAtualizacao())
                .build();
    }
}