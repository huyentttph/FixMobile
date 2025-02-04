package com.fix.mobile.rest.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fix.mobile.dto.ColorProductResponDTO;
import com.fix.mobile.dto.ProductResponDTO;
import com.fix.mobile.entity.*;
import com.fix.mobile.repository.SaleRepository;
import com.fix.mobile.service.*;
import com.fix.mobile.utils.UserName;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.security.Principal;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
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
    @Autowired
    private SaleRepository saleService;

    @Autowired
    private  CapacityService capacityService;

    @Autowired
    private RamService ramService;

    @Autowired
    private ColorService colorService;
    
    Order order = null;
    Account account = null;
    @GetMapping("/category/getAll")
    public List<Category> getAll(){
        return categoryService.findAllBybStatus();
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

    @GetMapping("/productCount")
    public List<ProductResponDTO> productCount(){
        return productService.getProductCount();
    }

    @GetMapping("/findByPriceExits")
    public List<ProductResponDTO> findByPriceExits(){
        return productService.findByPriceExits();
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
        for (int i = 0; i < accessories.size(); i++) {
            if(accessories.get(i).getQuantity() == 0){
                accessories.remove(i);
            }
        }
        return accessories;
    }
    @GetMapping("/product/cate-product/{id}")
    public List<ProductResponDTO> findByCateProductId(@PathVariable("id") Integer id) throws Exception {
        Optional<Category> cate = categoryService.findById(id);
        if(cate.isEmpty()){
            return null;
        }
        List<ProductResponDTO> productResponDTOList = productService.findByCategoryAndStatus(cate.get().getIdCategory());
        if(productResponDTOList == null) throw new Exception("Product not found");
//        for (int i = 0; i < productResponDTOList.size(); i++) {
//            List<ImayProduct> imayProducts = imayProductService.findByProductAndStatus(productResponDTOList.get(i),1);
//            if(imayProducts.size() == 0){
//                productResponDTOList.remove(i);
//            }
//        }
        return productResponDTOList;
    }
    @PostMapping("/order/add")
    public Order order(@RequestBody Order order){
        account = accountService.findByUsername(UserName.getUserName());
        if(order.getAddress()==null||account==null){
            return null;
        }
        Date date = new Date();
        this.order = order;
        order.setCreateDate(date);
        order.setAccount(account);

        orderService.save(order);
        logger.info("-- Order: "+order.getIdOrder());
        return order;
    }
    @PostMapping("/order/detail/add")
    public JsonNode cartItems(@RequestBody JsonNode carts){
        account = accountService.findByUsername(UserName.getUserName());
        OrderDetail orderDetail;
        BigDecimal price =null;
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
                        orderDetail.setStatus(1);
                        orderDetail.setQuantity(carts.get(i).get("qty").asInt());
                        price = new BigDecimal(carts.get(i).get("price").asDouble());
                        orderDetail.setPrice(price);
                        orderDetailService.save(orderDetail);
                        accessory.get().setQuantity(accessory.get().getQuantity()-carts.get(i).get("qty").asInt());
                        accessoryService.update(accessory.get(),accessory.get().getIdAccessory());
                    }
                } else if (carts.get(i).get("idProduct")!=null){
                    Optional<Product> product = productService.findById(carts.get(i).get("idProduct").asInt());
//                    List<ImayProduct> imayProducts = imayProductService.findByProductAndStatus(product.get(),1);
                    if(product.isPresent()){
                        orderDetail.setProduct(product.get());
                        orderDetail.setOrder(order);
                        orderDetail.setStatus(1);
                        orderDetail.setQuantity(carts.get(i).get("qty").asInt());
                        price = new BigDecimal(carts.get(i).get("price").asDouble());
                        orderDetail.setPrice(price);
                        orderDetailService.save(orderDetail);
//                        for (int j = 0; j < carts.get(i).get("qty").asInt(); j++) {
//                            imayProducts.get(j).setOrderDetail(orderDetail);
//                            imayProducts.get(j).setStatus(0);
//                            imayProductService.update(imayProducts.get(j),imayProducts.get(j).getIdImay());
//                        }
                    }
                }
            }
        }
        logger.info("-- OrderDetail success: "+account.getUsername());
        return carts;
    }


    @GetMapping("/cart/sale")
    public List<Sale> getSaleByAccount(@PathVariable("id") Integer id){
        List<Sale> sales = saleService.findAllByDate();
        return sales;
    }
    @GetMapping(value ="/findByProductCode/{productCode}")
    public Optional<Product> findByProductCode(@PathVariable("productCode") Integer productCode) {
        Optional<Product> product = productService.findById(productCode);

        return Optional.of(product.get());
    }

    @GetMapping("/getAllCapacity")
    public List<Capacity> getAllCapacity(){
        return capacityService.findAll();
    }

    @GetMapping("/getAllRam")
    public List<Ram> getAllRam(){
        return ramService.findAll();
    }

    @GetMapping("/getAllColor")
    public List<Color> getAllColor(){
        return colorService.findAll();
    }


    @GetMapping("/getProductByNameAndCapacityAndColor")
    public List<Product> getProduct(@RequestParam("name") String name,
                              @RequestParam("capacity") Integer capacity,
                              @RequestParam("color") Integer color){
        return productService.findByNameAndCapacityAndColor(name, capacity, color);
    }

    @GetMapping("/getTop4")
    public List<Accessory> getTop4(){
        return accessoryService.getTop4();
    }

    @GetMapping("/getOneAccessory")
    public Accessory getOneAccessory(@RequestParam("id") Integer id){
        return accessoryService.findById(id).orElse(null);
    }

    @GetMapping("/getColorProductByName")
    public List<ColorProductResponDTO> getColorProductByName(@RequestParam("name") String name){
        return productService.getColorProductByName(name);
    }
}
