import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  cadastrar(hash: string, nome: string, sobrenome: string) {
    const url = this.configService.getApi('usuarios/cadastrar');
    return this.http.post<any>(url, { hash, nome, sobrenome });
  }

  // --- NOVOS MÉTODOS DE SESSÃO (PERSISTÊNCIA) ---
  salvarSessao(dados: any) {
    sessionStorage.setItem('alunoSessao', JSON.stringify(dados));
  }

  recuperarSessao() {
    const dados = sessionStorage.getItem('alunoSessao');
    return dados ? JSON.parse(dados) : null;
  }

  limparSessao() {
    sessionStorage.removeItem('alunoSessao');
  }
}