package com.fix.mobile.dto;

import com.fix.mobile.entity.Account;
import com.fix.mobile.entity.ChangeDetail;
import com.fix.mobile.entity.Image;
import com.fix.mobile.entity.ProductChange;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.cache.annotation.Caching;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductChangeDTO{
    private Integer idChange;
    private Integer imei;
    private Date dateChange;
    private String note;
    private String email;
    private Boolean status;
    private Account account;
    private List<ChangeDetail> changeDetails;
    private List<Image> listImage;
    private List<MultipartFile> files;
}