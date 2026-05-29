import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-validar-identidade',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './validar-identidade.html',
  styleUrls: ['./validar-identidade.css']
})
export class ValidarIdentidadeComponent implements OnInit {
  hashSessao: string | null = null;
  nome: string = '';
  sobrenome: string = '';
  erro: string = '';
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit() {
    this.hashSessao = this.route.snapshot.queryParamMap.get('hash');
    if (!this.hashSessao) {
      this.erro = 'Código da sessão não encontrado. Retorne e insira o código.';
    }
  }

  entrar() {
    if (!this.nome || !this.sobrenome) {
      this.erro = 'Por favor, preencha nome e sobrenome.';
      return;
    }

    this.isLoading = true; // Inicia a animação de loading
    this.erro = '';

    this.usuarioService.cadastrar(this.hashSessao!, this.nome, this.sobrenome).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        // Salva na memória do navegador para sobreviver ao F5
        this.usuarioService.salvarSessao({
          hash: this.hashSessao,
          idUsuario: response.idUsuario,
          nomeFormatado: response.nome
        });

        this.router.navigate(['/aluno/grupos']);
      },
      error: (err) => {
        this.isLoading = false;
        this.erro = err.error?.mensagem || 'Erro ao validar identidade. Tente outro nome.';
      }
    });
  }
}