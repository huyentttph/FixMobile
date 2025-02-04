package com.fix.mobile.service;

import com.fix.mobile.dto.accessory.AccessoryDTO;
import com.fix.mobile.dto.accessory.AccessoryResponDTO;
import com.fix.mobile.entity.Accessory;
import com.fix.mobile.entity.Category;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface AccessoryService extends GenericService<Accessory, Integer> {
    List<Accessory> findByCategoryAndStatus(Optional<Category> cate);

    Page<Accessory> getByPage(int pageNumber, int maxRecord, String share);

    AccessoryResponDTO save(AccessoryDTO accessoryDTO);

    AccessoryResponDTO update(Integer id, AccessoryDTO accessoryDTO);

    List<Accessory> getTop4();
}