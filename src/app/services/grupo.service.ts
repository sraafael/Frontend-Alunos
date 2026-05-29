import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GruposDTO } from '../models/grupos-dto';
import { GrupoUsuario } from '../models/grupo-usuario';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class GrupoService {
  private api!: string;
  private api2!: string;

  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private zone: NgZone
  ) {
    this.api = this.config.getApi('grupos');
    this.api2 = this.config.getApi('grupos-usuarios');
  }

  // ==========================================
  // --- MÉTODOS DO PROFESSOR (RESTAURADOS) ---
  // ==========================================
  
  buscarGrupo(idGrupo: number): Observable<GruposDTO> {
    return this.http.get<GruposDTO>(`${this.api}/${idGrupo}`);
  }

  listarTodosGrupos(): Observable<GruposDTO[]> {
    return this.http.get<GruposDTO[]>(this.api);
  }

  entrarGrupo(dados: GrupoUsuario) {
    return this.http.post(`${this.api2}/mover`, dados);
  }

  resetarTodosGrupos() {
    return this.http.post(`${this.api2}/reset-posicoes`, {});
  }

  resetarGrupo(idGrupo: number) {
    return this.http.post(`${this.api2}/${idGrupo}/reset-posicoes`, {});
  }

  // ==========================================
  // --- MÉTODOS DO ALUNO E TEMPO REAL (NOVOS) ---
  // ==========================================

  listarGrupos(hash: string) {
    const url = this.config.getApi(`trabalhos/${hash}/grupos`);
    return this.http.get<any[]>(url);
  }

  entrarNoGrupo(hash: string, idGrupo: number, idUsuario: number) {
    const url = this.config.getApi(`trabalhos/${hash}/grupos/${idGrupo}/entrar`);
    return this.http.post(url, { idUsuario });
  }

  escutarAtualizacoes(hash: string): Observable<any> {
    const url = this.config.getApi(`trabalhos/${hash}/stream`);
    
    return new Observable(observer => {
      const eventSource = new EventSource(url);

      eventSource.onmessage = event => {
        this.zone.run(() => { observer.next(event.data); });
      };

      eventSource.onerror = error => {
        this.zone.run(() => { console.error('Erro no fluxo de tempo real', error); });
      };

      // Fecha a conexão quando sair da tela
      return () => { eventSource.close(); };
    });
  }
}