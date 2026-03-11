package com.itafrotas.orcamento.dto;

import java.math.BigDecimal;
import java.util.List;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class OrcamentoRequestDTO {
    
    @NotBlank(message = "Endereço é obrigatório")
    private String endereco;
    
    @NotBlank(message = "Cliente é obrigatório")
    private String cliente;
    
    @NotBlank(message = "Endereço do cliente é obrigatório")
    private String clienteEndereco;
    
    @NotBlank(message = "Telefone do cliente é obrigatório")
    @Pattern(regexp = "^\\(\\d{2}\\) \\d{5}-\\d{4}$", 
             message = "Telefone deve estar no formato (00) 00000-0000")
    private String clienteTelefone;
    
    @Email(message = "Email inválido")
    private String clienteEmail;
    
    @NotBlank(message = "Placa do carro é obrigatória")
    @Pattern(regexp = "^[A-Z]{3}-\\d[A-Z]\\d{2}$", 
             message = "Placa deve estar no formato ABC-1D23")
    private String placaCarro;
    
    @NotBlank(message = "Modelo do carro é obrigatório")
    private String modeloCarro;
    
    @Min(value = 1, message = "Validade mínima é 1 dia")
    @Max(value = 365, message = "Validade máxima é 365 dias")
    private Integer validade = 30;
    
    private String porcentagemSinistro = "0";
    private String observacoes;
    private List<ItemDTO> itens;
    private List<String> fotos;
    
    @Data
    public static class ItemDTO {
        @NotBlank(message = "Descrição do item é obrigatória")
        private String descricao;
        
        @Min(value = 1, message = "Quantidade mínima é 1")
        private Integer quantidade;
        
        @DecimalMin(value = "0.01", message = "Valor mínimo é R$ 0,01")
        private BigDecimal valorUnitario;
    }
}