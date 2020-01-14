package com.spring.angular.service.impl;

import com.google.gson.JsonArray;
import com.spring.angular.dto.BlogDTO;
import com.spring.angular.dto.BlogDetailDTO;
import com.spring.angular.helper.DataUtil;
import com.spring.angular.repository.BlogRepo;
import com.spring.angular.service.BlogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BlogServiceImpl implements BlogService {

    @Autowired
    private BlogRepo blogRepo;

    @Override
    public List<BlogDTO> getListBlog() throws Exception {
        List<BlogDTO> list = new ArrayList<>();
        List<Object[]> listObj = blogRepo.lstBlog();
        for(Object[] object : listObj){
            BlogDTO blogDTO = new BlogDTO();
            blogDTO.setId(DataUtil.safeToLong(object[0]));
            blogDTO.setTitle(DataUtil.safeToString(object[1]));
            blogDTO.setContent(DataUtil.safeToString(object[2]));
            blogDTO.setCreateDate(DataUtil.safeToString(object[3]));
            blogDTO.setImg(DataUtil.safeToString(object[4]));
            blogDTO.setNumSee(DataUtil.safeToInt(object[5]));
            list.add(blogDTO);
        }
        return list;
    }

    @Override
    public List<BlogDetailDTO> lstContentDetail(Long blogId) throws Exception {
        Object[] detailBlog = blogRepo.getBlogDetail(blogId);
        String metaData = DataUtil.safeToString(detailBlog[6]);
        JsonArray jsonArray;
        return null;
    }
}