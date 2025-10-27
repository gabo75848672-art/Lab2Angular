import { Component, OnInit } from '@angular/core'; //  OnInit para el ciclo de vida
import { Productoservice } from '../core/services/productoservice';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, CurrencyPipe } from '@angular/common'; // Para usar CommonModule en imports
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CurrencyPipe],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  //declaramos una variables para recibir la data del backend
  productos:any[]=[];
  // === INSERTADO: Propiedad para el Formulario Reactivo ===
  productoForm!: FormGroup;
  categorias: any[] = [
    { id: 1, nombre: 'Electrónica' }, 
    { id: 2, nombre: 'Hogar' },
    { id: 3, nombre: 'Deportes' },
    { id: 4, nombre: 'libros' }
  ]; 

  /**
   *
   */
  // creamo un constructor para llamar a nuestro servicio
   constructor(
    private productoService: Productoservice,
    // === INSERTADO: Inyección del FormBuilder ===
    private fb: FormBuilder 
    // ===========================================
    ){
  }

  // === INSERTADO: Ciclo de vida para inicializar el formulario y cargar datos ===
  ngOnInit(): void {
    this.inicializarFormulario();
    this.listarProductos();
  }
  // ==============================================================================

  // === INSERTADO: Método para inicializar el Formulario ===
  inicializarFormulario(): void {
    this.productoForm = this.fb.group({
      
      nombre: ['', Validators.required],
     
      precio: [null, [Validators.required, Validators.min(0.01)]],

      categoria_id: [null, Validators.required],
    });
  }

  //creamos un metodo para listar productos desde el servicio
  listarProductos():void
  {

    this.productoService.listaProductos().subscribe({
      next:(data)=> {
        this.productos = data
        console.log(this.productos);
      
      },
      error:(err)=>console.error('error al cargar productos',err)
    })
}
    AgregarProducto(): void {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched(); 
      console.warn('Formulario inválido. No se envía.'); 
      return;
    }
const nuevoProducto: any = this.productoForm.value;

    this.productoService.crearProducto(nuevoProducto).subscribe({
      next: (productoCreado: any) => {
        console.log('Producto registrado:', productoCreado);
        
        this.productos.push(productoCreado); 
        
        
        this.productoForm.reset({
          nombre: '',
          precio: null,
         
          categoria_id: null
        });
      },
      error: (err) => console.error('Error al registrar el producto:', err)
    });
  }

}

