package com.fix.mobile.service;

import com.fix.mobile.entity.ChangeDetail;

import java.util.List;

public interface ChangeDetailService extends GenericService<ChangeDetail, Integer> {
	public void createChangeDetails(Integer id);

	public List<ChangeDetail> findPrChangeDetails(Integer idPrChange);
}