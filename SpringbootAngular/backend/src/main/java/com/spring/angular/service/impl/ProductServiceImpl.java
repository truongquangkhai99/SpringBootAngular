package com.spring.angular.service.impl;

import com.spring.angular.dto.AboutDTO;
import com.spring.angular.dto.CartDTO;
import com.spring.angular.dto.ProductDTO;
import com.spring.angular.dto.ProductDetailDTO;
import com.spring.angular.helper.Contains;
import com.spring.angular.helper.DataUtil;
import com.spring.angular.helper.SearchRequest;
import com.spring.angular.repository.ProductRepo;
import com.spring.angular.service.FileInfoService;
import com.spring.angular.service.ProductService;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private FileInfoService fileInfoService;

//    private DecimalFormat df = new DecimalFormat("###");
//    private NumberFormat format = NumberFormat.getInstance();

    @Override
    public List<ProductDTO> getAllProduct() throws Exception {
        List<Object[]> lstObject = productRepo.getProduct();
        List<ProductDTO> productDTOList = new ArrayList<>();

        String proName; String cateName; String des;
        int price;
        Long numLike; int dataIsNew;
        double realPrice;
        String img;
        Long lngId;
        for (Object[] objects : lstObject) {
            ProductDTO productDTO = new ProductDTO();
            lngId = DataUtil.safeToLong(objects[0]);
            proName = String.valueOf(objects[1]);
            Long cateId = DataUtil.safeToLong(objects[10]);
            price = DataUtil.safeToInt(objects[2]);
            numLike = DataUtil.safeToLong(objects[3]);
            cateName = DataUtil.safeToString(objects[4]);
            int discount = DataUtil.safeToInt(objects[5]);
            img = String.valueOf(objects[6]);
            if(!DataUtil.isNullOrEmpty(img)) {
                Resource resource = new ClassPathResource(Contains.IMAGES_PRODUCT_LARGE_SIZE + cateId + "/" + img);
                File file = resource.getFile();
                byte[] fileContent = FileUtils.readFileToByteArray(file);
                String urlImageProduct = Base64.getEncoder().encodeToString(fileContent);
                productDTO.setUrlImage(urlImageProduct);
            }
            realPrice = DataUtil.safeToDouble(objects[7]);
            des = DataUtil.safeToString(objects[8]);
            dataIsNew = DataUtil.safeToInt(objects[9]);

            productDTO.setId(lngId);
            productDTO.setProductName(proName);
            productDTO.setPrice(price);
            productDTO.setNumLike(numLike);
            if(!DataUtil.isNullOrZero(discount)) {
                productDTO.setDiscount(discount);
            }
            productDTO.setCategoryName(cateName);
            if(DataUtil.isNullOrZero(productDTO.getDiscount())){
                productDTO.setRealPrice(price);
            }else {
                productDTO.setRealPrice(realPrice);
            }
            productDTO.setDescription(des);
            if(dataIsNew == 1){
                productDTO.setNew(true);
            }else {
                productDTO.setNew(false);
            }
            productDTO.setCategoryId(cateId);
            productDTOList.add(productDTO);
        }
        return productDTOList;
    }

    @Override
    public List<ProductDTO> searchProduct(SearchRequest searchRequest) throws Exception {
        List<Object[]> lstObject = productRepo.searchProduct(searchRequest);
        List<ProductDTO> productDTOList = new ArrayList<>();
        String proName; String cateName; String des; String img;
        int price; int dataIsNew;
        Long numLike; Long lngId;
        double realPrice;
        for (Object[] objects : lstObject) {
            ProductDTO productDTO = new ProductDTO();
            lngId = DataUtil.safeToLong(objects[0]);
            proName = String.valueOf(objects[1]);
            price = DataUtil.safeToInt(objects[2]);
            numLike = DataUtil.safeToLong(objects[3]);
            cateName = DataUtil.safeToString(objects[4]);
            int discount = DataUtil.safeToInt(objects[5]);
            img = String.valueOf(objects[6]);
            realPrice = DataUtil.safeToDouble(objects[7]);
            des = DataUtil.safeToString(objects[8]);
            dataIsNew = DataUtil.safeToInt(objects[9]);

            productDTO.setId(lngId);
            productDTO.setProductName(proName);
            productDTO.setPrice(price);
            productDTO.setNumLike(numLike);
            if(!DataUtil.isNullOrZero(discount)) {
                productDTO.setDiscount(discount);
            }
            productDTO.setCategoryName(cateName);
            productDTO.setUrlImage(img);
            if(DataUtil.isNullOrZero(productDTO.getDiscount())){
                productDTO.setRealPrice(price);
            }else {
                productDTO.setRealPrice(realPrice);
            }
            productDTO.setDescription(des);
            if(dataIsNew == 1){
                productDTO.setNew(true);
            }else {
                productDTO.setNew(false);
            }
            productDTO.setCategoryId(DataUtil.safeToLong(objects[10]));
            productDTOList.add(productDTO);
        }
        return productDTOList;
    }

    @Override
    public ProductDetailDTO getProductById(Long productId) throws Exception {
        List<Object[]> fileInfoList = fileInfoService.getListByProId(productId);
        List<String> list = new ArrayList<>();
        for(Object[] fileInFo : fileInfoList){
            String url = DataUtil.safeToString(fileInFo[0]);
            Long cateId = DataUtil.safeToLong(fileInFo[1]);
            if(!DataUtil.isNullOrEmpty(url)) {
                Resource resource = new ClassPathResource(Contains.IMAGES_PRODUCT_LARGE_SIZE + cateId + "/" + url);
                File file = resource.getFile();
                byte[] fileContent = FileUtils.readFileToByteArray(file);
                String urlImageProduct = Base64.getEncoder().encodeToString(fileContent);
                list.add(urlImageProduct);
            }
        }
        Object[] objects = null;
        ProductDetailDTO productDetailDTO = new ProductDetailDTO();
        int discount;
        if (productRepo.getProductById(productId) != null) {
            objects = productRepo.getProductById(productId);
        }
        if (objects != null) {
            discount = DataUtil.safeToInt(objects[6]);
            productDetailDTO.setId(DataUtil.safeToLong(objects[0]));
            productDetailDTO.setProductName(DataUtil.safeToString(objects[1]));
            productDetailDTO.setDescription(DataUtil.safeToString(objects[2]));
            productDetailDTO.setPrice(DataUtil.safeToInt(objects[3]));
            productDetailDTO.setNumLike(DataUtil.safeToLong(objects[4]));
            if(!DataUtil.isNullOrZero(discount)) {
                productDetailDTO.setRealPrice(DataUtil.safeToDouble(objects[5]));
            }else {
                productDetailDTO.setRealPrice(productDetailDTO.getPrice());
            }
            if(!DataUtil.isNullOrZero(discount)){
                productDetailDTO.setDiscount(DataUtil.safeToInt(objects[6]));
            }
            productDetailDTO.setUrlImage(list);
            productDetailDTO.setNoData(false);
            productDetailDTO.setCategoryName(DataUtil.safeToString(objects[7]));
            productDetailDTO.setCategoryId(DataUtil.safeToLong(objects[8]));
            return productDetailDTO;
        } else
            productDetailDTO.setNoData(true);
        return productDetailDTO;
    }

    @Override
    public AboutDTO getAboutDTO() throws Exception {
        AboutDTO aboutDTO = new AboutDTO();
        List<Long> lstNumLike = new ArrayList<>();
        List<Long> lstNumBuy = new ArrayList<>();
        long numLike; long totalNumLike = 0;
        long numBuy; long totalNumBuy = 0;
        List<Object[]> list = productRepo.getListAbout();
        Long totalProduct = productRepo.totalProduct(false);
        Long totalIsNew = productRepo.totalProduct(true);
        for(Object[] object : list){
            numLike = DataUtil.safeToLong(object[0]);
            numBuy = DataUtil.safeToLong(object[1]);
            lstNumLike.add(numLike);
            lstNumBuy.add(numBuy);
        }
        for(int i =0;i < lstNumLike.size(); i++){
            totalNumLike = lstNumLike.get(i) + totalNumLike;
        }
        for(int i =0;i < lstNumBuy.size(); i++){
            totalNumBuy = lstNumBuy.get(i) + totalNumBuy;
        }
        aboutDTO.setTotalIsNew(totalIsNew);
        aboutDTO.setTotalNumBuy(totalNumBuy);
        aboutDTO.setTotalNumLike(totalNumLike);
        aboutDTO.setTotalProduct(totalProduct);
        return aboutDTO;
    }

    @Override
    public CartDTO lstSamePro(Long categoryId) throws Exception {
        long numLimitSet = 15;
        List<Object[]> lstSamePro =  productRepo.getListSamePro(categoryId, numLimitSet);
        CartDTO cartDTO = new CartDTO();
        List<ProductDTO> productDTOList = new ArrayList<>();
        long numLimit = lstSamePro.size();
        if(numLimit > 15){
            cartDTO.setNumLimit(15);
        }else {
            cartDTO.setNumLimit(numLimit);
        }
        String proName; String cateName; String des;
        int price;
        Long numLike; int dataIsNew;
        double realPrice;
        String img;
        Long lngId;
        for (Object[] objects : lstSamePro) {
            ProductDTO productDTO = new ProductDTO();
            lngId = DataUtil.safeToLong(objects[0]);
            proName = String.valueOf(objects[1]);
            price = DataUtil.safeToInt(objects[2]);
            numLike = DataUtil.safeToLong(objects[3]);
            cateName = DataUtil.safeToString(objects[4]);
            int discount = DataUtil.safeToInt(objects[5]);
            img = String.valueOf(objects[6]);
            if(!DataUtil.isNullOrEmpty(img)) {
                Resource resource = new ClassPathResource(Contains.IMAGES_PRODUCT_LARGE_SIZE + categoryId + "/" + img);
                File file = resource.getFile();
                byte[] fileContent = FileUtils.readFileToByteArray(file);
                String urlImageProduct = Base64.getEncoder().encodeToString(fileContent);
                productDTO.setUrlImage(urlImageProduct);
            }
            realPrice = DataUtil.safeToDouble(objects[7]);
            des = DataUtil.safeToString(objects[8]);
            dataIsNew = DataUtil.safeToInt(objects[9]);

            productDTO.setId(lngId);
            productDTO.setProductName(proName);
            productDTO.setPrice(price);
            productDTO.setNumLike(numLike);
            if (!DataUtil.isNullOrZero(discount)) {
                productDTO.setDiscount(discount);
            }
            productDTO.setCategoryName(cateName);
            if (DataUtil.isNullOrZero(productDTO.getDiscount())) {
                productDTO.setRealPrice(price);
            } else {
                productDTO.setRealPrice(realPrice);
            }
            productDTO.setDescription(des);
            if (dataIsNew == 1) {
                productDTO.setNew(true);
            } else {
                productDTO.setNew(false);
            }
            productDTO.setCategoryId(DataUtil.safeToLong(objects[10]));
            productDTOList.add(productDTO);
        }
        cartDTO.setProductDTOList(productDTOList);
        return cartDTO;
    }

    @Override
    public String getDiscountCode(String codeDiscount) throws Exception {
        String message;
        if(codeDiscount != null && !codeDiscount.trim().equals("")) {
            String strings = productRepo.getCodeDiscount(codeDiscount);
            if (strings != null){
                String[] code = strings.split("-");
                message = code[0];
            }else {
                message = Contains.CODE_NOT_EXIST;
            }
        }else {
            message = Contains.EMPTY;
        }
        return message;
    }


}
