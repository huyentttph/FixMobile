package com.fix.mobile.rest.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fix.mobile.entity.*;
import com.fix.mobile.service.*;
import com.fix.mobile.utils.UserName;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("*")
@RequestMapping(value="/rest/guest")
public class GuestRestController {
    Logger logger = Logger.getLogger(GuestRestController.class);
    @Autowired
    private CategoryService categoryService;
    @Autowired
    private AccessoryService accessoryService;
    @Autowired
    private ProductService productService;
    @Autowired
    private OrderService orderService;
    @Autowired
    private AccountService accountService;
    @Autowired
    private ImayProductService imayProductService;
    @Autowired
    private OrderDetailService orderDetailService;
    
    Order order = null;
    Account account = null;
    @GetMapping("/category/getAll")
    public List<Category> getAll(){
        return categoryService.findAll();
    }
    //find category by accessory
    @GetMapping("/cate")
    public List<Category> findByCate(){
        return categoryService.findByType();
    }
    @GetMapping("/imei/amount/{id}")
    public Integer getAmountImei(@PathVariable("id") Integer id){
        Product product = productService.findById(id).get();
        List<ImayProduct> imeis= imayProductService.findByProductAndStatus(product,1);
        return imeis.size();
    }
    @GetMapping("/accessory/amount/{id}")
    public Integer getAmountAccessory(@PathVariable("id") Integer id){
        Accessory accessory = accessoryService.findById(id).get();
        return accessory.getQuantity();
    }
    //find accessory by id
    @GetMapping(value="/accessory/{id}")
    public Accessory findById(@PathVariable("id") Integer id){
        Optional<Accessory> accessory = accessoryService.findById(id);
        if(accessory.isPresent()){
            return accessory.get();
        }
        return null;
    }

    //find product by id
    @GetMapping(value="/product/{id}")
    public Product findProductById(@PathVariable("id") Integer id){
        Optional<Product> product = productService.findById(id);
        if(product.isPresent()){
            System.out.println(product.get().getName());
            return product.get();
        }
        return null;
    }
    //find accessory by category
    @GetMapping("/accessory/cate-access/{id}")
    public List<Accessory> findByCateAccessId(@PathVariable("id") Integer id){
        Optional<Category> cate = categoryService.findById(id);
        if(cate.isEmpty()){
            return null;
        }
        List<Accessory> accessories = accessoryService.findByCategoryAndStatus(cate);
        return accessories;
    }
    @GetMapping("/product/cate-product/{id}")
    public List<Product> findByCateProductId(@PathVariable("id") Integer id){
        Optional<Category> cate = categoryService.findById(id);
        if(cate.isEmpty()){
            return null;
        }
        List<Product> products = productService.findByCategoryAndStatus(cate);
        for (int i = 0; i < products.size(); i++) {
            List<ImayProduct> imayProducts = imayProductService.findByProductAndStatus(products.get(i),1);
            if(imayProducts.size() == 0){
                products.remove(i);
            }
        }
        return products;
    }
    @PostMapping("/order/add")
    public Order order(@RequestBody Order order){
        account = accountService.findByUsername(UserName.getUserName());
        if(order.getAddress()==null||account==null){
            return null;
        }
        this.order = order;
        order.setAccount(account);
        orderService.save(order);
        logger.info("-- Order: "+order.getIdOrder());
        return order;
    }
    @PostMapping("/order/detail/add")
    public JsonNode cartItems(@RequestBody JsonNode carts){
        account = accountService.findByUsername(UserName.getUserName());
        OrderDetail orderDetail;
        for (int i=0;i<carts.size();i++){
            if(carts.get(i).get("qty").asInt()<=0){
                return null;
            }else{
                orderDetail = new OrderDetail();
                if(carts.get(i).get("idAccessory")!=null){
                    Optional<Accessory> accessory = accessoryService.findById(carts.get(i).get("idAccessory").asInt());
                    if(accessory.isPresent()){
                        orderDetail.setAccessory(accessory.get());
                        orderDetail.setOrder(order);
                        orderDetail.setQuantity(carts.get(i).get("qty").asInt());
                        orderDetail.setPrice(accessory.get().getPrice());
                        orderDetailService.save(orderDetail);
                        accessory.get().setQuantity(accessory.get().getQuantity()-carts.get(i).get("qty").asInt());
                        accessoryService.update(accessory.get(),accessory.get().getIdAccessory());
                    }
                } else if (carts.get(i).get("idProduct")!=null){
                    Optional<Product> product = productService.findById(carts.get(i).get("idProduct").asInt());
                    List<ImayProduct> imayProducts = imayProductService.findByProductAndStatus(product.get(),1);
                    if(product.isPresent()){
                        for (ImayProduct imayProduct : imayProducts) {
                            orderDetail.setImei(imayProduct);
                            imayProduct.setStatus(0);
                            imayProductService.update(imayProduct,imayProduct.getIdImay());
                        }
                        orderDetail.setProduct(product.get());
                        orderDetail.setOrder(order);
                        orderDetail.setQuantity(carts.get(i).get("qty").asInt());
                        orderDetail.setPrice(product.get().getPrice());
                        orderDetailService.save(orderDetail);
                    }
                }
            }
        }
        logger.info("-- OrderDetail success: "+account.getUsername());
        return carts;
    }
    @GetMapping(value ="/findByProductCode/{productCode}")
    public Optional<Product> findByProductCode(@PathVariable("productCode") Integer productCode) {
        Optional<Product> product = productService.findById(productCode);

        return Optional.of(product.get());
    }
}
