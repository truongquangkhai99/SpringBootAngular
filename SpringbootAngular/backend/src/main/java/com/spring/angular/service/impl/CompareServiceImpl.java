package com.spring.angular.service.impl;

import com.spring.angular.dto.CartDTO;
import com.spring.angular.dto.CompareDTO;
import com.spring.angular.dto.ProductDTO;
import com.spring.angular.dto.ProductDetailDTO;
import com.spring.angular.helper.Contains;
import com.spring.angular.helper.DataUtil;
import com.spring.angular.helper.SearchRequest;
import com.spring.angular.repository.CompareRepo;
import com.spring.angular.repository.ProductRepo;
import com.spring.angular.service.CompareService;
import com.spring.angular.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

@Service
public class CompareServiceImpl implements CompareService {

    @Autowired
    private CompareRepo compareRepo;

    @Autowired
    private ProductRepo productRepo;

    @Override
    public String addCompare(CartDTO cartDTO) throws Exception {
        Long productId = cartDTO.getProductId();
        Long userId = cartDTO.getUserId();
        List<BigInteger> listProId = compareRepo.getListProductToCompare(userId);
        if(listProId.size() >= 2){
            compareRepo.deleteAllData(userId);
            compareRepo.saveCompare(productId, userId);
        }else {
            compareRepo.saveCompare(productId, userId);
        }
        String message = Contains.SUCCESS;
        return message;
    }

    @Override
    public CompareDTO getDataToCompare(CartDTO cartDTO) throws Exception {
        Long userId = cartDTO.getUserId();
        List<BigInteger> listProId = compareRepo.getListProductToCompare(userId);
        CompareDTO compareDTO = new CompareDTO();
        List<ProductDTO> productDTOList = new ArrayList<>();
        for(BigInteger bigInteger : listProId){
            ProductDTO productDTO = new ProductDTO();
            Long productId = bigInteger.longValue();
            Object[] objects = productRepo.findProById(productId);
            productDTO.setId(DataUtil.safeToLong(objects[0]));
            productDTO.setProductName(DataUtil.safeToString(objects[1]));
            int price = DataUtil.safeToInt(objects[2]);
            productDTO.setNumLike(DataUtil.safeToLong(objects[3]));
            int discount = DataUtil.safeToInt(objects[5]);
            productDTO.setDescription(DataUtil.safeToString(objects[8]));
            productDTO.setUrlImage(DataUtil.safeToString(objects[6]));
            if(!DataUtil.isNullOrZero(discount)){
                productDTO.setDiscount(discount);
            }
            if(DataUtil.isNullOrZero(productDTO.getDiscount())){
                productDTO.setRealPrice(price);
            }else {
                productDTO.setRealPrice(DataUtil.safeToDouble(objects[7]));
            }
            productDTO.setCategoryId(DataUtil.safeToLong(objects[10]));
            productDTOList.add(productDTO);
        }
        compareDTO.setList(productDTOList);
        return compareDTO;
    }
}