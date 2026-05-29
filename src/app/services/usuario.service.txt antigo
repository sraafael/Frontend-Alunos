import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioForm } from '../models/usuario-form';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {

  private api!: string;

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {
    this.api = this.config.getApi('usuarios');
  }

  cadastrar(dados: UsuarioForm) {
    console.log("Dados enviados:", dados);
    return this.http.post(`${this.api}/cadastrar`, dados);
  }

}
