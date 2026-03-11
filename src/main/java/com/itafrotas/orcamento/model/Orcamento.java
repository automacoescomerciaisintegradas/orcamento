package com.itafrotas.orcamento.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "orcamentos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Orcamento {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String empresa = "ITA Frotas";
    
    private String endereco;
    
    @Column(nullable = false)
    private String cliente;
    
    private String clienteEndereco;
    private String clienteTelefone;
    private String clienteEmail;
    
    @Column(nullable = false)
    private String placaCarro;
    
    private String modeloCarro;
    
    private Integer validade = 30;
    
    private String porcentagemSinistro = "0";
    
    @Column(length = 2000)
    private String observacoes;
    
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "orcamento_id")
    private List<Item> itens = new ArrayList<>();
    
    @ElementCollection
    @CollectionTable(name = "orcamento_fotos", 
                     joinColumns = @JoinColumn(name = "orcamento_id"))
    @Column(name = "foto", length = 5000)
    private List<String> fotos = new ArrayList<>();
    
    private LocalDateTime dataCriacao;
    private LocalDateTime dataAtualizacao;
    
    @PrePersist
    protected void onCreate() {
        dataCriacao = LocalDateTime.now();
        dataAtualizacao = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        dataAtualizacao = LocalDateTime.now();
    }
}