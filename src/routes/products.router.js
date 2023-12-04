import { Router } from "express";
import ProductManager from "../Managers/ProductManager.js";

const prod = new ProductManager();
const router = Router();

router.get('/',async (req,res)=>{    
    if (req.query.limit === undefined){
        return res.send(await prod.getProducts())
    }
    else {    
        if (!isNaN(parseInt(req.query.limit))){ 
            const productos = await prod.getProducts()                
            if (productos.length >= parseInt(req.query.limit)){                
                const productosLimit = productos.slice(0,parseInt(req.query.limit))
                return res.send(productosLimit)
            }else{
                res.send("quantity of Products requested out of range")
            }     
        }
        else {
            res.send("quantity requested must be a number")
        }
    }    
})

router.get('/:pid',async (req,res)=>{        
        res.send(await prod.getProductById(parseInt(req.params.pid)))
   
})

router.post('/',async (req,res)=>{    
        const datos = req.body;
        const mensaje = await prod.addProduct(datos)       
        res.send({status:"success",message:mensaje})   
   
})

router.put('/:pid', async (req,res)=>{    
        const idAux = parseInt(req.params.pid);
        const datos = req.body; 
        const mensaje = await prod.updateProduct(idAux,datos)        
        res.send({status:"success",message:mensaje})   
   
})

router.delete('/:pid', async (req,res)=>{
  
    const idAux = parseInt(req.params.pid);
    const mensaje = await prod.deleteProduct(idAux)    
    res.send({status:"success",message:mensaje})

})

export default router;