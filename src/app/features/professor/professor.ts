import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-professor',
  standalone: true,
  imports: [HeaderComponent, RouterModule],
  templateUrl: './professor.html',
  styleUrls: ['./professor.css']
})
export class ProfessorComponent {}