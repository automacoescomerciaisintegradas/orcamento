package com.itafrotas.orcamento.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrcamentoResponseDTO {
    private Long id;
    private String empresa;
    private String endereco;
    private String cliente;
    private String clienteEndereco;
    private String clienteTelefone;
    private String clienteEmail;
    private String placaCarro;
    private String modeloCarro;
    private Integer validade;
    private String porcentagemSinistro;
    private String observacoes;
    private List<ItemDTO> itens;
    private List<String> fotos;
    private BigDecimal subtotal;
    private BigDecimal acrescimoSinistro;
    private BigDecimal totalGeral;
    private LocalDateTime dataCriacao;
    private LocalDateTime dataAtualizacao;
    
    @Data
    @Builder
    public static class ItemDTO {
        private Long id;
        private String descricao;
        private Integer quantidade;
        private BigDecimal valorUnitario;
        private BigDecimal total;
    }
}