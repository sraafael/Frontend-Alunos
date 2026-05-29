import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GrupoService } from '../../../services/grupo.service';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../services/usuario.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sessao-grupos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sessao-grupos.html',
  styleUrls: ['./sessao-grupos.css']
})
export class SessaoGruposComponent implements OnInit, OnDestroy {
  hashSessao: string | null = null;
  idUsuario: number | null = null;
  grupos: any[] = [];
  erro: string = '';
  isLoading: boolean = false;
  carregandoGrupoId: number | null = null;

  private sseSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private grupoService: GrupoService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit() {
    // 1. Tenta pegar da URL. Se não tiver, busca no SessionStorage (salvou do F5!)
    const sessao = this.usuarioService.recuperarSessao();
    this.hashSessao = this.route.snapshot.queryParamMap.get('hash') || sessao?.hash;
    this.idUsuario = Number(this.route.snapshot.queryParamMap.get('idUsuario')) || sessao?.idUsuario;

    // 2. Se o aluno cair aqui de paraquedas sem dados, joga pro login
    if (!this.hashSessao || !this.idUsuario) {
      this.router.navigate(['/aluno']);
      return;
    }

    this.carregarGrupos(true);

    // 3. A MÁGICA: Escuta o backend. Se alguém mudar de grupo, a tela atualiza sozinha!
    this.sseSubscription = this.grupoService.escutarAtualizacoes(this.hashSessao).subscribe({
       next: () => { this.carregarGrupos(false); } // false = Atualiza silenciosamente sem tela de loading
    });
  }

  ngOnDestroy() {
    if (this.sseSubscription) { this.sseSubscription.unsubscribe(); }
  }

  carregarGrupos(mostrarLoading: boolean) {
    if (mostrarLoading) this.isLoading = true;
    
    this.grupoService.listarGrupos(this.hashSessao!).subscribe({
      next: (data) => {
        this.grupos = data;
        this.isLoading = false;
      },
      error: () => {
        this.erro = 'Erro ao carregar grupos';
        this.isLoading = false;
      }
    });
  }

  entrarGrupo(idGrupo: number) {
    this.carregandoGrupoId = idGrupo;
    this.erro = '';

    this.grupoService.entrarNoGrupo(this.hashSessao!, idGrupo, this.idUsuario!).subscribe({
      next: () => {
        // A lista será recarregada automaticamente pelo SSE (Tempo Real)
        this.carregandoGrupoId = null;
      },
      error: (err) => {
        alert(err.error?.mensagem || 'Erro ao entrar no grupo');
        this.carregandoGrupoId = null;
      }
    });
  }
}