import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../shared/header/header';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-validar-identidade',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './validar-identidade.html',
  styleUrl: './validar-identidade.css',
})
export class ValidarIdentidadeComponent implements OnInit {
  nome = '';
  sobrenome = '';
  mostrarModalSucesso = false;
  mostrarModalErro = false;
  hash: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.hash = this.route.snapshot.queryParamMap.get('hash');
    console.log('Hash recebido:', this.hash);
  }

  validarNome() {
    if (!this.nome || !this.sobrenome || !this.hash) {
      return;
    }

    const dados = {
      nome: this.nome,
      sobrenome: this.sobrenome,
      hash: this.hash,
    };

    this.usuarioService.cadastrar(dados).subscribe({
      next: (usuario: any) => {
        console.log('Usuário criado:', usuario);

        localStorage.setItem('usuario', JSON.stringify(usuario));

        this.mostrarModalSucesso = true;
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error('Erro ao cadastrar:', erro);

        this.mostrarModalErro = true;
        this.cdr.detectChanges();
      },
    });
  }

  irParaGrupos() {
    this.mostrarModalSucesso = false;
    this.router.navigate(['/aluno/grupos']);
  }
}
