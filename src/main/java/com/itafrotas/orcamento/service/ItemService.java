package com.itafrotas.orcamento.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.itafrotas.orcamento.model.Item;
import com.itafrotas.orcamento.model.Orcamento;
import com.itafrotas.orcamento.repository.ItemRepository;
import com.itafrotas.orcamento.repository.OrcamentoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ItemService {
    
    private final ItemRepository itemRepository;
    private final OrcamentoRepository orcamentoRepository;
    
    @Transactional
    public Item adicionarItem(Long orcamentoId, Item item) {
        Orcamento orcamento = orcamentoRepository.findById(orcamentoId)
                .orElseThrow(() -> new RuntimeException("Orçamento não encontrado"));
        
        // Validar dados do item
        if (item.getDescricao() == null || item.getDescricao().trim().isEmpty()) {
            throw new RuntimeException("Descrição do item é obrigatória");
        }
        
        if (item.getQuantidade() == null || item.getQuantidade() <= 0) {
            throw new RuntimeException("Quantidade deve ser maior que zero");
        }
        
        if (item.getValorUnitario() == null || 
            item.getValorUnitario().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Valor unitário deve ser maior que zero");
        }
        
        // Salvar item
        Item itemSalvo = itemRepository.save(item);
        
        // Adicionar ao orçamento
        orcamento.getItens().add(itemSalvo);
        orcamentoRepository.save(orcamento);
        
        return itemSalvo;
    }
    
    @Transactional
    public List<Item> adicionarMultiplosItens(Long orcamentoId, List<Item> itens) {
        Orcamento orcamento = orcamentoRepository.findById(orcamentoId)
                .orElseThrow(() -> new RuntimeException("Orçamento não encontrado"));
        
        List<Item> itensSalvos = itemRepository.saveAll(itens);
        orcamento.getItens().addAll(itensSalvos);
        orcamentoRepository.save(orcamento);
        
        return itensSalvos;
    }
    
    @Transactional
    public Item atualizarItem(Long itemId, Item itemAtualizado) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item não encontrado"));
        
        // Atualizar campos
        if (itemAtualizado.getDescricao() != null) {
            item.setDescricao(itemAtualizado.getDescricao());
        }
        
        if (itemAtualizado.getQuantidade() != null && itemAtualizado.getQuantidade() > 0) {
            item.setQuantidade(itemAtualizado.getQuantidade());
        }
        
        if (itemAtualizado.getValorUnitario() != null && 
            itemAtualizado.getValorUnitario().compareTo(BigDecimal.ZERO) > 0) {
            item.setValorUnitario(itemAtualizado.getValorUnitario());
        }
        
        return itemRepository.save(item);
    }
    
    @Transactional
    public void removerItem(Long orcamentoId, Long itemId) {
        Orcamento orcamento = orcamentoRepository.findById(orcamentoId)
                .orElseThrow(() -> new RuntimeException("Orçamento não encontrado"));
        
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item não encontrado"));
        
        // Remover do orçamento
        orcamento.getItens().removeIf(i -> i.getId().equals(itemId));
        orcamentoRepository.save(orcamento);
        
        // Deletar o item
        itemRepository.delete(item);
    }
    
    @Transactional
    public void removerTodosItens(Long orcamentoId) {
        Orcamento orcamento = orcamentoRepository.findById(orcamentoId)
                .orElseThrow(() -> new RuntimeException("Orçamento não encontrado"));
        
        // Limpar lista de itens do orçamento
        orcamento.getItens().clear();
        orcamentoRepository.save(orcamento);
        
        // Deletar todos os itens (opcional - pode manter no banco se quiser)
        // itemRepository.deleteAll(orcamento.getItens());
    }
    
    public Item buscarItem(Long itemId) {
        return itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item não encontrado"));
    }
    
    public List<Item> listarItensDoOrcamento(Long orcamentoId) {
        Orcamento orcamento = orcamentoRepository.findById(orcamentoId)
                .orElseThrow(() -> new RuntimeException("Orçamento não encontrado"));
        
        return orcamento.getItens();
    }
    
    public BigDecimal calcularSubtotal(Long orcamentoId) {
        Orcamento orcamento = orcamentoRepository.findById(orcamentoId)
                .orElseThrow(() -> new RuntimeException("Orçamento não encontrado"));
        
        return orcamento.getItens().stream()
                .map(item -> item.getValorUnitario()
                        .multiply(new BigDecimal(item.getQuantidade())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    
    public BigDecimal calcularTotalComSinistro(Long orcamentoId) {
        Orcamento orcamento = orcamentoRepository.findById(orcamentoId)
                .orElseThrow(() -> new RuntimeException("Orçamento não encontrado"));
        
        BigDecimal subtotal = calcularSubtotal(orcamentoId);
        BigDecimal percentual = new BigDecimal(orcamento.getPorcentagemSinistro())
                .divide(new BigDecimal(100));
        BigDecimal acrescimo = subtotal.multiply(percentual);
        
        return subtotal.add(acrescimo);
    }
}