import fs from 'fs'
class ProductManager {
    constructor (){        
        this.path='./src/Managers/fileProduct.json';
        this.products=[]
    }

    // metodos
    addProduct = async (datos) =>{
        const { title, description, price, thumbnail=[], code, stock,category, status } = datos
        this.products = await this.getProducts();          

        const product ={ 
            title,
            description,
            price, 
            thumbnail,
            code,
            stock,
            category,
            status
        }
        // si no hay ningun progducto pone el id en 1 , si no se fija cual es el ultimo el id del ultimo progroducto y le suma 1 
        if(this.products.length===0){
            product.id = 1;
        }else{
            product.id = this.products[this.products.length-1].id+1;
        }

        // validacion de que esten todos los datos por parametros
        if (title && description && price && status && code && stock && category ){
            const result = this.products.find(item => item.code===code);
            // valido que el codigo ingresado no sea el mismo qu otro existente
            if (result=== undefined ){
                this.products.push(product)
                await fs.promises.writeFile(this.path,JSON.stringify(this.products,null,'\t'))
                return  "product added"
            } 
            else{
                return "this code already exists"
            }                       
        }
        else{
            return "some of the fields are missing"
        }
       
    }

    getProducts = async () =>{
        
         if (fs.existsSync(this.path)){
            const content = await fs.promises.readFile(this.path,'utf-8');            
            return JSON.parse(content);
         }
         return [] 
    }
    getProductById = async (id)=>{

        this.products = await this.getProducts();  
        const productoPorId = this.products.find(item => item.id===id);
        if (productoPorId === undefined){
            return 'product Not found'
        }
        else
            {
                return productoPorId
            }        
    }

    updateProduct = async (id,datos) =>{
        this.products = await this.getProducts();        
        const indice = this.products.findIndex(item=>item.id===id)
        if (indice===-1){
            return "there is not product with that id"       
        }
         datos.id=id;
         const newProduct = this.products.map((p) => p.id === id ? { ...p, ...datos } : p
            );

        await fs.promises.writeFile(this.path,JSON.stringify(newProduct,null,'\t'))   
        return "product has been modified"      
    }

    deleteProduct = async (id) =>{
        this.products = await this.getProducts();  
        if(this.products.some(item=> item.id===id)){
            this.products = this.products.filter(item => item.id !==id) 
            if (this.products.length===0){
                if (fs.existsSync(this.path)){
                    await fs.promises.unlink(this.path) 
                    return "product deleted" 
                }            
            }
            else{
                await fs.promises.writeFile(this.path,JSON.stringify(this.products,null,'\t'))  
                return "product deleted"  
            } 
        }
        else{
            return "there is not product with that id"
        }          
    }
}

export default ProductManager;