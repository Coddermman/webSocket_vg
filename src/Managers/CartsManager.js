import { json } from 'express';
import fs from 'fs'

class CartsManager {
    constructor (){
        this.path='./src/Managers/fileCart.json';
        this.carts=[]
    }

    getCarts = async () =>{
        if (fs.existsSync(this.path)){
            const content = await fs.promises.readFile(this.path,'utf-8');            
            return JSON.parse(content);
         }
         return []     
    }

    createCart = async () =>{
        this.carts = await this.getCarts();

        const cart = {
            products : []
        }

        if(this.carts.length===0){
            cart.id = 1;
        }else{
            cart.id = this.carts[this.carts.length-1].id+1;
        }
        this.carts.push(cart)
        await fs.promises.writeFile(this.path,JSON.stringify(this.carts,null,'\t'))

    }

    getCartById = async (id) =>{
        this.carts = await this.getCarts();
        const cartPodId = this.carts.find(element => element.id === id)
        if (cartPodId===undefined){
            return 'Not found'
        }
        else
            {
                return cartPodId.products
            } 
    }

    agregarProductCart = async (cid,pid)=>{        
        const cartIDprod = await this.getCartById(cid);  // se fija si existe el carrito y obtiene los productos 
        if(cartIDprod == 'string') return `product with id${pid} was not found`       
        if (cartIDprod!=='Not found'){            
            this.carts = await this.getCarts();
            const indexAgregar = this.carts.findIndex((element) => element.id  === cid); // obtiene el index del carrito a modificar
            const productoCarritoIndex = cartIDprod.findIndex((prod) => prod.product === pid.product) // se fija si el producto ya existe en ese carrito
            if (productoCarritoIndex===-1){   // si no existe lo agrega al final 
                cartIDprod.push(pid)
                this.carts[indexAgregar].products = cartIDprod;  
                await fs.promises.writeFile(this.path,JSON.stringify(this.carts,null,'\t')) 
                return "product added"
            }
            else{              
                cartIDprod[productoCarritoIndex].quantity += pid.quantity; // y le suma el quantity
                this.carts[indexAgregar].products = cartIDprod;
                await fs.promises.writeFile(this.path,JSON.stringify(this.carts,null,'\t')) 
                return "product added"
            }         
        }
        else {
            return "Carts not found"
        }

    }

}

export default CartsManager;