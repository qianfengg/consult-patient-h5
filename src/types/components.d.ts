import CpNavBar from '@/components/cp-nav-bar.vue'
import CpIcon from '@/components/cp-icon.vue'
import CpRadioBtn from '@/components/cp-radio-btn.vue'
import CpConsultMore from '@/components/cp-consult-more.vue'
import CpPaySheet from '@/components/cp-pay-sheet.vue'
// export default NavBar;
// export type { NavBarProps } from './NavBar';
// declare module 'vue' {
//     interface GlobalComponents {
//         VanNavBar: typeof NavBar;
//     }
// }
declare module 'vue' {
  interface GlobalComponents {
    CpNavBar: typeof CpNavBar
    CpIcon: typeof CpIcon
    CpRadioBtn: typeof CpRadioBtn
    CpConsultMore: typeof CpConsultMore
    CpPaySheet: typeof CpPaySheet
  }
}
