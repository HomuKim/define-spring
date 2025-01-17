package com.example.definethebody.service;

import org.springframework.stereotype.Service;

import com.example.definethebody.model.IntroMessage;

@Service
public class IntroService {

	public IntroMessage getCeoMessage() {
		try {
			return new IntroMessage("CEO", "전혜성",
					"저희 디파인더바디를 찾아주셔서 진심으로 감사드립니다.<br>" + "여러분의 건강과 목표 달성을 위해 최고의 피트니스 환경을 제공하는 것이 저희의 사명입니다. "
							+ "각 회원님의 개별적인 목표와 라이프스타일에 맞춘 맞춤형 서비스를 제공하며, " + "건강한 변화와 성장을 함께할 것입니다.<br><br>"
							+ "앞으로도 더욱 혁신적이고 전문적인 서비스를 통해 여러분의 운동 여정을 지원하겠습니다. "
							+ "여러분과 함께 성장하며, 최고의 건강을 이루는 여정이 되기를 바랍니다.<br>" + "감사합니다.<br><br>" + "전혜성 드림",
					"/images/ceo.jpg");
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("CEO 메시지 생성 중 오류 발생", e);
		}
	}

	public IntroMessage getManagerMessage() {
		try {
			return new IntroMessage("MANAGER", "김호연", "저희 디파인더바디에 방문해 주셔서 진심으로 감사드립니다.<br> 저는 회원님들이 목표를 이루고 건강한 변화를 경험하실 수 있도록, 스태프들과 <br>함께 항상 최선을 다해 지원하고 있습니다.<br><br> 각자의 목표에 맞춘 맞춤형 운동 환경을 제공하고, 여러분의 여정에 함께할 수 있어 매우 기쁩니다. 언제든지 필요한 도움이 있으면 말씀해 주세요.<br> 여러분의 건강과 성장을 위해 늘 곁에서 힘이 되어 드리겠습니다. 감사합니다.<br><br> 김호연 드림", "/images/manager.jpg");
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("매니저 메시지 생성 중 오류 발생", e);
		}
	}
}
