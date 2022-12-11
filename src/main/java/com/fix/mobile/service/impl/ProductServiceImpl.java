package com.fix.mobile.service.impl;


import com.fix.mobile.dto.ColorProductResponDTO;
import com.fix.mobile.entity.*;
import com.fix.mobile.repository.CapacityRepository;
import com.fix.mobile.repository.ColorRepository;
import com.fix.mobile.service.CapacityService;
import com.fix.mobile.service.ProductService;
import com.fix.mobile.repository.ProductRepository;
import com.fix.mobile.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;

import com.fix.mobile.entity.Category;
import com.fix.mobile.service.ProductService;
import com.fix.mobile.repository.ProductRepository;
import com.fix.mobile.entity.Product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {
    private final ProductRepository repository;


    @Autowired
    private CapacityRepository capacityRepository;

    @Autowired
    private ColorRepository colorRepository;


    public ProductServiceImpl(ProductRepository repository) {
        this.repository = repository;
    }

    @Override
    public Product save(Product entity) {
        return repository.save(entity);
    }

    @Override
    public List<Product> save(List<Product> entities) {
        return (List<Product>) repository.saveAll(entities);
    }

    @Override
    public void deleteById(Integer id) {
        repository.deleteById(id);
    }

    @Override
    public Optional<Product> findById(Integer id) {
        return repository.findById(id);
    }

    @Override
    public List<Product> findAll() {
        return (List<Product>) repository.findAll();
    }

    @Override
    public Page<Product> findAll(Pageable pageable) {
        Page<Product> entityPage = repository.findAll(pageable);
        List<Product> entities = entityPage.getContent();
        return new PageImpl<>(entities, pageable, entityPage.getTotalElements());
    }

    @Override
    public Product update(Product entity, Integer id) {
        Optional<Product> optional = findById(id);
        if (optional.isPresent()) {
            return save(entity);
        }
        return null;
    }
    @Override
    public Page<Product> findShowSale(int pageNumber, int maxRecord, String share) {
        Pageable pageable = PageRequest.of(pageNumber, maxRecord);
        Page<Product> pageProduct = repository.findShowSale(share, pageable);
        return pageProduct;
     }
     
     @Override 
    public Page<Product> getAll(Pageable page) {
        return repository.findAll(page);
    }

    @Override
    public Optional<Product> findByName(String name) {
        return repository.findByName(name);
    }

    public List<Product> findByCategoryAndStatus(Optional<Category> cate) {
        Optional<List<Product>> products= Optional.ofNullable(repository.findByCategoryAndStatus(cate.get(), 1));
        return products.orElse(null);
    }

    @Override
    public List<Product> findByProductLimit() {
        return repository.findByProductLimit();
    }

    @Override
    public List<Product> findByProductLitmitPrice() {
        return repository.findByProductLitmitPrice();
    }

    @Override
    public List<Product> findByNameAndCapacityAndColor(String name, Integer capacity, Integer color) {
        Color colorfind = colorRepository.findById(color).orElse(null);
        Capacity capacityfind = capacityRepository.findById(capacity).orElse(null);
        return repository.findByNameAndCapacityAndColor(name, capacityfind, colorfind);
    }

    @Override
    public List<ColorProductResponDTO> getColorProductByName(String name) {
        List<Product> productList = repository.findColorByNameProduct(name);

        List<ColorProductResponDTO> colorProductResponDTOList = new ArrayList<>();
        for (int i = 0; i < productList.size(); i++) {
            ColorProductResponDTO colorProductResponDTO = new ColorProductResponDTO();
            colorProductResponDTO.setColor(productList.get(i).getColor().getIdColor());
            colorProductResponDTOList.add(colorProductResponDTO);
        }
        return colorProductResponDTOList;
    }


}
