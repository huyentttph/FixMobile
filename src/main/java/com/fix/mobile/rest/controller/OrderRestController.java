package com.fix.mobile.rest.controller;

import com.fix.mobile.entity.Accessory;
import com.fix.mobile.entity.Account;
import com.fix.mobile.entity.Order;
import com.fix.mobile.service.AccessoryService;
import com.fix.mobile.service.AccountService;
import com.fix.mobile.service.OrderService;
import com.fix.mobile.utils.UserName;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
@RestController
@CrossOrigin("*")
public class OrderRestController {
    Logger logger = Logger.getLogger(OrderRestController.class);
    @Autowired
    private AccessoryService accessoryService;
    @Autowired
    private AccountService accountService;
    @Autowired
    private OrderService orderService;
    @PutMapping(value="/rest/staff/order")
    public Order update(@RequestBody Order order){
        Order orderOld = orderService.findById(order.getIdOrder()).get();
        if(order.getStatus()<orderOld.getStatus()){
            return null;
        }
        orderOld.setStatus(order.getStatus());
        Account account = accountService.findByUsername(UserName.getUserName());
        if(account.getRole().getName().equals("ADMIN")||account.getRole().getName().equals("STAFF")){
            logger.info("-- Account: "+account.getUsername()+" update order success: "+orderOld.getIdOrder()+" to status: "+order.getStatus());
            orderService.update(orderOld,orderOld.getIdOrder());
            return orderOld;
        }
        return null;
    }
    @GetMapping(value="/rest/staff/order")
    public List<Order> getAll(){
        List<Order> orders = orderService.findAll();
        Comparator<Order> comparator = new Comparator<Order>() {
            @Override
            public int compare(Order o1, Order o2) {
                return o2.getIdOrder().compareTo(o1.getIdOrder());
            }
        };
        Collections.sort(orders,comparator);
        return orders;
    }

    @GetMapping(value="/rest/staff/order/{id}")
    public Order findOrderById(@PathVariable("id") Integer id){
        Order order = orderService.findById(id).get();
        return order;
    }
    @GetMapping(value="/cart-accessory/{id}")
    public Accessory findById(@PathVariable("id") Integer id){
        Optional<Accessory> accessory = accessoryService.findById(id);
        if(accessory.isPresent()){
            return accessory.get();
        }
        return null;
    }
    @GetMapping(value="/rest/user/order")
    public List<Order> getAllByAccount(){
        Account account = accountService.findByUsername(UserName.getUserName());
        List<Order> orders = orderService.findAllByAccount(account);
        Comparator comparator = new Comparator<Order>() {
            @Override
            public int compare(Order o1, Order o2) {
                return o2.getIdOrder().compareTo(o1.getIdOrder());
            }
        };
        Collections.sort(orders,comparator);
        return orders;
    }

    @PostMapping("/rest/user/order/change")
    public Order orderChange(@RequestBody Order order){
        Order orderOld = orderService.findById(order.getIdOrder()).get();
        if(orderOld.getStatus()<2){
            orderOld.setStatus(4);
            orderOld.setNote(order.getNote());
            orderService.update(orderOld,orderOld.getIdOrder());
            return order;
        }
        return null;
    }
}
