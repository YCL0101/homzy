import { StackView } from "@react-navigation/stack";
import React, { useState, useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
  Linking,
  Platform,
  ScrollView,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function Protocol() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.paragraph}>
        北京冰川世纪科技有限公司在此特别提醒用户认真阅读、充分理解本《多宝游戏社区最终用户许可协议》（下称《协议》）中各条款，包括免除或者限制北京冰川世纪科技有限公司责任的免责条款及对用户的权利限制条款，特别是法律适用、争议解决方式等条款。除非您接受本《协议》所有条款，否则您无权注册、申请多宝游戏社区帐号及其相关服务。
      </Text>
      <Text style={styles.paragraph}>
        1、多宝游戏社区帐号的所有权归北京冰川世纪科技有限公司，用户完成申请注册后，获得多宝游戏社区帐号的使用权。
      </Text>
      <Text style={styles.paragraph}>
        2、多宝游戏社区帐号使用权仅属于初始申请注册人，禁止赠与、借用、租用、转让或售卖。如果北京冰川世纪科技有限公司发现使用者并非帐号初始注册人，北京冰川世纪科技有限公司有权在未经通知的情况下回收该帐号而无需向该帐号使用人承担法律责任，由此带来的包括并不限于用户通讯中断、用户资料和游戏道具等清空等损失由用户自行承担。
      </Text>
      <Text style={styles.paragraph}>
        3、用户可以通过注册多宝游戏社区帐号使用北京冰川世纪科技有限公司提供的相应服务，用户使用北京冰川世纪科技有限公司的服务时，须同时遵守各项服务的服务条款。
      </Text>
      <Text style={styles.paragraph}>
        4、用户承担多宝游戏社区帐号与密码的保管责任，并就其帐号及密码项下之一切活动负全部责任。
      </Text>
      <Text style={styles.paragraph}>
        5、用户多宝游戏社区帐号在丢失或遗忘密码后，须遵照北京冰川世纪科技有限公司的申诉途径及时申诉请求找回帐号。北京冰川世纪科技有限公司的密码找回机制仅识别申诉单上所填资料与系统记录资料的正确性，而无法识别申诉人是否系真正帐号权使用人。对用户因被他人冒名申诉而致的任何损失，北京冰川世纪科技有限公司不承担任何责任，用户知晓多宝游戏社区帐号及密码保管责任在于用户，北京冰川世纪科技有限公司并不承诺多宝游戏社区帐号丢失或遗忘密码后用户一定能通过申诉找回帐号。
      </Text>
      <Text style={styles.paragraph}>
        6、用户注册多宝游戏社区帐号后如果长期不使用，北京冰川世纪科技有限公司有权回收帐号，以免造成资源浪费，由此带来的包括并不限于用户通信中断、用户资料、邮件和游戏道具丢失等损失由用户自行承担。
      </Text>
      <Text style={styles.paragraph}>
        7、用户在使用多宝游戏社区服务过程中，必须遵循以下原则：
      </Text>
      <Text style={styles.paragraph}>7.1 不得违反中华人民共和国法律法规及相关国际条约或规则；</Text>
      <Text style={styles.paragraph}>7.2 不得违反与网络服务、多宝游戏社区服务有关的网络协议、规定、程序及行业规则；</Text>
      <Text style={styles.paragraph}>7.3 不得进行任何可能对互联网或移动网正常运转造成不利影响的行为；</Text>
      <Text style={styles.paragraph}>7.4 不得上传、展示或传播任何不实虚假、冒充性的、骚扰性的、中伤性的、攻击性的、辱骂性的、恐吓性的、种族歧视性的、诽谤诋毁、泄露隐私、成人情色、恶意抄袭的或其他任何非法的信息资料；</Text>
      <Text style={styles.paragraph}>7.5 不得以任何方式侵犯其他任何人依法享有的专利权、著作权、商标权等知识产权，或姓名权、名称权、名誉权、荣誉权、肖像权、隐私权等人身权益，或其他任何合法权益；</Text>
      <Text style={styles.paragraph}>7.6 不得从事其他任何影响多宝游戏社区平台正常运营、破坏多宝游戏社区平台经营模式或其他有害多宝游戏社区平台生态的行为。</Text>
      <Text style={styles.paragraph}>7.7 不得为其他任何非法目的而使用多宝游戏社区服务。</Text>
      <Text style={styles.paragraph}>
        8、 用户违约责任：
      </Text>
      <Text style={styles.paragraph}>8.1 如因用户违反有关法律、法规或本协议项下的任何条款而给多宝游戏平台及其关联公司或任何其他任何第三方造成损失，用户同意承担由此造成的损害赔偿责任。</Text>
      <Text style={styles.paragraph}>8.2 如多宝游戏社区发现、或收到第三方举报或投诉获知，用户存在或涉嫌违反本协议的规则，多宝游戏社区或其授权主体有权依据其合理判断不经通知立即采取一切必要措施以减轻或消除用户行为造成的影响。</Text>
      <Text style={styles.paragraph}>8.3 除本协议另有约定外，如多宝游戏社区发现、或收到第三方举报或投诉获知，用户存在或涉嫌违反本协议中约定的义务、保证、承诺或其他条款，用户应在多宝游戏社区指定期限内予以纠正并消除影响；若用户未在前述时限内予以纠正的，多宝游戏社区或其授权主体有权依据其合理判断立即采取一切必要措施以减轻或消除用户行为造成的影响。</Text>
      <Text style={styles.paragraph}>8.4 本协议8.2、8.3中所述的“一切必要措施”包括但不限于以下一项或多项：</Text>
      <Text style={styles.paragraph}>8.4.1 更改、删除或屏蔽相关内容；</Text>
      <Text style={styles.paragraph}>8.4.2 警告违规帐号、帐号禁言；</Text>
      <Text style={styles.paragraph}>8.4.3 变更、限制或禁止违规帐号部分或全部功能；</Text>
      <Text style={styles.paragraph}>8.4.4 暂停、限制或终止用户使用多宝游戏社区服务的权利、注销用户帐号等；</Text>
      <Text style={styles.paragraph}>8.4.5 向有关监管部门或国家机关报告；</Text>
      <Text style={styles.paragraph}>8.4.6 其他多宝游戏社区认为合理的措施。</Text>
      <Text style={styles.paragraph}>9、 协议修改相关规则</Text>
      <Text style={styles.paragraph}>9.1 多宝游戏社区有权随时修改本协议的任何条款，一旦本协议的内容发生变动，北京冰川世纪科技有限公司将会在官方网站上公布修改之后的协议内容，多宝游戏社区也可选择通过其他适当方式（比如系统通知）向用户通知修改内容。</Text>
      <Text style={styles.paragraph}>9.2 如果不同意多宝游戏社区对本协议相关条款所做的修改，用户有权停止使用多宝社区的服务。如果用户继续使用多宝社区的服务，则视为用户接受多宝游戏社区对本协议相关条款所做的修改。</Text>
      <Text style={styles.paragraph}>10、本《协议》签订地为北京。本《协议》的解释、效力及纠纷的解决，适用于中华人民共和国法律。若用户和北京冰川世纪科技有限公司之间发生任何纠纷或争议，首先应友好协商解决，协商不成的，用户在此完全同意将纠纷或争议提交北京冰川世纪科技有限公司所在地即北京市有管辖权的人民法院管辖。</Text>
      <Text style={styles.paragraph}>11、其他未尽事宜，用户可通过北京冰川世纪科技有限公司客户服务电话：010-82731240，及服务网站：www.tgamebox.cn垂询。</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp("1%"),
    backgroundColor: "white",
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 5,
  },
});
